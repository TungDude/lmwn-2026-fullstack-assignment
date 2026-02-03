import type { en } from '@/app/internationalization/locales/en';

export type Resources = {
    [K in keyof typeof en]: typeof en[K];
};
export type ResourceKey = keyof Resources;