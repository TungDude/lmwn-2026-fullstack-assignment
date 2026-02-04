import { Stack } from "@mui/material";
import { LanguageSwitch } from "../molecules/LanguageSwitch";

export default function Header() {
    return (
        <header className="sticky bg-white top-0 z-10 flex items-center justify-between px-8 py-2 border-b border-gray-300">
            <img
                src="/lmwn-logo.svg"
                alt="LMWN"
                style={{
                    width: 48,
                    height: 48,
                }}
            />
            <Stack direction="row" alignItems="center" spacing={2}>
                <LanguageSwitch />
            </Stack>
        </header>
    );
}