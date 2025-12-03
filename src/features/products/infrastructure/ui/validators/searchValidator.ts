import DOMPurify from 'dompurify';

export interface SearchValidationResult {
  isValid: boolean;
  error?: string;
  sanitizedQuery?: string;
}

export const validateSearchQuery = (query: string): SearchValidationResult => {
  if (query.trim().length > 0 && query.trim().length < 2) {
    return {
      isValid: false,
      error: 'La búsqueda debe tener al menos 2 caracteres',
    };
  }

  if (query.length > 100) {
    return {
      isValid: false,
      error: 'La búsqueda no puede superar 100 caracteres',
    };
  }

  const sanitizedQuery = DOMPurify.sanitize(query, {
    ALLOWED_TAGS: [], 
    ALLOWED_ATTR: [], 
    KEEP_CONTENT: true, 
  });

  if (sanitizedQuery !== query) {
    return {
      isValid: false,
      error: 'Caracteres no permitidos en la búsqueda',
      sanitizedQuery,
    };
  }

  return { 
    isValid: true,
    sanitizedQuery,
  };
};
