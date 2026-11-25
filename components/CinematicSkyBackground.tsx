'use client';

import React, { useEffect, useRef, useState } from 'react';

export interface CelestialTimeInfo {
  hours: number; // 0..24 fractional
  formattedTime: string;
  phaseLabel: string;
  phaseIcon: string;
  moonPhaseName: string;
  moonIlluminationPct: number;
  isDay: boolean;
  isLive: boolean;
}

/** Known astronomical New Moon epoch: 2000-01-06 18:14 UTC */
const KNOWN_NEW_MOON_UTC = Date.UTC(2000, 0, 6, 18, 14, 0);
const SYNODIC_MONTH_MS = 29.53058867 * 86400 * 1000;

export function getRealLunarPhase(date: Date = new Date()): {
  phase: number; // 0 = new, 0.25 = first quarter, 0.5 = full, 0.75 = last quarter
  illuminationPct: number;
  name: string;
} {
  const diff = date.getTime() - KNOWN_NEW_MOON_UTC;
  const wrapped = ((diff % SYNODIC_MONTH_MS) + SYNODIC_MONTH_MS) % SYNODIC_MONTH_MS;
  const phase = wrapped / SYNODIC_MONTH_MS;
  const illuminationPct = Math.round(((1 - Math.cos(phase * Math.PI * 2)) / 2) * 100);

  let name = 'Full Moon';
  if (phase < 0.03 || phase >= 0.97) name = 'New Moon';
  else if (phase < 0.22) name = 'Waxing Crescent';
  else if (phase < 0.28) name = 'First Quarter';
  else if (phase < 0.47) name = 'Waxing Gibbous';
  else if (phase < 0.53) name = 'Full Moon';
  else if (phase < 0.72) name = 'Waning Gibbous';
  else if (phase < 0.78) name = 'Last Quarter';
  else name = 'Waning Crescent';

  return { phase, illuminationPct, name };
}

export function getCelestialTimeInfo(overrideHour: number | null, now: Date = new Date()): CelestialTimeInfo {
  const isLive = overrideHour === null;
  const hours = isLive
    ? now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600 + now.getMilliseconds() / 3600000
    : ((overrideHour % 24) + 24) % 24;

  const hh = Math.floor(hours);
  const mm = Math.floor((hours - hh) * 60);
  const formattedTime = `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;

  let phaseLabel = 'Midnight Cosmos';
  let phaseIcon = '🌕';
  if (hours >= 5.0 && hours < 6.75) {
    phaseLabel = 'Golden Dawn';
    phaseIcon = '🌅';
  } else if (hours >= 6.75 && hours < 11.0) {
    phaseLabel = 'Morning Sun';
    phaseIcon = '🌤️';
  } else if (hours >= 11.0 && hours < 16.25) {
    phaseLabel = 'High Daylight';
    phaseIcon = '☀️';
  } else if (hours >= 16.25 && hours < 18.6) {
    phaseLabel = 'Crimson Sunset';
    phaseIcon = '🌇';
  } else if (hours >= 18.6 && hours < 20.0) {
    phaseLabel = 'Cyber Twilight';
    phaseIcon = '🌆';
  } else {
    phaseLabel = 'Starlit Night';
    phaseIcon = '🌙';
  }

  const lunar = getRealLunarPhase(now);
  return {
    hours,
    formattedTime,
    phaseLabel,
    phaseIcon,
    moonPhaseName: lunar.name,
    moonIlluminationPct: lunar.illuminationPct,
    isDay: hours >= 5.75 && hours <= 18.25,
    isLive,
  };
}

function computeCelestialVectors(hours: number, lunarPhase: number) {
  // Solar progression across 24h cycle:
  // 06:00 -> Dawn on East (+x), 12:00 -> Noon Overhead, 18:00 -> Sunset on West (-x)
  const solarAngle = ((hours - 6.0) / 24.0) * Math.PI * 2.0;
  const sunRawX = Math.cos(solarAngle) * 0.68;
  const sunRawY = Math.sin(solarAngle) * 0.40 + 0.02;
  const sunRawZ = 0.88;
  const sunLen = Math.hypot(sunRawX, sunRawY, sunRawZ) || 1.0;
  const sunDir: [number, number, number] = [sunRawX / sunLen, sunRawY / sunLen, sunRawZ / sunLen];

  // Moon trajectory arcs cleanly in the open sky between top HUD banner and mountain peaks
  const phaseDrift = (lunarPhase - 0.5) * 0.35 + 0.24;
  const moonAngle = solarAngle + Math.PI + phaseDrift;
  const moonRawX = Math.cos(moonAngle) * 0.62;
  const moonRawY = Math.sin(moonAngle) * 0.34 + 0.05;
  const moonRawZ = 0.88;
  const moonLen = Math.hypot(moonRawX, moonRawY, moonRawZ) || 1.0;
  const moonDir: [number, number, number] = [moonRawX / moonLen, moonRawY / moonLen, moonRawZ / moonLen];

  return { sunDir, moonDir };
}

const VERTEX_SHADER = `
attribute vec2 a_pos;
void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_mouse;
uniform vec3 u_sunDir;
uniform vec3 u_moonDir;
uniform float u_moonPhase;
uniform float u_isBoss;
uniform float u_horizonShift;

// Dave Hoskins precision-safe hash functions (zero mobile GPU trig artifacts)
float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

vec2 hash22(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973));
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.xx + p3.yz) * p3.zy);
}

float hash13(vec3 p3) {
  p3 = fract(p3 * 0.1031);
  p3 += dot(p3, p3.zyx + 31.32);
  return fract((p3.x + p3.y) * p3.z);
}

vec3 hash33(vec3 p3) {
  p3 = fract(p3 * vec3(0.1031, 0.1030, 0.0973));
  p3 += dot(p3, p3.yxz + 33.33);
  return fract((p3.xxy + p3.yxx) * p3.zyx);
}

float noise2D(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash12(i + vec2(0.0, 0.0)), hash12(i + vec2(1.0, 0.0)), u.x),
    mix(hash12(i + vec2(0.0, 1.0)), hash12(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float noise3D(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  vec3 u = f * f * (3.0 - 2.0 * f);
  float n000 = hash13(i + vec3(0.0, 0.0, 0.0));
  float n100 = hash13(i + vec3(1.0, 0.0, 0.0));
  float n010 = hash13(i + vec3(0.0, 1.0, 0.0));
  float n110 = hash13(i + vec3(1.0, 1.0, 0.0));
  float n001 = hash13(i + vec3(0.0, 0.0, 1.0));
  float n101 = hash13(i + vec3(1.0, 0.0, 1.0));
  float n011 = hash13(i + vec3(0.0, 1.0, 1.0));
  float n111 = hash13(i + vec3(1.0, 1.0, 1.0));
  float nx00 = mix(n000, n100, u.x);
  float nx10 = mix(n010, n110, u.x);
  float nx01 = mix(n001, n101, u.x);
  float nx11 = mix(n011, n111, u.x);
  return mix(mix(nx00, nx10, u.y), mix(nx01, nx11, u.y), u.z);
}

float fbmClouds(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
  for (int i = 0; i < 4; i++) {
    v += a * noise2D(p);
    p = rot * p * 2.04 + vec2(17.1, 31.7);
    a *= 0.5;
  }
  return v;
}

float ridgedMountain(float x, float seed) {
  float sum = 0.0;
  float amp = 0.55;
  float freq = 1.0;
  for (int i = 0; i < 4; i++) {
    float n = noise2D(vec2(x * freq + seed, seed * 0.37));
    float ridge = 1.0 - abs(n * 2.0 - 1.0);
    sum += amp * ridge * ridge;
    freq *= 2.12;
    amp *= 0.46;
  }
  return sum;
}

float starLayer(vec3 dir, float scale, float density) {
  vec3 p = dir * scale;
  vec3 id = floor(p);
  vec3 f = fract(p) - 0.5;
  vec3 rnd = hash33(id);
  vec3 offset = (rnd - 0.5) * 0.62;
  float d = length(f - offset);
  float size = mix(0.02, 0.09, pow(rnd.x, 3.5));
  float star = smoothstep(size, 0.0, d);
  float twinkle = 0.65 + 0.35 * sin(u_time * (1.8 + rnd.y * 4.5) + rnd.z * 6.2831);
  float mask = step(1.0 - density, rnd.z);
  return star * twinkle * mask;
}

vec3 getAtmosphereBase(vec3 rd, float dayW, float twilightW, float nightW) {
  float h = clamp(rd.y, 0.0, 1.0);
  float horizonCurve = pow(1.0 - h, 3.2);

  // Night sky colors (deep cosmos, subtle crimson hint in boss mode)
  vec3 nightZenith = mix(vec3(0.008, 0.015, 0.042), vec3(0.025, 0.006, 0.014), u_isBoss);
  vec3 nightHorizon = mix(vec3(0.032, 0.068, 0.135), vec3(0.095, 0.020, 0.032), u_isBoss);
  vec3 nightCol = mix(nightZenith, nightHorizon, horizonCurve);

  // Dawn / Sunset palette (molten gold -> magenta -> deep violet)
  vec3 twZenith = mix(vec3(0.055, 0.055, 0.16), vec3(0.09, 0.03, 0.08), u_isBoss);
  vec3 twMid = mix(vec3(0.32, 0.14, 0.28), vec3(0.45, 0.11, 0.18), u_isBoss);
  vec3 twHoriz = vec3(0.98, 0.40, 0.14);
  vec3 twCol = mix(mix(twZenith, twMid, smoothstep(0.0, 0.55, 1.0 - h)), twHoriz, pow(1.0 - h, 4.0));

  // Daylight palette (cinematic rich stratosphere cobalt -> sunlit mist)
  vec3 dayZenith = vec3(0.035, 0.125, 0.32);
  vec3 dayHoriz = vec3(0.28, 0.49, 0.72);
  vec3 dayCol = mix(dayZenith, dayHoriz, pow(1.0 - h, 2.5));

  float weightSum = max(dayW + twilightW + nightW, 0.001);
  vec3 col = (dayCol * dayW + twCol * twilightW + nightCol * nightW) / weightSum;

  // Forward Mie scattering near Sun (warm golden-amber bloom)
  float sunDot = max(dot(rd, u_sunDir), 0.0);
  float sunVis = smoothstep(-0.18, 0.12, u_sunDir.y);
  vec3 sunScatterCol = mix(vec3(1.0, 0.36, 0.12), vec3(1.0, 0.85, 0.60), smoothstep(0.0, 0.35, u_sunDir.y));
  col += sunScatterCol * pow(sunDot, 4.5) * 0.42 * sunVis;

  // Forward Mie scattering near Moon (cool icy-silver or blood-moon aura)
  float moonDot = max(dot(rd, u_moonDir), 0.0);
  float moonVis = smoothstep(-0.08, 0.12, u_moonDir.y) * nightW;
  vec3 moonHaloCol = mix(vec3(0.26, 0.42, 0.68), vec3(0.68, 0.16, 0.22), u_isBoss);
  col += moonHaloCol * pow(moonDot, 7.0) * 0.38 * moonVis;

  return col;
}

vec3 renderSkyAndCelestial(vec3 rd, float dayW, float twilightW, float nightW, bool isReflection) {
  vec3 col = getAtmosphereBase(rd, dayW, twilightW, nightW);

  // 1. Stars + Milky Way + Aurora (visible at night and fading smoothly into twilight)
  float starVis = clamp(nightW + twilightW * 0.35, 0.0, 1.0) * smoothstep(-0.02, 0.18, rd.y);
  if (starVis > 0.01) {
    // Rotate star sphere slightly over time
    float ang = u_time * 0.004;
    float cs = cos(ang);
    float sn = sin(ang);
    vec3 starRd = vec3(rd.x * cs + rd.z * sn, rd.y, -rd.x * sn + rd.z * cs);

    // Galactic plane Milky Way dust ribbon
    vec3 galNormal = normalize(vec3(0.45, 0.55, 0.70));
    float band = exp(-pow(dot(starRd, galNormal) * 4.2, 2.0));
    float dust = noise3D(starRd * 6.5) * 0.6 + noise3D(starRd * 14.0) * 0.4;
    float rift = smoothstep(0.32, 0.72, dust);
    vec3 milkyTint = mix(vec3(0.08, 0.13, 0.24), vec3(0.18, 0.06, 0.10), u_isBoss);
    col += milkyTint * band * rift * starVis * 0.85;

    // Multi-layered crisp stars with subtle color temperatures & cinema cross-flare sparkles
    float s1 = starLayer(starRd, 85.0, 0.11);
    float s2 = starLayer(starRd + vec3(1.7, 3.1, 2.4), 150.0, 0.16);
    vec3 tempRand = hash33(floor(starRd * 85.0));
    vec3 starTint = mix(vec3(0.75, 0.86, 1.0), vec3(1.0, 0.90, 0.76), tempRand.x);
    col += (s1 * 1.42 * starTint + s2 * 0.68) * starVis;

    // Distant Ringed Celestial Planet (Subtle Mythic Sci-Fi/Fantasy Skybox Accent)
    if (!isReflection) {
      vec3 pDir = normalize(vec3(0.58, 0.36, 0.73));
      float pVis = clamp(nightW * 0.72 + twilightW * 0.28, 0.0, 1.0);
      if (dot(rd, pDir) > 0.75 && pVis > 0.02) {
        vec3 pRight = normalize(cross(vec3(0.0, 1.0, 0.0), pDir));
        vec3 pUp = cross(pDir, pRight);
        vec2 pLoc = vec2(dot(rd, pRight), dot(rd, pUp)) / 0.022;
        float pLen = length(pLoc);
        if (pLen < 1.0) {
          float pz = sqrt(max(0.0, 1.0 - pLen * pLen));
          vec3 pNorm = normalize(vec3(pLoc.x, pLoc.y, pz));
          float pLight = smoothstep(-0.2, 0.65, dot(pNorm, normalize(vec3(-0.65, 0.45, 0.5))));
          float bands = 0.85 + 0.15 * sin(pLoc.y * 18.0 + noise2D(pLoc * 4.0) * 2.0);
          vec3 pBody = mix(vec3(0.18, 0.28, 0.48), vec3(0.62, 0.74, 0.95), pLight) * bands;
          pBody = mix(pBody, vec3(0.85, 0.34, 0.32) * (0.28 + 0.72 * pLight), u_isBoss * 0.7);
          float pEdge = smoothstep(1.0, 0.86, pLen);
          col = mix(col, pBody * 0.85, pEdge * pVis);
        }
        // Tilted Icy Planetary Ring Plane
        float ca = 0.92;
        float sa = -0.39;
        vec2 rTilt = vec2(pLoc.x * ca - pLoc.y * sa, (pLoc.x * sa + pLoc.y * ca) * 4.1);
        float rDist = length(rTilt);
        float ringMask = smoothstep(1.18, 1.32, rDist) * smoothstep(2.45, 2.22, rDist);
        float ringGap = 1.0 - 0.55 * exp(-pow((rDist - 1.78) * 14.0, 2.0));
        float frontHalf = rTilt.y > 0.0 ? 1.0 : step(1.0, pLen);
        vec3 ringCol = mix(vec3(0.42, 0.66, 0.94), vec3(0.92, 0.36, 0.34), u_isBoss);
        col += ringCol * ringMask * ringGap * frontHalf * 0.28 * pVis;
      }
    }

    // Slow Gliding Celestial Comet with Ion & Dust Tail (clamp args to avoid IEEE-754 exp overflow/NaN)
    if (!isReflection) {
      float cometCycle = fract(u_time * 0.024);
      vec2 cometStart = vec2(-0.72, 0.46);
      vec2 cometEnd = vec2(0.82, 0.18);
      vec2 cometPos = mix(cometStart, cometEnd, cometCycle);
      vec2 cDiff = rd.xy - cometPos;
      vec2 tailDir = normalize(cometStart - cometEnd);
      float along = dot(cDiff, tailDir);
      float safeAlong = max(along, 0.0);
      float perp = abs(dot(cDiff, vec2(-tailDir.y, tailDir.x)));
      float comaGlow = exp(-min(length(cDiff) * 95.0, 24.0));
      float tailMask = smoothstep(-0.001, 0.014, along);
      float tailCone = tailMask * exp(-min(safeAlong * 7.5, 24.0)) * exp(-min(perp / (0.0035 + safeAlong * 0.055), 24.0));
      float cometFade = smoothstep(0.0, 0.12, cometCycle) * smoothstep(1.0, 0.82, cometCycle);
      vec3 cometCol = mix(vec3(0.42, 0.92, 1.0), vec3(1.0, 0.42, 0.28), u_isBoss);
      col += cometCol * (comaGlow * 1.45 + tailCone * 0.62) * cometFade * nightW;
    }

    // Periodic Shooting Stars / Meteors (only in main sky for clarity)
    if (!isReflection) {
      float mCycle = u_time * 0.22;
      float mId = floor(mCycle);
      float mFrac = fract(mCycle);
      if (mFrac < 0.24) {
        vec2 mr = hash22(vec2(mId, 7.31));
        vec2 startUV = vec2((mr.x - 0.5) * 1.4, 0.22 + mr.y * 0.35);
        vec2 vel = normalize(vec2(mr.x > 0.5 ? -1.0 : 1.0, -0.42)) * 0.55;
        vec2 curHead = startUV + vel * (mFrac / 0.24);
        vec2 proj = rd.xy;
        vec2 pa = proj - (curHead - vel * 0.22);
        vec2 ba = vel * 0.22;
        float hProj = clamp(dot(pa, ba) / max(dot(ba, ba), 0.0001), 0.0, 1.0);
        float dMeteor = length(pa - ba * hProj);
        float trail = smoothstep(0.006, 0.0, dMeteor) * pow(hProj, 2.4) * smoothstep(0.0, 0.04, mFrac) * smoothstep(0.24, 0.16, mFrac);
        col += vec3(0.92, 0.96, 1.0) * trail * 2.2 * nightW;
      }
    }

    // Dynamic Shimmering Aurora Borealis Ribbons
    float aurHeight = smoothstep(0.10, 0.38, rd.y) * smoothstep(0.78, 0.32, rd.y);
    if (aurHeight > 0.01) {
      vec2 aUV = vec2(rd.x * 2.4 + sin(rd.z * 3.0) * 0.4, rd.z * 1.8);
      float wave1 = noise2D(aUV + vec2(u_time * 0.035, u_time * 0.015));
      float wave2 = noise2D(aUV * 2.3 - vec2(u_time * 0.04, 0.0));
      float curtain = smoothstep(0.46, 0.78, wave1 * 0.65 + wave2 * 0.35);
      vec3 aurColA = mix(vec3(0.05, 0.58, 0.48), vec3(0.72, 0.08, 0.20), u_isBoss);
      vec3 aurColB = mix(vec3(0.24, 0.22, 0.72), vec3(0.95, 0.42, 0.10), u_isBoss);
      vec3 aurColor = mix(aurColA, aurColB, smoothstep(0.18, 0.52, rd.y));
      col += aurColor * curtain * aurHeight * nightW * 0.48;
    }
  }

  // 2. 3D Shaded Cratered Moon Sphere
  vec3 mRight = normalize(cross(vec3(0.0, 1.0, 0.0), u_moonDir + vec3(0.0001, 0.0, 0.0)));
  vec3 mUp = cross(u_moonDir, mRight);
  float moonAngularR = 0.052;
  vec2 mLocal = vec2(dot(rd, mRight), dot(rd, mUp)) / moonAngularR;
  float mDist = length(mLocal);
  float moonAbove = smoothstep(-0.04, 0.04, u_moonDir.y);

  // Subtle lunar corona always outside/around disk
  float mDot = max(dot(rd, u_moonDir), 0.0);
  float coronaFade = mix(0.28, 1.0, nightW);
  vec3 moonCoronaTint = mix(vec3(0.60, 0.74, 0.96), vec3(0.95, 0.32, 0.28), u_isBoss);
  col += moonCoronaTint * pow(mDot, 90.0) * 0.65 * moonAbove * coronaFade;

  if (mDist < 1.0 && dot(rd, u_moonDir) > 0.0 && moonAbove > 0.01) {
    float z = sqrt(max(0.0, 1.0 - mDist * mDist));
    vec3 mNorm = normalize(vec3(mLocal.x, mLocal.y, z));

    // Procedural Lunar Maria (seas) & Cratering
    vec3 surfCoord = mNorm * 2.8;
    float mariaNoise = noise3D(surfCoord) * 0.65 + noise3D(surfCoord * 2.1) * 0.35;
    float craters = noise3D(surfCoord * 6.5) * 0.55 + noise3D(surfCoord * 13.0) * 0.45;
    float craterShadowDelta = noise3D(surfCoord * 6.5 + vec3(0.08, 0.04, 0.0)) - craters;

    vec3 highlandCol = vec3(0.92, 0.93, 0.96);
    vec3 mariaCol = vec3(0.36, 0.40, 0.46);
    vec3 lunarAlbedo = mix(mariaCol, highlandCol, smoothstep(0.36, 0.68, mariaNoise));
    lunarAlbedo *= mix(0.80, 1.15, craters);

    // Perturb sphere normal by crater bump height near terminator
    vec3 bumpedNorm = normalize(mNorm + vec3(craterShadowDelta * 1.6, craterShadowDelta * 1.1, 0.0));

    // Realistic Lunar Phase Light Vector (synodic phase angle 0..1)
    float phaseAngle = u_moonPhase * 6.2831853;
    // Ensure near-full phase gleams richly; directional light matches real lunar phase
    vec3 lightDir = normalize(vec3(-sin(phaseAngle), 0.14, -cos(phaseAngle)));
    float nDotL = dot(bumpedNorm, lightDir);
    float litFactor = smoothstep(-0.06, 0.18, nDotL);
    float diffuse = mix(0.055, 1.25, litFactor) * (0.72 + 0.28 * max(nDotL, 0.0));

    // Warm atmospheric harvest tint when Moon is close to horizon
    vec3 horizonMoonTint = mix(vec3(1.0, 0.72, 0.46), vec3(1.0, 0.98, 0.96), smoothstep(0.0, 0.24, u_moonDir.y));
    vec3 bossMoonTint = mix(vec3(1.0), vec3(1.08, 0.62, 0.58), u_isBoss * 0.65);

    vec3 moonPixel = lunarAlbedo * diffuse * horizonMoonTint * bossMoonTint * 1.65;
    float rimAA = smoothstep(1.0, 0.955, mDist);

    // Physical blending: at night occludes stars cleanly; in daytime bright portions shine subtly through blue sky
    float daytimeContrast = mix(1.0, 0.42, dayW);
    col = mix(col, max(col * (1.0 - litFactor * 0.4) * dayW, moonPixel * daytimeContrast + col * dayW * 0.65), rimAA * moonAbove);
  }

  // 3. Blazing HDR 3D Sun + Corona + Cinema Anamorphic Lens Flare
  float sDot = max(dot(rd, u_sunDir), 0.0);
  float sunAbove = smoothstep(-0.06, 0.05, u_sunDir.y);
  if (sunAbove > 0.01) {
    float sunAngle = acos(clamp(sDot, -1.0, 1.0));
    float sunRadius = 0.042;
    float sunDisk = smoothstep(sunRadius * 1.15, sunRadius * 0.85, sunAngle);
    vec3 sunCoreCol = mix(vec3(1.0, 0.42, 0.12), vec3(1.0, 0.96, 0.86), smoothstep(0.0, 0.25, u_sunDir.y));

    // Intense HDR Sun Core & Corona
    col += sunCoreCol * sunDisk * 3.8 * sunAbove;
    col += sunCoreCol * pow(sDot, 160.0) * 1.9 * sunAbove;
    col += vec3(1.0, 0.58, 0.22) * pow(sDot, 32.0) * 0.55 * sunAbove;

    // Horizontal Anamorphic Cinema Streak (skip inside blurred water reflection)
    if (!isReflection) {
      vec3 sRight = normalize(cross(vec3(0.0, 1.0, 0.0), u_sunDir + vec3(0.0001, 0.0, 0.0)));
      vec3 sUp = cross(u_sunDir, sRight);
      vec2 sLocal = vec2(dot(rd, sRight), dot(rd, sUp));
      float anamorphicStreak = exp(-abs(sLocal.y) * 95.0) * exp(-abs(sLocal.x) * 3.8);
      vec3 flareTint = mix(vec3(1.0, 0.55, 0.22), vec3(0.75, 0.88, 1.0), smoothstep(0.1, 0.35, u_sunDir.y));
      col += flareTint * anamorphicStreak * 0.45 * sunAbove;
    }
  }

  // 4. 3D Volumetric-Shaded Drifting Cloudscape (rd.y > 0.01)
  if (rd.y > 0.008) {
    float cDist = 1.0 / (rd.y + 0.075);
    vec2 cloudUV = rd.xz * cDist * 0.58 + vec2(u_time * 0.014, u_time * 0.006);
    float dBase = fbmClouds(cloudUV);
    float coverage = 0.48;
    float cloudDensity = smoothstep(coverage, 0.86, dBase);

    if (cloudDensity > 0.005) {
      vec3 activeLightDir = u_sunDir.y > -0.02 ? u_sunDir : u_moonDir;
      float shadowStep = fbmClouds(cloudUV + normalize(activeLightDir.xz + vec2(0.001)) * 0.14);
      float lightDiff = clamp((dBase - shadowStep) * 3.8 + 0.52, 0.0, 1.0);

      // Cloud Shadow & Lit Rim Palette across 24h cycle
      vec3 cloudDarkNight = mix(vec3(0.015, 0.024, 0.048), vec3(0.04, 0.012, 0.018), u_isBoss);
      vec3 cloudLitNight = mix(vec3(0.14, 0.22, 0.36), vec3(0.32, 0.10, 0.14), u_isBoss);

      vec3 cloudDarkTw = vec3(0.14, 0.08, 0.16);
      vec3 cloudLitTw = vec3(1.0, 0.48, 0.22);

      vec3 cloudDarkDay = vec3(0.24, 0.33, 0.45);
      vec3 cloudLitDay = vec3(0.95, 0.96, 0.99);

      float wSum = max(dayW + twilightW + nightW, 0.001);
      vec3 cDark = (cloudDarkDay * dayW + cloudDarkTw * twilightW + cloudDarkNight * nightW) / wSum;
      vec3 cLit = (cloudLitDay * dayW + cloudLitTw * twilightW + cloudLitNight * nightW) / wSum;

      // Silver-lining forward scatter when cloud sits near Sun or Moon
      float activeDot = max(dot(rd, activeLightDir), 0.0);
      float silverLining = pow(activeDot, 12.0) * (1.0 - cloudDensity * 0.65) * 0.85;
      vec3 silverCol = u_sunDir.y > -0.02 ? vec3(1.0, 0.72, 0.42) : mix(vec3(0.45, 0.62, 0.92), vec3(0.92, 0.25, 0.28), u_isBoss);

      vec3 cloudCol = mix(cDark, cLit, lightDiff) + silverCol * silverLining;
      float horizonFade = smoothstep(0.008, 0.14, rd.y);
      col = mix(col, cloudCol, cloudDensity * 0.82 * horizonFade);
    }
  }

  return col;
}

// Evaluate layered 3D Mountain Silhouettes + Aerial Haze + Distant Valley City Lights
vec3 applyMountains(vec3 skyCol, vec3 rd, float dayW, float twilightW, float nightW, bool isReflection) {
  float angX = atan(rd.x, max(rd.z, 0.001));
  vec3 finalCol = skyCol;

  // 4 Depth Mountain Ridges (back to front)
  for (int layer = 0; layer < 4; layer++) {
    float fl = float(layer);
    float scale = mix(2.2, 5.2, fl / 3.0);
    float seed = 11.4 + fl * 23.7;
    float baseH = mix(0.16, 0.055, fl / 3.0);
    float ridgeH = baseH * ridgedMountain(angX * scale, seed) + 0.015 * (3.0 - fl);
    // Keep foreground clear center dip for Moon/Sun reflection showcase
    float valleyDip = 1.0 - 0.35 * exp(-angX * angX * 4.5);
    ridgeH = ridgeH * valleyDip;

    if (rd.y < ridgeH && rd.y >= -0.002) {
      float depthRatio = fl / 3.0; // 0 = farthest hazy peak, 3 = closest dark ridge

      // Mountain base rock silhouette color
      vec3 farFogCol = mix(
        mix(vec3(0.022, 0.042, 0.085), vec3(0.06, 0.015, 0.025), u_isBoss),
        mix(vec3(0.32, 0.18, 0.26), vec3(0.16, 0.28, 0.45), dayW),
        clamp(dayW + twilightW * 0.8, 0.0, 1.0)
      );
      vec3 nearRockCol = mix(vec3(0.008, 0.012, 0.022), vec3(0.018, 0.005, 0.009), u_isBoss);

      vec3 ridgeCol = mix(farFogCol, nearRockCol, 0.38 + 0.62 * depthRatio);

      // Rim lighting on ridge edge facing Sun or Moon
      float edge = smoothstep(ridgeH, ridgeH - 0.012, rd.y);
      float rimLight = (1.0 - edge);
      vec3 activeDir = u_sunDir.y > -0.02 ? u_sunDir : u_moonDir;
      float activeAlign = max(dot(normalize(vec3(rd.x, 0.0, rd.z)), normalize(vec3(activeDir.x, 0.0, activeDir.z))), 0.0);
      vec3 rimCol = u_sunDir.y > -0.02
        ? vec3(1.0, 0.55, 0.22) * (0.45 + 0.55 * activeAlign)
        : mix(vec3(0.35, 0.52, 0.82), vec3(0.85, 0.22, 0.25), u_isBoss) * activeAlign;
      ridgeCol += rimCol * rimLight * (1.0 - depthRatio * 0.45) * 0.55;

      // Subtle golden shoreline lights & glowing cyberpunk lakeside beacons on closest foothills at night
      if (!isReflection && layer == 3 && nightW > 0.25 && rd.y < 0.018) {
        vec2 cityCell = floor(vec2(angX * 190.0, rd.y * 420.0));
        vec2 rndCity = hash22(cityCell);
        if (rndCity.x > 0.90 && rndCity.y > 0.42) {
          float pulse = 0.65 + 0.35 * sin(u_time * 2.5 + rndCity.x * 40.0);
          vec3 urbanWarm = mix(vec3(1.0, 0.74, 0.32), vec3(0.28, 0.88, 1.0), step(0.84, rndCity.y));
          vec3 lightTint = mix(urbanWarm, vec3(1.0, 0.28, 0.24), u_isBoss * 0.82);
          ridgeCol += lightTint * 0.95 * nightW * pulse;
        }
        // Subtle bioluminescent / neon horizon water-edge shimmer
        float shoreEdgeGlow = smoothstep(0.008, 0.0, abs(rd.y)) * (0.4 + 0.6 * sin(angX * 16.0 - u_time * 0.8));
        vec3 shoreBeaconCol = mix(vec3(0.10, 0.58, 0.88), vec3(0.88, 0.16, 0.22), u_isBoss);
        ridgeCol += shoreBeaconCol * shoreEdgeGlow * 0.22 * nightW;
      }

      // Vertical valley mist near shoreline
      float valleyMist = exp(-max(rd.y, 0.0) * 45.0) * (1.0 - depthRatio * 0.6);
      ridgeCol = mix(ridgeCol, farFogCol * 1.15, valleyMist * 0.45);

      finalCol = ridgeCol;
    }
  }

  return finalCol;
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_res) / u_res.y;

  // Camera Rig with subtle mouse parallax & cinematic breathing sway
  float yaw = u_mouse.x * 0.24 + sin(u_time * 0.075) * 0.032;
  float pitch = u_horizonShift - u_mouse.y * 0.11 + cos(u_time * 0.06) * 0.012;

  vec3 camFwd = normalize(vec3(sin(yaw) * cos(pitch), sin(pitch), cos(yaw) * cos(pitch)));
  vec3 camRight = normalize(cross(vec3(0.0, 1.0, 0.0), camFwd));
  vec3 camUp = cross(camFwd, camRight);
  vec3 rd = normalize(camFwd + uv.x * camRight * 1.05 + uv.y * camUp * 1.05);

  float dayW = smoothstep(-0.04, 0.24, u_sunDir.y);
  float twilightW = exp(-pow((u_sunDir.y - 0.035) / 0.125, 2.0)) * 1.15;
  float nightW = smoothstep(0.08, -0.14, u_sunDir.y);

  vec3 col = vec3(0.0);

  if (rd.y >= 0.0) {
    // Upper Hemisphere: Sky, Sun/Moon, Clouds, Stars, Aurora, Mountains
    col = renderSkyAndCelestial(rd, dayW, twilightW, nightW, false);
    col = applyMountains(col, rd, dayW, twilightW, nightW, false);

    // Crepuscular Volumetric God-Ray Shafts radiating from Sun when visible
    float sunVis = smoothstep(-0.05, 0.12, u_sunDir.y);
    if (sunVis > 0.01 && dot(rd, u_sunDir) > 0.35) {
      float rayAngle = atan(rd.y - u_sunDir.y, rd.x - u_sunDir.x);
      float shafts = sin(rayAngle * 14.0 + u_time * 0.15) * 0.5 + 0.5;
      shafts *= sin(rayAngle * 23.0 - u_time * 0.1) * 0.5 + 0.5;
      float rayFalloff = pow(max(dot(rd, u_sunDir), 0.0), 6.0);
      vec3 rayCol = mix(vec3(1.0, 0.45, 0.18), vec3(1.0, 0.85, 0.62), dayW);
      col += rayCol * shafts * rayFalloff * 0.28 * sunVis;
    }
  } else {
    // Lower Hemisphere: Reflective 3D Animated Water Lake
    float tWater = -1.0 / min(rd.y, -0.0008);
    vec2 wPos = rd.xz * tWater;
    float distFade = 1.0 / (1.0 + tWater * 0.075);

    // Multi-layered procedural wave ripples for normal perturbation
    vec2 w1 = wPos * vec2(1.4, 3.8) + vec2(u_time * 0.35, u_time * 0.65);
    vec2 w2 = wPos * vec2(3.1, 7.5) + vec2(-u_time * 0.28, u_time * 0.95);
    float eps = 0.08;
    float h0 = noise2D(w1) * 0.65 + noise2D(w2) * 0.35;
    float hx = noise2D(w1 + vec2(eps, 0.0)) * 0.65 + noise2D(w2 + vec2(eps, 0.0)) * 0.35;
    float hz = noise2D(w1 + vec2(0.0, eps)) * 0.65 + noise2D(w2 + vec2(0.0, eps)) * 0.35;
    vec2 grad = (vec2(hx - h0, hz - h0) / eps) * 0.045 * distFade;
    vec3 wNorm = normalize(vec3(-grad.x, 1.0, -grad.y));

    vec3 reflDir = reflect(rd, wNorm);
    reflDir.y = abs(reflDir.y);

    vec3 reflCol = renderSkyAndCelestial(reflDir, dayW, twilightW, nightW, true);
    reflCol = applyMountains(reflCol, reflDir, dayW, twilightW, nightW, true);

    // Dual Sparkling GGX Specular Sun & Moon Water Glitter Paths (smooth twilight cross-fade)
    float sWaterVis = smoothstep(-0.04, 0.08, u_sunDir.y);
    float mWaterVis = smoothstep(-0.02, 0.09, u_moonDir.y) * max(nightW, 0.25);

    vec3 sunHalf = normalize(u_sunDir - rd);
    float sTight = pow(max(dot(wNorm, sunHalf), 0.0), 190.0);
    float sWide = pow(max(dot(wNorm, sunHalf), 0.0), 28.0);
    vec3 sGlitterCol = mix(vec3(1.0, 0.45, 0.14), vec3(1.0, 0.90, 0.65), dayW);

    vec3 moonHalf = normalize(u_moonDir - rd);
    float mTight = pow(max(dot(wNorm, moonHalf), 0.0), 210.0);
    float mWide = pow(max(dot(wNorm, moonHalf), 0.0), 32.0);
    vec3 mGlitterCol = mix(vec3(0.68, 0.82, 1.0), vec3(0.95, 0.32, 0.30), u_isBoss);

    vec3 totalGlitter =
      sGlitterCol * (sTight * 2.6 + sWide * 0.36) * sWaterVis +
      mGlitterCol * (mTight * 2.8 + mWide * 0.42) * mWaterVis;

    float fresnel = pow(1.0 - max(dot(-rd, wNorm), 0.0), 4.0);
    fresnel = clamp(0.18 + 0.82 * fresnel, 0.0, 1.0);

    vec3 deepWaterCol = mix(
      mix(vec3(0.005, 0.012, 0.024), vec3(0.018, 0.004, 0.008), u_isBoss),
      vec3(0.015, 0.045, 0.085),
      dayW * 0.65
    );

    col = mix(deepWaterCol, reflCol * 0.88, fresnel) + totalGlitter;

    // Distant water horizon shoreline mist
    float shoreMist = exp(rd.y * 55.0);
    vec3 horizTint = getAtmosphereBase(vec3(rd.x, 0.01, rd.z), dayW, twilightW, nightW);
    col = mix(col, horizTint * 0.82, shoreMist * 0.55);
  }

  // Subtle dark HUD contrast scrim in daytime & vignette framing for razor-sharp UI readability
  float vignette = 1.0 - dot(uv, uv) * 0.22;
  col *= clamp(vignette, 0.55, 1.05);
  col *= mix(1.0, 0.72, dayW);

  // ACES Filmic Tone Mapping + Gamma Correction
  vec3 a = col * (col + 0.0245786) - 0.000090537;
  vec3 b = col * (0.983729 * col + 0.4329510) + 0.238081;
  col = clamp(a / b, 0.0, 1.0);
  col = pow(col, vec3(1.0 / 2.2));

  // Ordered anti-banding dither (eliminates 8-bit dark sky banding)
  col += (hash12(gl_FragCoord.xy + fract(u_time)) - 0.5) * (1.0 / 255.0);

  gl_FragColor = vec4(col, 1.0);
}
`;

/**
 * Detects whether the user is on a Laptop / Desktop PC screen (>= 1024px & non-mobile OS).
 * Mobile phones & tablets stay static with zero WebGL/rAF animations for instant speed & battery life.
 */
export function useIsDesktopSkyScreen(): boolean {
  const [isDesktop, setIsDesktop] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const evaluate = () => {
      const wideScreen = window.matchMedia('(min-width: 1024px)').matches;
      const mobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent || ''
      );
      setIsDesktop(wideScreen && !mobileUA);
    };

    const initTimer = window.setTimeout(evaluate, 0);
    const mq = window.matchMedia('(min-width: 1024px)');
    mq.addEventListener('change', evaluate);
    window.addEventListener('resize', evaluate);
    return () => {
      window.clearTimeout(initTimer);
      mq.removeEventListener('change', evaluate);
      window.removeEventListener('resize', evaluate);
    };
  }, []);

  return isDesktop;
}

export default function CinematicSkyBackground({
  overrideHour = null,
  isBoss = false,
}: {
  overrideHour?: number | null;
  isBoss?: boolean;
}) {
  const isDesktop = useIsDesktopSkyScreen();
  const glCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const fxCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const overrideHourRef = useRef<number | null>(overrideHour);
  const isBossRef = useRef<boolean>(isBoss);
  const [useFallback2D, setUseFallback2D] = useState<boolean>(false);

  useEffect(() => {
    overrideHourRef.current = overrideHour;
  }, [overrideHour]);

  useEffect(() => {
    isBossRef.current = isBoss;
  }, [isBoss]);

  // Smooth Mouse / Gyroscope Parallax State (Desktop Only)
  const mouseTargetRef = useRef({ x: 0, y: 0 });
  const mouseCurrentRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!isDesktop) return;
    const onPointerMove = (e: PointerEvent) => {
      const nx = (e.clientX / Math.max(window.innerWidth, 1)) * 2 - 1;
      const ny = (e.clientY / Math.max(window.innerHeight, 1)) * 2 - 1;
      mouseTargetRef.current.x = Math.max(-1, Math.min(1, nx));
      mouseTargetRef.current.y = Math.max(-1, Math.min(1, ny));
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    return () => window.removeEventListener('pointermove', onPointerMove);
  }, [isDesktop]);

  // ========================================================================
  // 1. HARDWARE-ACCELERATED WEBGL 3D SHADER ENGINE (LAPTOP & PC ONLY)
  // ========================================================================
  useEffect(() => {
    if (!isDesktop || useFallback2D) return;
    const canvas = glCanvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: 'high-performance',
    });

    if (!gl) {
      setUseFallback2D(true);
      return;
    }

    const compileShader = (type: number, src: string): WebGLShader | null => {
      const sh = gl.createShader(type);
      if (!sh) return null;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        gl.deleteShader(sh);
        return null;
      }
      return sh;
    };

    const vs = compileShader(gl.VERTEX_SHADER, VERTEX_SHADER);
    const fs = compileShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vs || !fs) {
      setUseFallback2D(true);
      return;
    }

    const prog = gl.createProgram();
    if (!prog) {
      setUseFallback2D(true);
      return;
    }
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      setUseFallback2D(true);
      return;
    }

    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const posLoc = gl.getAttribLocation(prog, 'a_pos');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, 'u_res');
    const uTime = gl.getUniformLocation(prog, 'u_time');
    const uMouse = gl.getUniformLocation(prog, 'u_mouse');
    const uSunDir = gl.getUniformLocation(prog, 'u_sunDir');
    const uMoonDir = gl.getUniformLocation(prog, 'u_moonDir');
    const uMoonPhase = gl.getUniformLocation(prog, 'u_moonPhase');
    const uIsBoss = gl.getUniformLocation(prog, 'u_isBoss');
    const uHorizonShift = gl.getUniformLocation(prog, 'u_horizonShift');

    const updateSize = () => {
      // Cap DPR to 1.35 so mobile GPUs & 4K monitors render locked at 60 FPS effortlessly
      const dpr = Math.min(window.devicePixelRatio || 1, 1.35);
      const w = Math.max(1, Math.floor(window.innerWidth * dpr));
      const h = Math.max(1, Math.floor(window.innerHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, w, h);
    };

    updateSize();
    window.addEventListener('resize', updateSize);

    const handleContextLost = (e: Event) => {
      e.preventDefault();
      setUseFallback2D(true);
    };
    canvas.addEventListener('webglcontextlost', handleContextLost);

    let rafId = 0;
    const startMs = performance.now();

    const render = () => {
      if (!document.hidden) {
        updateSize();
        const elapsedSec = (performance.now() - startMs) * 0.001;

        // Smooth camera damping
        mouseCurrentRef.current.x += (mouseTargetRef.current.x - mouseCurrentRef.current.x) * 0.045;
        mouseCurrentRef.current.y += (mouseTargetRef.current.y - mouseCurrentRef.current.y) * 0.045;

        const now = new Date();
        const info = getCelestialTimeInfo(overrideHourRef.current, now);
        const lunar = getRealLunarPhase(now);
        const { sunDir, moonDir } = computeCelestialVectors(info.hours, lunar.phase);

        gl.uniform2f(uRes, canvas.width, canvas.height);
        gl.uniform1f(uTime, elapsedSec);
        gl.uniform2f(uMouse, mouseCurrentRef.current.x, mouseCurrentRef.current.y);
        gl.uniform3f(uSunDir, sunDir[0], sunDir[1], sunDir[2]);
        gl.uniform3f(uMoonDir, moonDir[0], moonDir[1], moonDir[2]);
        gl.uniform1f(uMoonPhase, lunar.phase);
        gl.uniform1f(uIsBoss, isBossRef.current ? 1.0 : 0.0);
        gl.uniform1f(uHorizonShift, 0.11);

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }
      rafId = window.requestAnimationFrame(render);
    };

    rafId = window.requestAnimationFrame(render);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', updateSize);
      canvas.removeEventListener('webglcontextlost', handleContextLost);
    };
  }, [isDesktop, useFallback2D]);

  // ========================================================================
  // 2. COMPANION 2D CANVAS: 3D DEPTH FIREFLIES / BIRDS / SKY LANTERNS (LAPTOP & PC ONLY)
  // ========================================================================
  useEffect(() => {
    if (!isDesktop) return;
    const fxCanvas = fxCanvasRef.current;
    if (!fxCanvas) return;
    const ctx = fxCanvas.getContext('2d');
    if (!ctx) return;

    interface Particle3D {
      x: number;
      y: number;
      z: number; // depth 0.2 (far) .. 1.0 (near)
      vx: number;
      vy: number;
      size: number;
      phase: number;
      hue: number;
    }

    const particles: Particle3D[] = Array.from({ length: 52 }).map((_, idx) => ({
      x: Math.random(),
      y: Math.random(),
      z: 0.2 + Math.random() * 0.8,
      vx: (Math.random() - 0.5) * 0.00018,
      vy: -0.00012 - Math.random() * 0.00025,
      size: 1.2 + Math.random() * 2.5,
      phase: idx * 0.73,
      hue: Math.random(),
    }));

    const birds = Array.from({ length: 6 }).map((_, idx) => ({
      offset: idx * 0.14,
      yBase: 0.24 + (idx % 3) * 0.045,
      speed: 0.018 + (idx % 2) * 0.004,
      wingFreq: 4.5 + (idx % 3) * 0.8,
      scale: 0.65 + (idx % 3) * 0.22,
    }));

    const resizeFx = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      if (fxCanvas.width !== w || fxCanvas.height !== h) {
        fxCanvas.width = w;
        fxCanvas.height = h;
      }
    };
    resizeFx();
    window.addEventListener('resize', resizeFx);

    let rafId = 0;
    const startMs = performance.now();

    const drawFx = () => {
      if (!document.hidden) {
        resizeFx();
        const w = fxCanvas.width;
        const h = fxCanvas.height;
        const t = (performance.now() - startMs) * 0.001;
        const info = getCelestialTimeInfo(overrideHourRef.current, new Date());

        ctx.clearRect(0, 0, w, h);

        // Fallback Sky Renderer only if WebGL is unavailable
        if (useFallback2D) {
          const now = new Date();
          const lunar = getRealLunarPhase(now);
          const { sunDir, moonDir } = computeCelestialVectors(info.hours, lunar.phase);
          const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.72);
          if (info.isDay) {
            skyGrad.addColorStop(0, '#091d44');
            skyGrad.addColorStop(1, '#315d8a');
          } else if (info.hours >= 16.5 && info.hours < 19.5) {
            skyGrad.addColorStop(0, '#180d2d');
            skyGrad.addColorStop(0.55, '#682442');
            skyGrad.addColorStop(1, '#e06024');
          } else {
            skyGrad.addColorStop(0, isBossRef.current ? '#0c0206' : '#030714');
            skyGrad.addColorStop(1, isBossRef.current ? '#28060e' : '#0d1c34');
          }
          ctx.fillStyle = skyGrad;
          ctx.fillRect(0, 0, w, h);

          // Draw Fallback Sun or Moon matching 3D vectors
          if (sunDir[1] > -0.05) {
            const sx = w * (0.5 + sunDir[0] * 0.45);
            const sy = h * (0.68 - sunDir[1] * 0.72);
            const sGlow = ctx.createRadialGradient(sx, sy, 6, sx, sy, Math.min(w, h) * 0.25);
            sGlow.addColorStop(0, 'rgba(255, 250, 220, 0.95)');
            sGlow.addColorStop(0.2, 'rgba(255, 190, 100, 0.55)');
            sGlow.addColorStop(1, 'rgba(255, 120, 40, 0)');
            ctx.fillStyle = sGlow;
            ctx.beginPath();
            ctx.arc(sx, sy, Math.min(w, h) * 0.25, 0, Math.PI * 2);
            ctx.fill();
          }
          if (moonDir[1] > -0.04) {
            const mx = w * (0.5 + moonDir[0] * 0.45);
            const my = h * (0.68 - moonDir[1] * 0.72);
            const mR = Math.min(w, h) * 0.035;
            const mGlow = ctx.createRadialGradient(mx, my, mR * 0.5, mx, my, mR * 4.5);
            mGlow.addColorStop(0, isBossRef.current ? 'rgba(255, 160, 140, 0.85)' : 'rgba(225, 240, 255, 0.9)');
            mGlow.addColorStop(0.3, isBossRef.current ? 'rgba(180, 40, 50, 0.28)' : 'rgba(110, 150, 220, 0.25)');
            mGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = mGlow;
            ctx.beginPath();
            ctx.arc(mx, my, mR * 4.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#e8edf5';
            ctx.beginPath();
            ctx.arc(mx, my, mR, 0, Math.PI * 2);
            ctx.fill();
          }

          // Fallback Jagged Mountains
          ctx.fillStyle = isBossRef.current ? '#120408' : '#080e1a';
          ctx.beginPath();
          ctx.moveTo(0, h * 0.72);
          for (let px = 0; px <= w; px += w / 24) {
            const ridge = Math.sin(px * 0.008) * h * 0.05 + Math.cos(px * 0.021) * h * 0.03;
            ctx.lineTo(px, h * 0.68 - Math.abs(ridge));
          }
          ctx.lineTo(w, h * 0.72);
          ctx.closePath();
          ctx.fill();

          // Water lower band
          const waterGrad = ctx.createLinearGradient(0, h * 0.72, 0, h);
          waterGrad.addColorStop(0, '#0c1628');
          waterGrad.addColorStop(1, '#020409');
          ctx.fillStyle = waterGrad;
          ctx.fillRect(0, h * 0.72, w, h * 0.28);
        }

        // Subtle Foreground 3D Atmospheric Dust Motes / Fireflies
        const isNight = !info.isDay;
        particles.forEach((p) => {
          p.x += p.vx * (0.5 + p.z);
          p.y += p.vy * (0.5 + p.z);
          if (p.y < -0.05) p.y = 1.05;
          if (p.x < -0.05) p.x = 1.05;
          if (p.x > 1.05) p.x = -0.05;

          const px = (p.x - mouseCurrentRef.current.x * 0.04 * p.z) * w;
          const py = (p.y - mouseCurrentRef.current.y * 0.03 * p.z) * h;
          const pulse = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * 2.1 + p.phase));
          const alpha = pulse * (isNight ? 0.55 : 0.32) * p.z;
          const radius = p.size * p.z;

          let colorStr = `rgba(255, 224, 150, ${alpha})`; // warm golden sun mote / firefly
          if (isBossRef.current) {
            colorStr = p.hue > 0.35 ? `rgba(255, 90, 75, ${alpha})` : `rgba(255, 195, 110, ${alpha})`;
          } else if (isNight) {
            colorStr = p.hue > 0.45 ? `rgba(140, 225, 255, ${alpha})` : `rgba(255, 215, 130, ${alpha})`;
          }

          ctx.beginPath();
          ctx.arc(px, py, radius * 2.8, 0, Math.PI * 2);
          ctx.fillStyle = colorStr.replace(/[\d.]+\)$/, `${alpha * 0.22})`);
          ctx.fill();

          ctx.beginPath();
          ctx.arc(px, py, radius, 0, Math.PI * 2);
          ctx.fillStyle = colorStr;
          ctx.fill();
        });

        // Distant Soaring Bird Silhouettes during Daylight & Golden Hour
        if (info.isDay || (info.hours >= 5.5 && info.hours <= 18.8)) {
          ctx.strokeStyle = isBossRef.current
            ? 'rgba(60, 12, 16, 0.55)'
            : 'rgba(12, 18, 32, 0.52)';
          ctx.lineWidth = 1.5;
          ctx.lineCap = 'round';
          birds.forEach((b, idx) => {
            const bx = ((t * b.speed + b.offset) % 1.25 - 0.12) * w;
            const by = (b.yBase + Math.sin(t * 0.7 + idx) * 0.022) * h;
            const wing = Math.sin(t * b.wingFreq + idx * 1.4) * 5.5 * b.scale;
            const span = 11 * b.scale;
            ctx.beginPath();
            ctx.moveTo(bx - span, by - wing);
            ctx.quadraticCurveTo(bx - span * 0.45, by - wing * 1.2 - 3, bx, by);
            ctx.quadraticCurveTo(bx + span * 0.45, by - wing * 1.2 - 3, bx + span, by - wing);
            ctx.stroke();
          });
        }
      }
      rafId = window.requestAnimationFrame(drawFx);
    };

    rafId = window.requestAnimationFrame(drawFx);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resizeFx);
    };
  }, [isDesktop, useFallback2D]);

  // Mobile phones & narrow viewports get a fast, zero-animation static obsidian sky
  if (!isDesktop) {
    return (
      <div
        className={`fixed inset-0 z-0 pointer-events-none select-none ${
          isBoss
            ? 'bg-[radial-gradient(ellipse_at_top,_#26070f_0%,_#0b0408_55%,_#040205_100%)]'
            : 'bg-[radial-gradient(ellipse_at_top,_#141e33_0%,_#090b10_55%,_#04050a_100%)]'
        }`}
        aria-hidden="true"
      />
    );
  }

  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none bg-[#04060d]"
      aria-hidden="true"
    >
      {!useFallback2D && (
        <canvas
          ref={glCanvasRef}
          className="absolute inset-0 w-full h-full block"
        />
      )}
      <canvas
        ref={fxCanvasRef}
        className="absolute inset-0 w-full h-full block"
      />
      {/* Subtle atmospheric contrast vignette so foreground glass tiles & text pop clearly */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/38 pointer-events-none" />
    </div>
  );
}
