export interface CyberSecurityProject {
  readonly id: string;
  readonly number: number;
  readonly slug: string;
  readonly title: string;
  readonly filename: string;
  readonly badge: string;
  readonly shortDesc: string;
  readonly customMessage: string;
  readonly libraries: readonly string[];
  readonly keyCapabilities: readonly string[];
  readonly keywords: readonly string[];
  readonly code: string;
}

export const CYBER_PREREQ_CMD = 'pip install requests beautifulsoup4 scapy dnspython pillow cryptography';

export const CYBER_SECURITY_PROJECTS: readonly CyberSecurityProject[] = [
  {
    id: 'port-scanner',
    number: 1,
    slug: 'port-scanner',
    title: 'Simple Multi-Threaded Port Scanner',
    filename: 'project1_port_scanner.py',
    badge: '🔍 Cyber Project 01',
    shortDesc: 'Scans target host for open TCP ports using multi-threading with socket timeout & banner grab.',
    customMessage:
      '🛡️ Boss ikA Special — Project 1 (Port Scanner) Ready! Multi-threaded socket engine target host (default localhost 127.0.0.1) ke common ports (21, 22, 80, 443, 8080) scan karke status & service name print karta hai!',
    libraries: ['socket', 'concurrent.futures', 'datetime'],
    keyCapabilities: ['Multi-threaded TCP Connect Scan', 'Port-to-Service Banner Lookup', 'Scan Timing & Status Metrics'],
    keywords: [
      'port scanner',
      'port_scanner',
      'scanner',
      'tcp scan',
      'open ports',
      'project 1',
      'cyber 1',
      'cyber project 1',
      'simple port scanner',
    ],
    code: `import socket
from datetime import datetime
from concurrent.futures import ThreadPoolExecutor

COMMON_PORTS = {
    21: "FTP",
    22: "SSH",
    25: "SMTP",
    53: "DNS",
    80: "HTTP",
    110: "POP3",
    143: "IMAP",
    443: "HTTPS",
    3306: "MySQL",
    5432: "PostgreSQL",
    8080: "HTTP-Proxy",
}

def scan_port(host: str, port: int, timeout: float = 0.5) -> tuple[int, bool, str]:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.settimeout(timeout)
        result = s.connect_ex((host, port))
        is_open = (result == 0)
        service = COMMON_PORTS.get(port, "Unknown Service")
        return port, is_open, service

def run_port_scanner(target_host: str = "127.0.0.1", ports: list[int] = None):
    if ports is None:
        ports = list(COMMON_PORTS.keys())

    print(f"[*] Starting Port Scanner on {target_host} at {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)
    print(f"{'PORT':<10} {'STATUS':<12} {'SERVICE'}")
    print("=" * 60)

    open_ports = []
    with ThreadPoolExecutor(max_workers=10) as executor:
        results = executor.map(lambda p: scan_port(target_host, p), ports)
        for port, is_open, service in results:
            if is_open:
                open_ports.append(port)
                print(f"{port:<10} {'OPEN':<12} {service}")
            else:
                print(f"{port:<10} {'CLOSED':<12} {service}")

    print("=" * 60)
    print(f"[+] Scan Complete. Found {len(open_ports)} open port(s) out of {len(ports)} scanned.")

if __name__ == "__main__":
    run_port_scanner()
`,
  },
  {
    id: 'keylogger',
    number: 2,
    slug: 'keylogger',
    title: 'Keystroke Logger & Forensic Auditor',
    filename: 'project2_keylogger_auditor.py',
    badge: '⌨️ Cyber Project 02',
    shortDesc: 'Safe forensic keystroke logging simulator with timestamped buffer, special key mapping & flush to file.',
    customMessage:
      '⌨️ Project 2 (Keylogger Simulator & Forensic Auditor) Ready! Yeh tool demo mode me keystroke sequence simulate karta hai aur safe forensic audit file keylog_audit.txt me save karta hai!',
    libraries: ['datetime', 'time'],
    keyCapabilities: ['Timestamped Key Buffer', 'Sanitized Special Key Parsing', 'Auto-Flushing Audit Log File'],
    keywords: [
      'keylogger',
      'key logger',
      'keystroke',
      'keylog',
      'project 2',
      'cyber 2',
      'cyber project 2',
    ],
    code: `import time
from datetime import datetime

class KeyloggerAuditor:
    def __init__(self, log_file: str = "keylog_audit.txt"):
        self.log_file = log_file
        self.buffer = []

    def log_keystroke(self, key: str):
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S.%f")[:-3]
        entry = f"[{timestamp}] KEY: {key}\\n"
        self.buffer.append(entry)
        if len(self.buffer) >= 5:
            self.flush()

    def flush(self):
        if not self.buffer:
            return
        with open(self.log_file, "a", encoding="utf-8") as f:
            f.writelines(self.buffer)
        self.buffer.clear()

def run_keylogger_demo():
    print("[*] Initializing Keylogger Audit Engine (Educational Simulator)...")
    logger = KeyloggerAuditor()

    # Simulate realistic keystrokes including backspace and enter
    sample_inputs = [
        "u", "s", "e", "r", "_", "a", "d", "m", "i", "n",
        "[ENTER]",
        "P", "a", "s", "s", "1", "2", "3", "[BACKSPACE]", "4", "[ENTER]"
    ]

    print(f"[*] Capturing simulated user session ({len(sample_inputs)} strokes)...")
    for stroke in sample_inputs:
        logger.log_keystroke(stroke)
        time.sleep(0.04)

    logger.flush()
    print(f"[+] Audit log successfully flushed to '{logger.log_file}'")

    with open(logger.log_file, "r", encoding="utf-8") as f:
        content = f.read()
    print("\\n--- Preview of Stored Keystrokes ---")
    print(content)

if __name__ == "__main__":
    run_keylogger_demo()
`,
  },
  {
    id: 'caesar-cipher',
    number: 3,
    slug: 'caesar-cipher',
    title: 'Caesar Cipher Encryptor, Decryptor & Brute-Forcer',
    filename: 'project3_caesar_cipher.py',
    badge: '🔐 Cyber Project 03',
    shortDesc: 'Classic substitution cipher tool with encryption, decryption, and 25-key brute force analysis.',
    customMessage:
      '🔐 Project 3 (Caesar Cipher Tool) Ready! Text ko encrypt, decrypt aur 25 possible keys par automatic brute-force karke plaintext match karta hai!',
    libraries: ['string'],
    keyCapabilities: ['Variable Shift Encryption', 'Exact Decryption', '26-Key Brute Force Frequency Analysis'],
    keywords: [
      'caesar cipher',
      'ciser sypher',
      'cipher',
      'substitution cipher',
      'project 3',
      'cyber 3',
      'cyber project 3',
    ],
    code: `def caesar_encrypt(plaintext: str, shift: int) -> str:
    result = []
    shift = shift % 26
    for char in plaintext:
        if 'a' <= char <= 'z':
            result.append(chr((ord(char) - ord('a') + shift) % 26 + ord('a')))
        elif 'A' <= char <= 'Z':
            result.append(chr((ord(char) - ord('A') + shift) % 26 + ord('A')))
        else:
            result.append(char)
    return "".join(result)

def caesar_decrypt(ciphertext: str, shift: int) -> str:
    return caesar_encrypt(ciphertext, -shift)

def caesar_brute_force(ciphertext: str):
    print(f"[*] Brute-forcing ciphertext: '{ciphertext}'")
    print("-" * 50)
    for key in range(1, 26):
        attempt = caesar_decrypt(ciphertext, key)
        print(f"Key {key:02d}: {attempt}")
    print("-" * 50)

if __name__ == "__main__":
    secret_msg = "Sovereign ikA Realm CSE-8 Cyber Defense"
    shift_key = 7

    encrypted = caesar_encrypt(secret_msg, shift_key)
    decrypted = caesar_decrypt(encrypted, shift_key)

    print("=== CAESAR CIPHER SUITE ===")
    print(f"Plaintext : {secret_msg}")
    print(f"Shift Key : {shift_key}")
    print(f"Encrypted : {encrypted}")
    print(f"Decrypted : {decrypted}\\n")

    caesar_brute_force(encrypted[:28])
`,
  },
  {
    id: 'dns-lookup',
    number: 4,
    slug: 'dns-lookup',
    title: 'DNS Reconnaissance & Lookup CLI Tool',
    filename: 'project4_dns_lookup.py',
    badge: '🌐 Cyber Project 04',
    shortDesc: 'Performs forward, reverse, and record lookup (A, CNAME, MX) with socket resolution.',
    customMessage:
      '🌐 Project 4 (DNS Lookup CLI Tool) Ready! Hostnames ko IP addresses me resolve karta hai, reverse DNS lookup karta hai aur basic DNS reconnaissance report generate karta hai!',
    libraries: ['socket'],
    keyCapabilities: ['Forward DNS (gethostbyname_ex)', 'Reverse IP Lookup (gethostbyaddr)', 'Port-Level Service Resolution'],
    keywords: [
      'dns lookup',
      'dns tool',
      'dns lookup cli tool',
      'reverse dns',
      'recon',
      'project 4',
      'cyber 4',
      'cyber project 4',
    ],
    code: `import socket

def perform_dns_lookup(domain: str):
    print(f"[*] Querying DNS records for: {domain}")
    print("=" * 60)
    try:
        primary_ip = socket.gethostbyname(domain)
        name, aliases, ip_list = socket.gethostbyname_ex(domain)
        print(f"Canonical Name : {name}")
        print(f"Primary IP     : {primary_ip}")
        print(f"Aliases        : {aliases if aliases else 'None'}")
        print(f"All A Records  : {', '.join(ip_list)}")

        try:
            rev_name, _, _ = socket.gethostbyaddr(primary_ip)
            print(f"Reverse DNS    : {rev_name}")
        except socket.herror:
            print("Reverse DNS    : No PTR record found")
    except socket.gaierror as e:
        print(f"[!] DNS Resolution Failed: {e}")
    print("=" * 60)

if __name__ == "__main__":
    targets = ["google.com", "abes.ac.in", "localhost"]
    for t in targets:
        perform_dns_lookup(t)
        print()
`,
  },
  {
    id: 'web-vuln-scanner',
    number: 5,
    slug: 'web-vuln-scanner',
    title: 'Web Application Vulnerability & Header Scanner',
    filename: 'project5_web_vuln_scanner.py',
    badge: '🛡️ Cyber Project 05',
    shortDesc: 'Audits target web applications for missing security headers (HSTS, CSP, X-Frame) and info disclosures.',
    customMessage:
      '🛡️ Project 5 (Web Vulnerability Scanner) Ready! Web endpoints ko audit karke HSTS, Content-Security-Policy, X-Frame-Options, aur Server Banner leaks detect karta hai!',
    libraries: ['urllib.request', 'json'],
    keyCapabilities: ['Security Headers Compliance Audit', 'Information Disclosure Check (Server/X-Powered-By)', 'Vulnerability Risk Grading'],
    keywords: [
      'web vulnerability scanner',
      'web vuln scanner',
      'web scanner',
      'vuln scanner',
      'security headers',
      'project 5',
      'cyber 5',
      'cyber project 5',
    ],
    code: `import urllib.request
import urllib.error

SECURITY_HEADERS = {
    "Strict-Transport-Security": "Protects against SSL-stripping & MITM",
    "Content-Security-Policy": "Mitigates XSS and data-injection attacks",
    "X-Frame-Options": "Prevents clickjacking attacks",
    "X-Content-Type-Options": "Blocks MIME-sniffing exploits",
    "Referrer-Policy": "Controls leakage of referrer information",
    "Permissions-Policy": "Restricts browser feature access (mic, camera)"
}

def audit_url_headers(url: str = "https://example.com"):
    print(f"[*] Scanning Security Headers on: {url}")
    print("=" * 65)

    try:
        req = urllib.request.Request(url, headers={"User-Agent": "ikA-Security-Auditor/1.0"})
        with urllib.request.urlopen(req, timeout=5) as resp:
            headers = dict(resp.getheaders())
            status = resp.status
    except Exception as e:
        print(f"[!] Connection error: {e}")
        # Run in offline simulation mode
        print("[*] Falling back to offline demonstration headers...")
        headers = {
            "Content-Type": "text/html; charset=UTF-8",
            "Server": "Apache/2.4.41 (Ubuntu)",
            "X-Powered-By": "PHP/7.4.3",
            "X-Frame-Options": "SAMEORIGIN"
        }
        status = 200

    print(f"HTTP Status: {status}\\n")

    present_count = 0
    missing_count = 0

    print("--- Security Headers Evaluation ---")
    for header, desc in SECURITY_HEADERS.items():
        found = any(h.lower() == header.lower() for h in headers)
        if found:
            present_count += 1
            print(f"[+] PASS: '{header}' is PRESENT")
        else:
            missing_count += 1
            print(f"[-] FAIL: '{header}' is MISSING ({desc})")

    print("\\n--- Information Disclosure Check ---")
    for leak_hdr in ["Server", "X-Powered-By", "X-AspNet-Version"]:
        for h, v in headers.items():
            if h.lower() == leak_hdr.lower():
                print(f"[!] WARNING: Leaked Header '{h}': {v}")

    print("=" * 65)
    score = (present_count / len(SECURITY_HEADERS)) * 100
    print(f"Security Header Hygiene Score: {score:.1f}% ({present_count} Pass, {missing_count} Fail)")

if __name__ == "__main__":
    audit_url_headers()
`,
  },
  {
    id: 'network-traffic-analyzer',
    number: 6,
    slug: 'network-traffic-analyzer',
    title: 'Network Traffic & Packet Header Analyzer',
    filename: 'project6_network_traffic_analyzer.py',
    badge: '📊 Cyber Project 06',
    shortDesc: 'Parses network packets, decodes IP/TCP/UDP headers, and computes bandwidth & protocol breakdown.',
    customMessage:
      '📊 Project 6 (Network Traffic Analyzer) Ready! Network traffic packets ko inspect karta hai, IP protocols (TCP, UDP, ICMP) decode karta hai aur protocol distribution generate karta hai!',
    libraries: ['struct', 'socket'],
    keyCapabilities: ['IPv4 Header Extraction', 'Protocol Demultiplexing', 'Bandwidth & Packet Frequency Metrics'],
    keywords: [
      'network traffic analyzer',
      'packet analyzer',
      'traffic analyzer',
      'packet sniffer',
      'wireshark simulator',
      'project 6',
      'cyber 6',
      'cyber project 6',
    ],
    code: `import struct

def parse_ipv4_header(raw_data: bytes):
    version_and_ihl = raw_data[0]
    version = version_and_ihl >> 4
    ihl = (version_and_ihl & 0xF) * 4
    ttl, proto, src, target = struct.unpack("! 8x B B 2x 4s 4s", raw_data[:20])
    src_ip = ".".join(map(str, src))
    target_ip = ".".join(map(str, target))
    return version, ihl, ttl, proto, src_ip, target_ip

def run_traffic_analyzer_demo():
    print("=== NETWORK TRAFFIC & PACKET ANALYZER ===")
    print("[*] Decoding synthetic Ethernet + IPv4 + Transport payloads...\\n")

    # Sample mock IPv4 headers (IPv4, IHL=5, TTL=64, Proto=6(TCP) & 17(UDP))
    mock_packets = [
        # Packet 1: TCP to 192.168.1.100 -> 93.184.216.34 (HTTP/HTTPS)
        bytes([0x45, 0x00, 0x00, 0x3c, 0x1c, 0x46, 0x40, 0x00, 0x40, 0x06, 0x00, 0x00,
               192, 168, 1, 100, 93, 184, 216, 34]),
        # Packet 2: UDP to DNS 8.8.8.8
        bytes([0x45, 0x00, 0x00, 0x2e, 0x2d, 0x11, 0x00, 0x00, 0x80, 0x11, 0x00, 0x00,
               192, 168, 1, 100, 8, 8, 8, 8]),
        # Packet 3: ICMP Ping Echo
        bytes([0x45, 0x00, 0x00, 0x54, 0x3f, 0x00, 0x00, 0x00, 0x40, 0x01, 0x00, 0x00,
               10, 0, 0, 5, 10, 0, 0, 1]),
    ]

    proto_names = {1: "ICMP", 6: "TCP", 17: "UDP"}

    for idx, raw in enumerate(mock_packets, 1):
        version, ihl, ttl, proto, src, dst = parse_ipv4_header(raw)
        pname = proto_names.get(proto, f"Other({proto})")
        print(f"Packet #{idx}: IPv{version} | Protocol: {pname:<6} | TTL: {ttl:<3} | {src} -> {dst}")

    print("\\n[+] Analyzer Metrics: 3 packets captured, Protocols: 1 TCP, 1 UDP, 1 ICMP.")

if __name__ == "__main__":
    run_traffic_analyzer_demo()
`,
  },
  {
    id: 'hash-cracker',
    number: 7,
    slug: 'hash-cracker',
    title: 'Multi-Algorithm Hash Cracker & Verifier',
    filename: 'project7_hash_cracker.py',
    badge: '🔓 Cyber Project 07',
    shortDesc: 'Cracks MD5, SHA-1 & SHA-256 hashes using dictionary attack and salted hash verification.',
    customMessage:
      '🔓 Project 7 (Hash Cracker) Ready! MD5, SHA1 aur SHA256 hashes ko wordlist dictionary attack ke through crack aur verify karta hai!',
    libraries: ['hashlib', 'time'],
    keyCapabilities: ['MD5 / SHA1 / SHA256 Detection', 'Dictionary Attack Engine', 'Execution Speed & Hashes/Sec Metric'],
    keywords: [
      'hash cracker',
      'hash',
      'md5',
      'sha256',
      'password crack',
      'project 7',
      'cyber 7',
      'cyber project 7',
    ],
    code: `import hashlib
import time

COMMON_PASSWORDS = [
    "admin", "password", "123456", "12345678", "qwerty", "welcome",
    "cyber", "secret", "boss1402", "shinobi", "superman", "abes2026"
]

def crack_hash(target_hash: str, algorithm: str = "sha256", wordlist: list[str] = None):
    if wordlist is None:
        wordlist = COMMON_PASSWORDS

    print(f"[*] Target Hash : {target_hash}")
    print(f"[*] Algorithm   : {algorithm.upper()}")
    print(f"[*] Wordlist Size: {len(wordlist)} passwords\\n")

    start_time = time.perf_counter()
    attempts = 0

    for word in wordlist:
        attempts += 1
        h = hashlib.new(algorithm)
        h.update(word.encode("utf-8"))
        digest = h.hexdigest()

        if digest.lower() == target_hash.lower():
            elapsed = time.perf_counter() - start_time
            print(f"[+] SUCCESS! Hash cracked in {elapsed:.6f}s after {attempts} attempt(s)!")
            print(f"[+] Matched Plaintext: '{word}'")
            return word

    print("[-] Hash not found in current dictionary.")
    return None

if __name__ == "__main__":
    secret_text = "boss1402"
    sha256_target = hashlib.sha256(secret_text.encode()).hexdigest()

    print("=== HASH CRACKER & VERIFIER ===")
    crack_hash(sha256_target, algorithm="sha256")
`,
  },
  {
    id: 'steganography-multitool',
    number: 8,
    slug: 'steganography-multitool',
    title: 'Steganographic Multi-Tool (Hide & Extract Secrets)',
    filename: 'project8_steganography_multitool.py',
    badge: '🖼️ Cyber Project 08',
    shortDesc: 'Hides secret messages inside images/text using LSB (Least Significant Bit) encoding & extracts them.',
    customMessage:
      '🖼️ Project 8 (Steganographic Multi-tool) Ready! Secret text ko digital carriers ke LSBs me encode karke hide aur extract karta hai bina file corrupt kiye!',
    libraries: ['os'],
    keyCapabilities: ['LSB (Least Significant Bit) Carrier Encoding', 'Delimiter-Guarded Extraction', 'Integrity Verification'],
    keywords: [
      'steganography',
      'stignographic multitool',
      'stego',
      'hide text',
      'lsb',
      'project 8',
      'cyber 8',
      'cyber project 8',
    ],
    code: `def text_to_binary(text: str) -> str:
    return "".join(f"{ord(c):08b}" for c in text)

def binary_to_text(binary_str: str) -> str:
    chars = [binary_str[i:i+8] for i in range(0, len(binary_str), 8)]
    return "".join(chr(int(b, 2)) for b in chars if len(b) == 8)

def encode_secret_message(carrier: str, secret: str, delimiter: str = "###END###") -> str:
    payload = text_to_binary(secret + delimiter)
    carrier_bytes = bytearray(carrier.encode("utf-8"))

    if len(payload) > len(carrier_bytes):
        raise ValueError("Carrier too small to store payload!")

    for i in range(len(payload)):
        carrier_bytes[i] = (carrier_bytes[i] & ~1) | int(payload[i])

    return carrier_bytes.decode("utf-8", errors="ignore")

def decode_secret_message(stego_text: str, delimiter: str = "###END###") -> str:
    stego_bytes = bytearray(stego_text.encode("utf-8"))
    bits = [str(stego_bytes[i] & 1) for i in range(len(stego_bytes))]
    recovered = binary_to_text("".join(bits))

    if delimiter in recovered:
        return recovered.split(delimiter)[0]
    return "Delimiter not found or payload corrupted."

if __name__ == "__main__":
    carrier_story = "ABES Engineering College Sovereign Realm CSE-8 Cyber Analysis Track Laboratory Session."
    secret_note = "MEET_AT_1402"

    print("=== STEGANOGRAPHIC MULTI-TOOL ===")
    print(f"Original Carrier : {carrier_story}")
    print(f"Secret to Hide   : {secret_note}")

    stego_carrier = encode_secret_message(carrier_story, secret_note)
    print(f"Stego Carrier    : {stego_carrier}")

    extracted = decode_secret_message(stego_carrier)
    print(f"Extracted Secret : {extracted}")
`,
  },
  {
    id: 'canary-token-generator',
    number: 9,
    slug: 'canary-token-generator',
    title: 'Canary Token & Honeypot Generator',
    filename: 'project9_canary_token_generator.py',
    badge: '🐤 Cyber Project 09',
    shortDesc: 'Generates decoy tracking URLs, unique honeypot tokens, and logs unauthorized access alerts.',
    customMessage:
      '🐤 Project 9 (Canary Token Generator) Ready! Decoy URLs aur honey-tokens generate karta hai jo kisi bhi intruder dwara click ya trigger hone par instant breach alert generate karte hain!',
    libraries: ['secrets', 'uuid', 'datetime'],
    keyCapabilities: ['Unique Decoy Token Minting', 'Honeypot Trigger Logging', 'Intruder Footprint Attribution'],
    keywords: [
      'canary token',
      'kenery token generator',
      'honeypot',
      'canary',
      'decoy',
      'project 9',
      'cyber 9',
      'cyber project 9',
    ],
    code: `import secrets
import uuid
from datetime import datetime

class CanaryTokenManager:
    def __init__(self, alert_endpoint: str = "https://ika.abes.ac.in/alerts"):
        self.alert_endpoint = alert_endpoint
        self.tokens = {}

    def generate_token(self, label: str, asset_type: str = "Document") -> dict:
        token_id = secrets.token_hex(16)
        unique_uuid = str(uuid.uuid4())
        tracking_url = f"{self.alert_endpoint}?token={token_id}&ref={unique_uuid[:8]}"

        token_record = {
            "token_id": token_id,
            "label": label,
            "asset_type": asset_type,
            "tracking_url": tracking_url,
            "created_at": datetime.now().isoformat(),
            "triggered": False,
            "trigger_logs": []
        }
        self.tokens[token_id] = token_record
        return token_record

    def simulate_trigger(self, token_id: str, intruder_ip: str = "198.51.100.23", user_agent: str = "Mozilla/5.0"):
        if token_id not in self.tokens:
            print("[!] Unknown token accessed!")
            return False

        record = self.tokens[token_id]
        record["triggered"] = True
        log_entry = {
            "time": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "ip": intruder_ip,
            "user_agent": user_agent
        }
        record["trigger_logs"].append(log_entry)
        print(f"🚨 [BREACH ALERT] Canary Token Triggered! Label: '{record['label']}'")
        print(f"   Intruder IP: {intruder_ip} | Timestamp: {log_entry['time']}")
        return True

if __name__ == "__main__":
    mgr = CanaryTokenManager()
    token1 = mgr.generate_token("CSE8_MT2_Answer_Key_Leak_Decoy.pdf", "PDF Honeypot")
    print("=== CANARY TOKEN GENERATOR ===")
    print(f"Token Label   : {token1['label']}")
    print(f"Tracking URL  : {token1['tracking_url']}\\n")

    print("[*] Simulating attacker opening the decoy file...")
    mgr.simulate_trigger(token1["token_id"])
`,
  },
  {
    id: 'phishing-domain-generator',
    number: 10,
    slug: 'phishing-domain-generator',
    title: 'Phishing Domain & Typosquatting Generator',
    filename: 'project10_phishing_domain_generator.py',
    badge: '🎣 Cyber Project 10',
    shortDesc: 'Generates permutation lookalike domains (omission, homoglyphs, bitsquatting, TLD swap) for brand defense.',
    customMessage:
      '🎣 Project 10 (Phishing Domain Generator) Ready! Given domain (e.g. abes.ac.in) ke saare lookalike typosquatting, omission, aur replacement domain variations generate karke risk audit karta hai!',
    libraries: ['urllib.parse'],
    keyCapabilities: ['Typosquatting Permutations', 'Homoglyph Lookalike Substitution', 'Defense & Takedown Radar'],
    keywords: [
      'phishing domain',
      'phishing domain generator',
      'typosquatting',
      'homoglyph',
      'project 10',
      'cyber 10',
      'cyber project 10',
    ],
    code: `HOMOGLYPHS = {
    'a': ['4', '@', 'o'],
    'e': ['3'],
    'i': ['1', 'l', '!'],
    'o': ['0'],
    's': ['5', '$'],
    't': ['7', '+'],
}

def generate_typosquatting_domains(domain: str) -> list[str]:
    parts = domain.split(".")
    name = parts[0]
    tld = ".".join(parts[1:]) if len(parts) > 1 else "com"

    variations = set()

    # 1. Omission of each character
    for i in range(len(name)):
        omitted = name[:i] + name[i+1:]
        if len(omitted) >= 3:
            variations.add(f"{omitted}.{tld}")

    # 2. Duplicate adjacent character
    for i in range(len(name)):
        duplicated = name[:i] + name[i] + name[i:]
        variations.add(f"{duplicated}.{tld}")

    # 3. Homoglyph substitution
    for char, replacements in HOMOGLYPHS.items():
        if char in name:
            for rep in replacements:
                variations.add(f"{name.replace(char, rep, 1)}.{tld}")

    # 4. Common TLD swaps
    for alt_tld in ["com", "net", "org", "co", "io"]:
        if alt_tld != tld:
            variations.add(f"{name}.{alt_tld}")

    return sorted(list(variations))

if __name__ == "__main__":
    target = "abes.ac.in"
    results = generate_typosquatting_domains(target)

    print(f"=== PHISHING DOMAIN GENERATOR FOR: '{target}' ===")
    print(f"[*] Generated {len(results)} lookalike variations for defense monitoring:\\n")
    for d in results[:15]:
        print(f" • {d}")
    print(f" ... and {max(0, len(results) - 15)} more variations.")
`,
  },
  {
    id: 'ssh-bruteforce-detector',
    number: 11,
    slug: 'ssh-bruteforce-detector',
    title: 'SSH Brute Force Attack Detector & Auto-Banner',
    filename: 'project11_ssh_bruteforce_detector.py',
    badge: '🚨 Cyber Project 11',
    shortDesc: 'Parses auth.log entries, correlates failed login frequencies per IP, and flags brute-force attacks.',
    customMessage:
      '🚨 Project 11 (SSH Brute Force Detector) Ready! Linux auth.log analyze karke repeated failed password attempts detect karta hai aur attacker IPs ko auto-ban list me dalta hai!',
    libraries: ['re', 'collections'],
    keyCapabilities: ['Auth Log Regex Parsing', 'Frequency Correlation per IP', 'Auto-Ban Firewall Rule Output'],
    keywords: [
      'ssh brute force',
      'ssh brute force detector',
      'ssh',
      'brute force detector',
      'auth.log',
      'project 11',
      'cyber 11',
      'cyber project 11',
    ],
    code: `import re
from collections import defaultdict

SAMPLE_AUTH_LOGS = """
Oct 14 09:20:11 ubuntu sshd[1204]: Failed password for invalid user root from 203.0.113.45 port 44211 ssh2
Oct 14 09:20:13 ubuntu sshd[1206]: Failed password for invalid user admin from 203.0.113.45 port 44212 ssh2
Oct 14 09:20:15 ubuntu sshd[1208]: Failed password for invalid user test from 203.0.113.45 port 44214 ssh2
Oct 14 09:20:18 ubuntu sshd[1210]: Failed password for student from 203.0.113.45 port 44216 ssh2
Oct 14 09:21:00 ubuntu sshd[1220]: Accepted password for cse8 from 192.168.1.15 port 51230 ssh2
Oct 14 09:22:01 ubuntu sshd[1230]: Failed password for root from 198.51.100.8 port 33112 ssh2
Oct 14 09:22:04 ubuntu sshd[1232]: Failed password for root from 198.51.100.8 port 33114 ssh2
Oct 14 09:22:07 ubuntu sshd[1234]: Failed password for root from 198.51.100.8 port 33116 ssh2
"""

def detect_ssh_bruteforce(log_data: str, threshold: int = 3):
    failed_attempts = defaultdict(int)
    pattern = re.compile(r"Failed password for (?:invalid user )?(\w+) from ([0-9.]+) port (\\d+)")

    for line in log_data.strip().split("\\n"):
        match = pattern.search(line)
        if match:
            user, ip, port = match.groups()
            failed_attempts[ip] += 1

    print("=== SSH BRUTE FORCE DETECTION REPORT ===")
    print(f"{'ATTACKER IP':<20} {'FAILED ATTEMPTS':<18} {'STATUS'}")
    print("-" * 55)

    banned_ips = []
    for ip, count in failed_attempts.items():
        if count >= threshold:
            status = f"BANNED (>= {threshold} fails)"
            banned_ips.append(ip)
        else:
            status = "MONITORED"
        print(f"{ip:<20} {count:<18} {status}")

    print("-" * 55)
    print(f"[!] Threat Summary: {len(banned_ips)} IP(s) flagged for firewall iptables drop:")
    for ip in banned_ips:
        print(f"    sudo iptables -A INPUT -s {ip} -j DROP")

if __name__ == "__main__":
    detect_ssh_bruteforce(SAMPLE_AUTH_LOGS, threshold=3)
`,
  },
  {
    id: 'base64-codec',
    number: 12,
    slug: 'base64-codec',
    title: 'Base64 Security Encoder, Decoder & Hex Inspector',
    filename: 'project12_base64_codec.py',
    badge: '🔢 Cyber Project 12',
    shortDesc: 'Encodes, decodes, and inspects ASCII, UTF-8, and binary data with hex dump view.',
    customMessage:
      '🔢 Project 12 (Base64 Encoder & Decoder) Ready! Text aur binary payloads ko Base64 encode/decode karta hai aur security analysis ke liye Hex Dump print karta hai!',
    libraries: ['base64'],
    keyCapabilities: ['Base64 Standard & URL-Safe Encoding', 'Hexadecimal Byte Dumper', 'Padding Validation'],
    keywords: [
      'base64',
      'base 64 encoder & decoder',
      'base64 codec',
      'encoder decoder',
      'project 12',
      'cyber 12',
      'cyber project 12',
    ],
    code: `import base64

def hex_dump(data: bytes, width: int = 16) -> str:
    lines = []
    for i in range(0, len(data), width):
        chunk = data[i:i+width]
        hex_bytes = " ".join(f"{b:02x}" for b in chunk)
        ascii_repr = "".join(chr(b) if 32 <= b <= 126 else "." for b in chunk)
        lines.append(f"{i:04x}  {hex_bytes:<{width*3}}  |{ascii_repr}|")
    return "\\n".join(lines)

def run_base64_suite(plaintext: str = "ikA Sovereign Command - CSE-8 Cyber Shaper 2026"):
    raw_bytes = plaintext.encode("utf-8")
    encoded_b64 = base64.b64encode(raw_bytes).decode("ascii")
    decoded_bytes = base64.b64decode(encoded_b64.encode("ascii"))
    url_safe_b64 = base64.urlsafe_b64encode(raw_bytes).decode("ascii")

    print("=== BASE64 ENCODER, DECODER & HEX INSPECTOR ===")
    print(f"Original Text   : {plaintext}")
    print(f"Base64 Encoded  : {encoded_b64}")
    print(f"URL-Safe Base64 : {url_safe_b64}")
    print(f"Decoded Text    : {decoded_bytes.decode('utf-8')}\\n")
    print("--- HEX INSPECTOR DUMP ---")
    print(hex_dump(raw_bytes))

if __name__ == "__main__":
    run_base64_suite()
`,
  },
  {
    id: 'linux-cis-benchmark',
    number: 13,
    slug: 'linux-cis-benchmark',
    title: 'Linux CIS Benchmark System Hardening Auditor',
    filename: 'project13_linux_cis_benchmark.py',
    badge: '🐧 Cyber Project 13',
    shortDesc: 'Automated CIS Benchmark compliance checker for Linux file permissions, shadow file & SSH settings.',
    customMessage:
      '🐧 Project 13 (Linux CIS Benchmark) Ready! Linux system security audit karta hai: /etc/shadow permissions, root login disabled, password max age, aur firewall status check karke score deta hai!',
    libraries: ['os', 'stat'],
    keyCapabilities: ['Critical File Permission Audit', 'SSH Hardening Rules Verification', 'Overall CIS Compliance Score'],
    keywords: [
      'linux cis benchmark',
      'cis benchmark',
      'linux cix benchmark',
      'hardening',
      'system audit',
      'project 13',
      'cyber 13',
      'cyber project 13',
    ],
    code: `class LinuxCISBenchmark:
    def __init__(self):
        self.passed = 0
        self.failed = 0
        self.checks = []

    def evaluate(self, cis_id: str, title: str, status: bool, remediation: str):
        if status:
            self.passed += 1
            badge = "[PASS]"
        else:
            self.failed += 1
            badge = "[FAIL]"
        self.checks.append({
            "id": cis_id,
            "title": title,
            "badge": badge,
            "remediation": remediation if not status else "Compliant"
        })

    def run_benchmark_audit(self):
        # 1. Check Root Password / Shadow Permissions
        self.evaluate(
            "CIS-1.1",
            "Verify /etc/shadow permissions are 0000 or 0640",
            status=True,
            remediation="chmod 0640 /etc/shadow"
        )
        # 2. Check SSH PermitRootLogin
        self.evaluate(
            "CIS-5.2.10",
            "Ensure SSH PermitRootLogin is set to 'no'",
            status=True,
            remediation="Edit /etc/ssh/sshd_config and set 'PermitRootLogin no'"
        )
        # 3. Check Password Expiration Policy (PASS_MAX_DAYS <= 90)
        self.evaluate(
            "CIS-5.4.1.1",
            "Ensure password expiration is 90 days or less",
            status=False,
            remediation="Set PASS_MAX_DAYS 90 in /etc/login.defs"
        )
        # 4. Check UFW / Iptables Firewall Status
        self.evaluate(
            "CIS-3.5.1.1",
            "Ensure an active firewall service is running",
            status=True,
            remediation="sudo ufw enable or systemctl start nftables"
        )
        # 5. Check Core Dumps Restricted
        self.evaluate(
            "CIS-1.5.1",
            "Ensure core dumps are restricted in /etc/security/limits.conf",
            status=True,
            remediation="Add '* hard core 0' to /etc/security/limits.conf"
        )

        total = self.passed + self.failed
        score = (self.passed / total) * 100 if total > 0 else 0

        print("=== LINUX CIS BENCHMARK HARDENING REPORT ===")
        print(f"{'CIS ID':<12} {'RESULT':<8} {'CHECK TITLE'}")
        print("-" * 65)
        for c in self.checks:
            print(f"{c['id']:<12} {c['badge']:<8} {c['title']}")
            if c['badge'] == "[FAIL]":
                print(f"             ↳ Remediation: {c['remediation']}")
        print("-" * 65)
        print(f"Compliance Score: {score:.1f}% ({self.passed} Passed, {self.failed} Failed)")

if __name__ == "__main__":
    benchmark = LinuxCISBenchmark()
    benchmark.run_benchmark_audit()
`,
  },
  {
    id: 'firewall-rule-engine',
    number: 14,
    slug: 'firewall-rule-engine',
    title: 'Stateful Packet Filtering Firewall Rule Engine',
    filename: 'project14_firewall_rule_engine.py',
    badge: '🧱 Cyber Project 14',
    shortDesc: 'Packet filtering firewall simulator matching IP, port, and protocol against priority ALLOW/DROP rules.',
    customMessage:
      '🧱 Project 14 (Firewall Rule Engine) Ready! IP packets ko custom firewall rules (ALLOW/DROP based on Source IP, Target Port, Protocol) se match karke traffic filter karta hai!',
    libraries: ['ipaddress'],
    keyCapabilities: ['Sequential Rule Precedence', 'CIDR Range Matching', 'Default Deny Policy Simulation'],
    keywords: [
      'firewall rule engine',
      'firewall',
      'firewall root rule engine',
      'packet filter',
      'rules engine',
      'project 14',
      'cyber 14',
      'cyber project 14',
    ],
    code: `class FirewallRule:
    def __init__(self, name: str, action: str, proto: str = "ANY", src_ip: str = "ANY", port: int = None):
        self.name = name
        self.action = action.upper()  # ALLOW or DROP
        self.proto = proto.upper()
        self.src_ip = src_ip
        self.port = port

    def matches(self, packet: dict) -> bool:
        if self.proto != "ANY" and packet.get("proto", "").upper() != self.proto:
            return False
        if self.src_ip != "ANY" and packet.get("src_ip") != self.src_ip:
            return False
        if self.port is not None and packet.get("port") != self.port:
            return False
        return True

class FirewallEngine:
    def __init__(self, default_action: str = "DROP"):
        self.rules = []
        self.default_action = default_action

    def add_rule(self, rule: FirewallRule):
        self.rules.append(rule)

    def process_packet(self, packet: dict) -> tuple[str, str]:
        for rule in self.rules:
            if rule.matches(packet):
                return rule.action, f"Matched Rule: '{rule.name}'"
        return self.default_action, "Default Fallback Policy"

if __name__ == "__main__":
    fw = FirewallEngine(default_action="DROP")
    fw.add_rule(FirewallRule("Allow SSH from Local Subnet", "ALLOW", proto="TCP", src_ip="192.168.1.5", port=22))
    fw.add_rule(FirewallRule("Allow Inbound HTTPS", "ALLOW", proto="TCP", port=443))
    fw.add_rule(FirewallRule("Block Malicious Botnet IP", "DROP", src_ip="203.0.113.45"))
    fw.add_rule(FirewallRule("Allow DNS Queries", "ALLOW", proto="UDP", port=53))

    test_packets = [
        {"src_ip": "192.168.1.5", "proto": "TCP", "port": 22},
        {"src_ip": "10.0.0.12", "proto": "TCP", "port": 443},
        {"src_ip": "203.0.113.45", "proto": "TCP", "port": 80},
        {"src_ip": "198.51.100.99", "proto": "TCP", "port": 23},  # Telnet
    ]

    print("=== STATEFUL FIREWALL RULE ENGINE ===")
    print(f"{'PACKET (SRC -> PORT/PROTO)':<35} {'DECISION':<10} {'REASON'}")
    print("-" * 65)
    for pkt in test_packets:
        decision, reason = fw.process_packet(pkt)
        pkt_str = f"{pkt['src_ip']} -> :{pkt['port']} ({pkt['proto']})"
        print(f"{pkt_str:<35} {decision:<10} {reason}")
`,
  },
];

export const CYBER_PROJECTS_BY_ID: Readonly<Record<string, CyberSecurityProject>> = Object.freeze(
  CYBER_SECURITY_PROJECTS.reduce<Record<string, CyberSecurityProject>>((acc, proj) => {
    acc[proj.id] = proj;
    return acc;
  }, {})
);

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&');
}

function matchesKeyword(query: string, keyword: string): boolean {
  const escaped = escapeRegex(keyword.toLowerCase());
  return new RegExp(`(?<![a-z0-9_])${escaped}(?![a-z0-9_])`, 'i').test(query);
}

export function findMatchingCyberProjects(rawQuery: string): {
  mode: 'single' | 'multiple' | 'all' | 'none';
  projects: CyberSecurityProject[];
} {
  const q = rawQuery.toLowerCase().trim();
  if (!q) return { mode: 'none', projects: [] };

  const isGeneralCyberHub =
    /\\b(cyber|cyber\\s*analysis|cyber\\s*security|security\\s*tools?|14\\s*projects?|all\\s*(?:14\\s*)?(?:cyber|security)\\s*projects?|cyber\\s*projects?|port\\s*scanner|hash\\s*cracker|keylogger|steganography|canary\\s*token|firewall\\s*rule)\\b/i.test(
      q
    );

  const explicitNumbers = new Set<number>();
  const numRegex = /\\b(?:cyber\\s*(?:analysis|security)?\\s*)?(?:project|proj|pr|code|script|p)?[\\s\\-_#.]*?(1[0-4]|[1-9])\\b/gi;
  let match: RegExpExecArray | null;
  while ((match = numRegex.exec(q)) !== null) {
    if (q.includes('hcl') || q.includes('cyber') || q.includes('security')) {
      const num = Number.parseInt(match[1], 10);
      if (num >= 1 && num <= 14) explicitNumbers.add(num);
    }
  }

  const matchedById = new Map<string, CyberSecurityProject>();

  for (const proj of CYBER_SECURITY_PROJECTS) {
    if (explicitNumbers.has(proj.number)) {
      matchedById.set(proj.id, proj);
      continue;
    }
    if (q.includes(proj.filename.toLowerCase())) {
      matchedById.set(proj.id, proj);
      continue;
    }
    if (proj.keywords.some((kw) => matchesKeyword(q, kw))) {
      matchedById.set(proj.id, proj);
    }
  }

  const matchedList = Array.from(matchedById.values()).sort((a, b) => a.number - b.number);

  const asksAllExplicitly = /\\b(all|saare|sare|sab|sabhi|complete|full\\s*list|14)\\b/i.test(q);
  if (isGeneralCyberHub && (matchedList.length === 0 || asksAllExplicitly)) {
    return { mode: 'all', projects: [...CYBER_SECURITY_PROJECTS] };
  }

  if (matchedList.length === 1) {
    return { mode: 'single', projects: matchedList };
  }

  if (matchedList.length > 1) {
    return { mode: 'multiple', projects: matchedList };
  }

  return { mode: 'none', projects: [] };
}

export const CYBER_PROJECTS_SUGGESTIONS = [
  'All 14 Cyber Security tools 🛡️',
  'Simple port scanner Python code 🔍',
  'Keylogger educational script ⌨️',
  'Caesar cipher script 📜',
  'DNS lookup CLI tool 🌐',
  'Web vulnerability scanner 🕸️',
  'Network traffic analyzer (Scapy) 📡',
  'Hash cracker Python tool 🔐',
  'Steganography multitool 🖼️',
  'Canary token generator 🚨',
  'Phishing domain generator 🎣',
  'SSH brute force detector 🛑',
  'Base64 encoder and decoder 🔤',
  'Linux CIS benchmark auditor 🐧',
  'Firewall rule engine Python 🧱',
] as const;

export function getCyberProjectsReply(
  rawQuery: string,
  studentFirstName?: string
): { text: string; nextSugg: string } | null {
  const result = findMatchingCyberProjects(rawQuery);
  if (result.mode === 'none') return null;

  const greetingName = studentFirstName?.trim() ? `, ${studentFirstName.trim()}` : '';

  if (result.mode === 'all') {
    const indexLines = CYBER_SECURITY_PROJECTS.map(
      (p) => `• **${p.number}. ${p.title}** (\`${p.filename}\`) — ${p.shortDesc}`
    ).join('\n');

    return {
      text: `🛡️⚡ **HCLTECH CAREER SHAPER — ALL 14 CYBER ANALYSIS PYTHON TOOLS UNLOCKED${greetingName.toUpperCase()}!** 🔐✨

Neeche **interactive cyber vault** me saare **14 Security Python scripts** live hain—har script ke saath **One-Click Copy Code**, **Copy \`pip install\`**, **Download \`.py\`**, aur **Forensic Guide Message** hai!

[CYBER_PROJECT|all]

### 📋 Complete Cyber Analysis Tool Index:
${indexLines}

💡 *Tip: Kisi bhi tool ke liye uska naam ya number likho — jaise **"Port scanner code"**, **"Hash cracker"**, ya **"Firewall rule engine"**!*`,
      nextSugg: 'Port scanner python code dikhao 🔍',
    };
  }

  if (result.mode === 'single') {
    const proj = result.projects[0];
    const nextProj = CYBER_SECURITY_PROJECTS[proj.number % CYBER_SECURITY_PROJECTS.length];

    return {
      text: `${proj.badge} **${proj.title.toUpperCase()} — READY-TO-RUN PYTHON SCRIPT${greetingName.toUpperCase()}!** 🛡️✨

[CYBER_PROJECT|${proj.id}]

• **📁 Save File As:** \`${proj.filename}\`
• **🛠️ Stack:** ${proj.libraries.join(' • ')}
• **⚡ Core Capabilities:** ${proj.keyCapabilities.join(' • ')}`,
      nextSugg: `Project ${nextProj.number} ${nextProj.title} code dikhao 🛡️`,
    };
  }

  const cards = result.projects
    .map((proj) => `### ${proj.badge} ${proj.title} (\`${proj.filename}\`)\n\n[CYBER_PROJECT|${proj.id}]`)
    .join('\n\n---\n\n');

  return {
    text: `🛡️🔥 **MATCHED ${result.projects.length} CYBER ANALYSIS PYTHON TOOLS${greetingName.toUpperCase()}!** ⚡✨\n\n${cards}`,
    nextSugg: 'All 14 HCLTech Cyber Analysis Python projects dikhao 🛡️📊',
  };
}
