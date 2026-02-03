import type { Resources } from '../app/internationalization/i18n.type';

declare module 'i18next' {
    interface CustomTypeOptions {
        resources: Resources;
    }
}