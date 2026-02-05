import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useSearchHistory } from '../useSearchHistory';

type UseSearchHistoryResult = ReturnType<typeof useSearchHistory>;

async function addSearchAndExpect(
    result: { current: UseSearchHistoryResult },
    value: string
) {
    act(() => {
        result.current.addToHistory(value);
    });

    await waitFor(() => {
        expect(result.current.searchHistory).toContain(value);
    });
}

describe('useSearchHistory', () => {
    const storageKey = 'test-search-history';

    beforeEach(() => {
        localStorage.clear();
    });

    afterEach(() => {
        localStorage.clear();
    });

    describe('initialization', () => {
        it('should initialize with empty history', () => {
            const { result } = renderHook(() =>
                useSearchHistory({ storageKey })
            );

            expect(result.current.searchHistory).toEqual([]);
        });

        it('should load saved history from localStorage', () => {
            const savedHistory = ['search1', 'search2'];
            localStorage.setItem(storageKey, JSON.stringify(savedHistory));

            const { result } = renderHook(() =>
                useSearchHistory({ storageKey })
            );

            expect(result.current.searchHistory).toEqual(savedHistory);
        });

        it('should handle corrupted localStorage data', () => {
            localStorage.setItem(storageKey, 'invalid-json');
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

            const { result } = renderHook(() =>
                useSearchHistory({ storageKey })
            );

            expect(result.current.searchHistory).toEqual([]);
            expect(consoleSpy).toHaveBeenCalled();

            consoleSpy.mockRestore();
        });
    });

    describe('addToHistory', () => {
        it('should add new search term to history', () => {
            const { result } = renderHook(() =>
                useSearchHistory({ storageKey })
            );

            act(() => {
                result.current.addToHistory('test search');
            });

            expect(result.current.searchHistory).toEqual(['test search']);
            expect(localStorage.getItem(storageKey)).toBe('["test search"]');
        });

        it('should trim whitespace from search term', () => {
            const { result } = renderHook(() =>
                useSearchHistory({ storageKey })
            );

            act(() => {
                result.current.addToHistory('  test search  ');
            });

            expect(result.current.searchHistory).toEqual(['test search']);
        });

        it('should ignore empty strings', () => {
            const { result } = renderHook(() =>
                useSearchHistory({ storageKey })
            );

            act(() => {
                result.current.addToHistory('');
            });

            expect(result.current.searchHistory).toEqual([]);
        });

        it('should ignore whitespace-only strings', () => {
            const { result } = renderHook(() =>
                useSearchHistory({ storageKey })
            );

            act(() => {
                result.current.addToHistory('   ');
            });

            expect(result.current.searchHistory).toEqual([]);
        });

        it('should move duplicate to top', async () => {
            const { result } = renderHook(() =>
                useSearchHistory({ storageKey })
            );

            await addSearchAndExpect(result, 'search1');
            await addSearchAndExpect(result, 'search2');
            await addSearchAndExpect(result, 'search1');

            await waitFor(() => {
                expect(result.current.searchHistory).toEqual(['search1', 'search2']);
            });
        });

        it('should respect maxItems limit', async () => {
            const { result } = renderHook(() =>
                useSearchHistory({ storageKey, maxItems: 3 })
            );

            await addSearchAndExpect(result, 'search1');
            await addSearchAndExpect(result, 'search2');
            await addSearchAndExpect(result, 'search3');
            await addSearchAndExpect(result, 'search4');

            await waitFor(() => {
                expect(result.current.searchHistory).toHaveLength(3);
                expect(result.current.searchHistory).toEqual(['search4', 'search3', 'search2']);
            });
        });
    });

    describe('filterHistory', () => {
        beforeEach(() => {
            localStorage.setItem(storageKey, JSON.stringify([
                'react hooks',
                'react query',
                'javascript',
                'typescript',
            ]));
        });

        it('should return all history for empty query', () => {
            const { result } = renderHook(() =>
                useSearchHistory({ storageKey })
            );

            const filtered = result.current.filterHistory('');

            expect(filtered).toEqual([
                'react hooks',
                'react query',
                'javascript',
                'typescript',
            ]);
        });

        it('should filter history case-insensitively', () => {
            const { result } = renderHook(() =>
                useSearchHistory({ storageKey })
            );

            const filtered = result.current.filterHistory('REACT');

            expect(filtered).toEqual(['react hooks', 'react query']);
        });

        it('should filter by partial match', () => {
            const { result } = renderHook(() =>
                useSearchHistory({ storageKey })
            );

            const filtered = result.current.filterHistory('script');

            expect(filtered).toEqual(['javascript', 'typescript']);
        });

        it('should trim query whitespace', () => {
            const { result } = renderHook(() =>
                useSearchHistory({ storageKey })
            );

            const filtered = result.current.filterHistory('  react  ');

            expect(filtered).toEqual(['react hooks', 'react query']);
        });

        it('should return empty array when no matches', () => {
            const { result } = renderHook(() =>
                useSearchHistory({ storageKey })
            );

            const filtered = result.current.filterHistory('python');

            expect(filtered).toEqual([]);
        });
    });

    describe('clearHistory', () => {
        it('should clear search history', () => {
            localStorage.setItem(storageKey, JSON.stringify(['search1', 'search2']));

            const { result } = renderHook(() =>
                useSearchHistory({ storageKey })
            );

            act(() => {
                result.current.clearHistory();
            });

            expect(result.current.searchHistory).toEqual([]);
            expect(localStorage.getItem(storageKey)).toBeNull();
        });
    });
});