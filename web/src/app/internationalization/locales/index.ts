export { en } from './en';
export { th } from './th';

export const supportedLanguages = ['en', 'th'] as const;
export type SupportedLanguage = typeof supportedLanguages[number];
export const defaultLanguage: SupportedLanguage = 'en';