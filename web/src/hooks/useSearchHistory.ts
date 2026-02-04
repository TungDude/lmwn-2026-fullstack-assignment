import { useState, useEffect } from "react";

export interface UseSearchHistoryOptions {
    storageKey: string;
    maxItems?: number;
}

export function useSearchHistory({
    storageKey,
    maxItems = 5,
}: UseSearchHistoryOptions) {
    const [searchHistory, setSearchHistory] = useState<string[]>([]);

    useEffect(() => {
        const savedHistory = localStorage.getItem(storageKey);
        if (savedHistory) {
            try {
                setSearchHistory(JSON.parse(savedHistory));
            } catch (error) {
                console.error("Failed to parse search history:", error);
                setSearchHistory([]);
            }
        }
    }, [storageKey]);

    const addToHistory = (searchTerm: string) => {
        const trimmedTerm = searchTerm.trim();

        if (trimmedTerm === "") {
            return;
        }

        const updatedHistory = [
            trimmedTerm,
            ...searchHistory.filter((item) => item !== trimmedTerm),
        ].slice(0, maxItems);

        setSearchHistory(updatedHistory);
        localStorage.setItem(storageKey, JSON.stringify(updatedHistory));
    };

    const filterHistory = (query: string): string[] => {
        const trimmedQuery = query.trim().toLowerCase();

        if (trimmedQuery === "") {
            return searchHistory;
        }

        return searchHistory.filter((item) =>
            item.toLowerCase().includes(trimmedQuery)
        );
    };

    const clearHistory = () => {
        setSearchHistory([]);
        localStorage.removeItem(storageKey);
    };

    return {
        searchHistory,
        addToHistory,
        filterHistory,
        clearHistory,
    };
}