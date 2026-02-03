import { ToggleButtonGroup, ToggleButton } from "@mui/material";
import { useTranslation } from 'react-i18next';

const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'th', name: 'ไทย', flag: '🇹🇭' },
] as const;

export function LanguageSwitch() {
    const { i18n } = useTranslation();

    const handleSelectLanguage = (_: React.MouseEvent<HTMLElement>, newLang: string | null) => {
        if (newLang) {
            i18n.changeLanguage(newLang);
        }
    };

    return (
        <ToggleButtonGroup
            value={i18n.language}
            exclusive
            onChange={handleSelectLanguage}
            aria-label="Language Switch"
            color="primary"
        >
            {languages.map((lang) => (
                <ToggleButton
                    key={lang.code}
                    value={lang.code}
                    aria-label={lang.name}
                    sx={{
                        py: 0.5
                    }}
                >
                    {lang.flag}
                </ToggleButton>
            ))}
        </ToggleButtonGroup>
    );
}