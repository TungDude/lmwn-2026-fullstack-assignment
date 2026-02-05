import { describe, it, expect } from 'vitest';
import { formatDateTime } from '../utils';

describe('formatDateTime', () => {
    it('should handle invalid dates', () => {
        const dateString = 'invalid-date-string';
        expect(formatDateTime(dateString)).toBe('Invalid Date');
    });
});