import { describe, it, expect } from 'vitest';
import { formatDateTime, normalizeString } from '../utils';

describe('formatDateTime', () => {
    it('should handle invalid dates', () => {
        const dateString = 'invalid-date-string';
        expect(formatDateTime(dateString)).toBe('Invalid Date');
    });
});

describe('normalizeString', () => {
    it('should trim whitespace from both ends of the string', () => {
        const input = '   Hello, World!   ';
        const expectedOutput = 'Hello, World!';
        expect(normalizeString(input)).toBe(expectedOutput);
    });

    it('should return an empty string for undefined input', () => {
        expect(normalizeString()).toBe('');
    });

    it('should return an empty string for null input', () => {
        expect(normalizeString(null as unknown as string)).toBe('');
    });

    it('should not modify a string with no leading or trailing whitespace', () => {
        const input = 'NoWhitespace';
        expect(normalizeString(input)).toBe(input);
    });
});