export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain an uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain a lowercase letter');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain a number');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

export const validatePlate = (plate: string): boolean => {
  const plateRegex = /^[A-Z]{2,3}-?\d{3,4}$/;
  return plateRegex.test(plate.toUpperCase());
};

export const validateDocumentNumber = (document: string): boolean => {
  return document.length >= 5 && document.length <= 20;
};

export const validateWeight = (weight: number): boolean => {
  return weight > 0 && weight < 100000;
};

export const validateMoistureLevel = (moisture: number): boolean => {
  return moisture >= 0 && moisture <= 100;
};
