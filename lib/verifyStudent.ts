export interface VerificationResult {
  isValid: boolean;
  error?: string;
  admissionNo?: string;
}

export function verifyCSE2Student(firstName: string, email: string): VerificationResult {
  const cleanName = firstName.trim().toLowerCase();
  const cleanEmail = email.trim().toLowerCase();

  // Pattern: name.26b01010***@abes.ac.in (where *** is exactly 3 digits)
  const emailRegex = /^([a-z]+)\.(26b01010\d{3})@abes\.ac\.in$/;
  const match = cleanEmail.match(emailRegex);

  if (!cleanName) {
    return { isValid: false, error: 'Please enter your first name.' };
  }

  if (!match) {
    return {
      isValid: false,
      error: 'Invalid email format. Access is strictly for CSE-2 (format: firstname.26b01010***@abes.ac.in).',
    };
  }

  const [, emailPrefixName, admissionNo] = match;

  if (emailPrefixName !== cleanName) {
    return {
      isValid: false,
      error: `Name mismatch! Your first name "${cleanName}" does not match "${emailPrefixName}" in the email.`,
    };
  }

  return {
    isValid: true,
    admissionNo: admissionNo.toUpperCase(),
  };
}