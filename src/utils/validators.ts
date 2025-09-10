import { VALIDATION_RULES } from './constants';

/**
 * Validate email address
 */
export const validateEmail = (email: string): { isValid: boolean; error?: string } => {
  if (!email.trim()) {
    return { isValid: false, error: 'Email é obrigatório' };
  }
  
  if (!VALIDATION_RULES.EMAIL_REGEX.test(email)) {
    return { isValid: false, error: 'Email inválido' };
  }
  
  return { isValid: true };
};

/**
 * Validate password
 */
export const validatePassword = (password: string): { isValid: boolean; error?: string } => {
  if (!password) {
    return { isValid: false, error: 'Senha é obrigatória' };
  }
  
  if (password.length < VALIDATION_RULES.PASSWORD_MIN_LENGTH) {
    return { 
      isValid: false, 
      error: `Senha deve ter pelo menos ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} caracteres` 
    };
  }
  
  return { isValid: true };
};

/**
 * Validate name
 */
export const validateName = (name: string): { isValid: boolean; error?: string } => {
  if (!name.trim()) {
    return { isValid: false, error: 'Nome é obrigatório' };
  }
  
  if (name.trim().length < VALIDATION_RULES.NAME_MIN_LENGTH) {
    return { 
      isValid: false, 
      error: `Nome deve ter pelo menos ${VALIDATION_RULES.NAME_MIN_LENGTH} caracteres` 
    };
  }
  
  if (name.trim().length > VALIDATION_RULES.NAME_MAX_LENGTH) {
    return { 
      isValid: false, 
      error: `Nome deve ter no máximo ${VALIDATION_RULES.NAME_MAX_LENGTH} caracteres` 
    };
  }
  
  return { isValid: true };
};

/**
 * Validate search query
 */
export const validateSearchQuery = (query: string): { isValid: boolean; error?: string } => {
  if (!query.trim()) {
    return { isValid: false, error: 'Digite algo para pesquisar' };
  }
  
  if (query.trim().length < VALIDATION_RULES.SEARCH_MIN_LENGTH) {
    return { 
      isValid: false, 
      error: `Pesquisa deve ter pelo menos ${VALIDATION_RULES.SEARCH_MIN_LENGTH} caracteres` 
    };
  }
  
  return { isValid: true };
};

/**
 * Validate coordinates
 */
export const validateCoordinates = (
  latitude: number, 
  longitude: number
): { isValid: boolean; error?: string } => {
  if (latitude < -90 || latitude > 90) {
    return { isValid: false, error: 'Latitude inválida' };
  }
  
  if (longitude < -180 || longitude > 180) {
    return { isValid: false, error: 'Longitude inválida' };
  }
  
  return { isValid: true };
};

/**
 * Validate bus line code
 */
export const validateBusLineCode = (code: string): { isValid: boolean; error?: string } => {
  if (!code.trim()) {
    return { isValid: false, error: 'Código da linha é obrigatório' };
  }
  
  const numericCode = parseInt(code, 10);
  if (isNaN(numericCode) || numericCode <= 0) {
    return { isValid: false, error: 'Código da linha deve ser um número válido' };
  }
  
  return { isValid: true };
};