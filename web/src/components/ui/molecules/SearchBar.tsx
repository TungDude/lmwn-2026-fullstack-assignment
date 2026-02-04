import { TextField, InputAdornment, Box, Paper, List, ListItemButton, ListItemText, ClickAwayListener } from "@mui/material";
import { Search, History } from "lucide-react";
import { useState, useMemo, useRef, useEffect } from "react";
import { useSearchHistory } from "@/hooks/useSearchHistory";

export interface SearchbarProps {
    readonly value: string;
    readonly onSearch: (value: string) => void;
    readonly placeholder?: string;
    readonly disabled?: boolean;
    readonly storageKey?: string;
}

export default function Searchbar({
    value,
    onSearch,
    placeholder = "Search...",
    disabled = false,
    storageKey = "searchHistory",
}: SearchbarProps) {
    const [internalValue, setInternalValue] = useState(value);
    const [showHistory, setShowHistory] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const { addToHistory, filterHistory } = useSearchHistory({ storageKey });

    const filteredHistory = useMemo(
        () => filterHistory(internalValue),
        [internalValue, filterHistory]
    );

    useEffect(() => {
        setInternalValue(value);
    }, [value]);

    useEffect(() => {
        if (isFocused && filteredHistory.length > 0) {
            setShowHistory(true);
        }
    }, [isFocused, filteredHistory.length]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSearch(internalValue);
            inputRef.current?.blur();
        }
    };

    const handleSearch = (searchTerm: string) => {
        addToHistory(searchTerm);
        onSearch(searchTerm);
        setShowHistory(false);
    };

    const handleHistoryClick = (item: string) => {
        setInternalValue(item);
        handleSearch(item);
        inputRef.current?.blur();
    };

    const handleFocus = () => {
        setIsFocused(true);
        setShowHistory(true);
    };

    const handleBlur = () => {
        setIsFocused(false);
    };

    const handleClickAway = () => {
        setShowHistory(false);
    };

    return (
        <ClickAwayListener onClickAway={handleClickAway}>
            <Box sx={{ position: "relative", minWidth: "250px", width: "100%" }}>
                <TextField
                    size="small"
                    value={internalValue}
                    onChange={(e) => setInternalValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholder={placeholder}
                    disabled={disabled}
                    inputRef={inputRef}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search size={16} />
                                </InputAdornment>
                            ),
                        },
                        htmlInput: {
                            autoComplete: "off",
                            autoCorrect: "off",
                            autoCapitalize: "off",
                            spellCheck: "false",
                        }
                    }}
                    sx={{
                        width: "100%",
                        "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                            "& fieldset": {
                                borderColor: "#ccc",
                            },
                            "&:hover fieldset": {
                                borderColor: "#888",
                            },
                            "&.Mui-focused fieldset": {
                                borderColor: "#000",
                                borderWidth: "1px",
                            },
                        },
                    }}
                />
                {showHistory && filteredHistory.length > 0 && (
                    <Paper
                        elevation={3}
                        sx={{
                            position: "absolute",
                            top: "calc(100% + 4px)",
                            left: 0,
                            right: 0,
                            borderRadius: 2,
                            zIndex: 1000,
                            maxHeight: "250px",
                            overflowY: "auto",
                        }}
                        className="custom-scrollbar"
                    >
                        <List sx={{ py: 0 }}>
                            {filteredHistory.map((item, index) => (
                                <ListItemButton
                                    key={item + index}
                                    onClick={() => handleHistoryClick(item)}
                                    sx={{
                                        py: 1,
                                        px: 2,
                                        "&:hover": {
                                            backgroundColor: "#f5f5f5",
                                        },
                                    }}
                                >
                                    <History size={14} style={{ marginRight: "8px", opacity: 0.5 }} />
                                    <ListItemText
                                        primary={item}
                                        slotProps={{
                                            primary: {
                                                fontSize: "14px",
                                            },
                                        }}
                                    />
                                </ListItemButton>
                            ))}
                        </List>
                    </Paper>
                )}
            </Box>
        </ClickAwayListener>
    );
}