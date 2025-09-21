// src/utils/validation.js - Validação robusta de entrada

// Validação de email
export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validação de senha forte
export function validatePassword(password) {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return {
    isValid: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar,
    errors: {
      minLength: password.length < minLength ? `Mínimo ${minLength} caracteres` : null,
      hasUpperCase: !hasUpperCase ? 'Deve conter letra maiúscula' : null,
      hasLowerCase: !hasLowerCase ? 'Deve conter letra minúscula' : null,
      hasNumbers: !hasNumbers ? 'Deve conter números' : null,
      hasSpecialChar: !hasSpecialChar ? 'Deve conter caractere especial' : null
    }
  };
}

// Validação de usuário
export function validateUsername(username) {
  const minLength = 3;
  const maxLength = 20;
  const validChars = /^[a-zA-Z0-9_]+$/;

  return {
    isValid: username.length >= minLength && username.length <= maxLength && validChars.test(username),
    errors: {
      minLength: username.length < minLength ? `Mínimo ${minLength} caracteres` : null,
      maxLength: username.length > maxLength ? `Máximo ${maxLength} caracteres` : null,
      validChars: !validChars.test(username) ? 'Apenas letras, números e _' : null
    }
  };
}

// Validação de valor monetário
export function validateCurrency(value) {
  const numValue = parseFloat(value);
  const isValid = !isNaN(numValue) && numValue >= 0 && numValue <= 999999.99;
  
  return {
    isValid,
    errors: {
      invalid: !isValid ? 'Valor inválido (0 - 999999.99)' : null
    }
  };
}

// Validação de CPF
export function validateCPF(cpf) {
  cpf = cpf.replace(/[^\d]/g, '');
  
  if (cpf.length !== 11) return false;
  
  // Verificar se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cpf)) return false;
  
  // Validar dígitos verificadores
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.charAt(9))) return false;
  
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.charAt(10))) return false;
  
  return true;
}

// Validação de telefone
export function validatePhone(phone) {
  const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
  return phoneRegex.test(phone);
}

// Sanitização de entrada
export function sanitizeInput(input) {
  if (typeof input !== 'string') return input;
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remover caracteres HTML perigosos
    .replace(/javascript:/gi, '') // Remover javascript:
    .replace(/on\w+=/gi, ''); // Remover event handlers
}

// Validação de entrada SQL injection
export function validateSQLInput(input) {
  const sqlKeywords = /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/gi;
  return !sqlKeywords.test(input);
}

// Validação de XSS
export function validateXSS(input) {
  const xssPatterns = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
  return !xssPatterns.test(input);
}

// Validação de rate limiting
export class RateLimiter {
  constructor(maxRequests = 10, windowMs = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = new Map();
  }

  isAllowed(identifier) {
    const now = Date.now();
    const userRequests = this.requests.get(identifier) || [];
    
    // Remover requisições antigas
    const validRequests = userRequests.filter(time => now - time < this.windowMs);
    
    if (validRequests.length >= this.maxRequests) {
      return false;
    }
    
    // Adicionar nova requisição
    validRequests.push(now);
    this.requests.set(identifier, validRequests);
    
    return true;
  }

  getRemainingRequests(identifier) {
    const now = Date.now();
    const userRequests = this.requests.get(identifier) || [];
    const validRequests = userRequests.filter(time => now - time < this.windowMs);
    
    return Math.max(0, this.maxRequests - validRequests.length);
  }

  getResetTime(identifier) {
    const now = Date.now();
    const userRequests = this.requests.get(identifier) || [];
    const validRequests = userRequests.filter(time => now - time < this.windowMs);
    
    if (validRequests.length === 0) return 0;
    
    const oldestRequest = Math.min(...validRequests);
    return oldestRequest + this.windowMs;
  }
}

// Validação de formulário completo
export function validateForm(formData, rules) {
  const errors = {};
  const sanitizedData = {};

  for (const [field, value] of Object.entries(formData)) {
    const rule = rules[field];
    if (!rule) continue;

    // Sanitizar entrada
    const sanitized = sanitizeInput(value);
    sanitizedData[field] = sanitized;

    // Validar campo
    if (rule.required && (!sanitized || sanitized.length === 0)) {
      errors[field] = `${rule.label} é obrigatório`;
      continue;
    }

    if (rule.type === 'email' && !validateEmail(sanitized)) {
      errors[field] = 'Email inválido';
      continue;
    }

    if (rule.type === 'password') {
      const passwordValidation = validatePassword(sanitized);
      if (!passwordValidation.isValid) {
        errors[field] = Object.values(passwordValidation.errors).filter(Boolean).join(', ');
        continue;
      }
    }

    if (rule.type === 'username') {
      const usernameValidation = validateUsername(sanitized);
      if (!usernameValidation.isValid) {
        errors[field] = Object.values(usernameValidation.errors).filter(Boolean).join(', ');
        continue;
      }
    }

    if (rule.type === 'currency') {
      const currencyValidation = validateCurrency(sanitized);
      if (!currencyValidation.isValid) {
        errors[field] = 'Valor monetário inválido';
        continue;
      }
    }

    if (rule.minLength && sanitized.length < rule.minLength) {
      errors[field] = `Mínimo ${rule.minLength} caracteres`;
      continue;
    }

    if (rule.maxLength && sanitized.length > rule.maxLength) {
      errors[field] = `Máximo ${rule.maxLength} caracteres`;
      continue;
    }

    if (rule.pattern && !rule.pattern.test(sanitized)) {
      errors[field] = rule.message || 'Formato inválido';
      continue;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitizedData
  };
}

export default {
  validateEmail,
  validatePassword,
  validateUsername,
  validateCurrency,
  validateCPF,
  validatePhone,
  sanitizeInput,
  validateSQLInput,
  validateXSS,
  RateLimiter,
  validateForm
};
