import { validateSearchQuery } from './searchValidator';

describe('validateSearchQuery', () => {
  describe('Valid queries', () => {
    it('should accept valid queries', () => {
      const result1 = validateSearchQuery('iPhone');
      expect(result1.isValid).toBe(true);
      expect(result1.sanitizedQuery).toBe('iPhone');

      const result2 = validateSearchQuery('Galaxy S23');
      expect(result2.isValid).toBe(true);
      expect(result2.sanitizedQuery).toBe('Galaxy S23');
    });

    it('should accept empty queries', () => {
      const result = validateSearchQuery('');
      expect(result.isValid).toBe(true);
      expect(result.sanitizedQuery).toBe('');
    });

    it('should accept queries with spaces', () => {
      const result = validateSearchQuery('MacBook Pro');
      expect(result.isValid).toBe(true);
      expect(result.sanitizedQuery).toBe('MacBook Pro');
    });

    it('should accept queries with numbers', () => {
      const result = validateSearchQuery('iPhone 14');
      expect(result.isValid).toBe(true);
      expect(result.sanitizedQuery).toBe('iPhone 14');
    });

    it('should accept queries at max length (100 chars)', () => {
      const maxQuery = 'a'.repeat(100);
      const result = validateSearchQuery(maxQuery);
      expect(result.isValid).toBe(true);
    });

    it('should accept safe special characters', () => {
      const result1 = validateSearchQuery('iPhone (2023)');
      expect(result1.isValid).toBe(true);
      expect(result1.sanitizedQuery).toBe('iPhone (2023)');

      const result2 = validateSearchQuery('price: $999');
      expect(result2.isValid).toBe(true);

      const result3 = validateSearchQuery('model-x');
      expect(result3.isValid).toBe(true);
    });
  });

  describe('Invalid queries - Length validation', () => {
    it('should reject queries shorter than 2 chars (excluding whitespace)', () => {
      const result = validateSearchQuery('a');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('La búsqueda debe tener al menos 2 caracteres');
    });

    it('should reject single character with spaces', () => {
      const result = validateSearchQuery('  a  ');
      expect(result.isValid).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should reject queries longer than 100 chars', () => {
      const result = validateSearchQuery('a'.repeat(101));
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('La búsqueda no puede superar 100 caracteres');
    });
  });

  describe('Invalid queries - Dangerous characters (XSS) using DOMPurify', () => {
    it('should reject script tags', () => {
      const result = validateSearchQuery('<script>alert("xss")</script>');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Caracteres no permitidos en la búsqueda');
      expect(result.sanitizedQuery).toBe(''); // DOMPurify removes script tags completely
    });

    it('should reject uppercase script tags', () => {
      const result = validateSearchQuery('<SCRIPT>alert("xss")</SCRIPT>');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Caracteres no permitidos en la búsqueda');
    });

    it('should reject iframe tags', () => {
      const result = validateSearchQuery('<iframe src="malicious.com"></iframe>');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Caracteres no permitidos en la búsqueda');
    });

    it('should reject javascript: protocol', () => {
      const result = validateSearchQuery('<a href="javascript:alert(1)">click</a>');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Caracteres no permitidos en la búsqueda');
    });

    it('should reject mixed case javascript: protocol', () => {
      const result = validateSearchQuery('<a href="JaVaScRiPt:alert(1)">click</a>');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Caracteres no permitidos en la búsqueda');
    });

    it('should reject img tags with onerror', () => {
      const result = validateSearchQuery('<img src=x onerror="alert(1)">');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Caracteres no permitidos en la búsqueda');
    });

    it('should reject svg with onload', () => {
      const result = validateSearchQuery('<svg onload="alert(1)">');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Caracteres no permitidos en la búsqueda');
    });

    it('should reject any HTML tags', () => {
      const result = validateSearchQuery('<div>test</div>');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Caracteres no permitidos en la búsqueda');
      expect(result.sanitizedQuery).toBe('test'); // Content preserved
    });
  });

  describe('Edge cases', () => {
    it('should accept queries with only whitespace as valid (will be trimmed)', () => {
      const result = validateSearchQuery('   ');
      expect(result.isValid).toBe(true);
    });

    it('should reject queries with HTML in the middle', () => {
      const result = validateSearchQuery('test <script>alert(1)</script> test');
      expect(result.isValid).toBe(false);
      expect(result.sanitizedQuery).toBe('test  test'); // Script removed, spaces preserved
    });

    it('should handle encoded HTML entities', () => {
      const result = validateSearchQuery('&lt;script&gt;');
      expect(result.isValid).toBe(true); // Already encoded, safe
    });
  });
});
