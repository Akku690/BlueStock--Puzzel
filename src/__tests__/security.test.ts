import { validateEmail, validatePassword, validateAnswerInput, sanitizeInput } from '../utils/security';

describe('Security Utils', () => {
  describe('validateEmail', () => {
    it('validates correct email formats', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
      expect(validateEmail('user+tag@example.com')).toBe(true);
    });

    it('rejects invalid email formats', () => {
      expect(validateEmail('invalid')).toBe(false);
      expect(validateEmail('invalid@')).toBe(false);
      expect(validateEmail('@invalid.com')).toBe(false);
      expect(validateEmail('invalid@domain')).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('validates strong passwords', () => {
      const result = validatePassword('StrongPass123');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('rejects short passwords', () => {
      const result = validatePassword('Short1');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must be at least 8 characters');
    });

    it('rejects passwords without uppercase', () => {
      const result = validatePassword('lowercase123');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one uppercase letter');
    });

    it('rejects passwords without lowercase', () => {
      const result = validatePassword('UPPERCASE123');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one lowercase letter');
    });

    it('rejects passwords without numbers', () => {
      const result = validatePassword('NoNumbers');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one number');
    });
  });

  describe('sanitizeInput', () => {
    it('escapes HTML tags', () => {
      const input = '<script>alert("xss")</script>';
      const sanitized = sanitizeInput(input);
      expect(sanitized).not.toContain('<script>');
      expect(sanitized).toContain('&lt;script&gt;');
    });

    it('handles normal text', () => {
      const input = 'Normal text';
      const sanitized = sanitizeInput(input);
      expect(sanitized).toBe('Normal text');
    });

    it('escapes special characters', () => {
      const input = '<div>Test & "quotes"</div>';
      const sanitized = sanitizeInput(input);
      expect(sanitized).not.toContain('<div>');
    });
  });

  describe('validateAnswerInput', () => {
    it('validates correct answer indices', () => {
      expect(validateAnswerInput(0, 4)).toBe(true);
      expect(validateAnswerInput(3, 4)).toBe(true);
    });

    it('rejects invalid indices', () => {
      expect(validateAnswerInput(-1, 4)).toBe(false);
      expect(validateAnswerInput(4, 4)).toBe(false);
      expect(validateAnswerInput(1.5, 4)).toBe(false);
    });
  });
});
