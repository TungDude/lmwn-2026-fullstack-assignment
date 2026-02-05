import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useToast } from '../useToast';
import { useToastStore } from '@/stores/toast-store';

describe('useToast', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        useToastStore.setState({ toasts: [] });
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('showToast', () => {
        it('should add toast and auto-remove after duration', async () => {
            const { result } = renderHook(() => useToast());

            act(() => {
                result.current.showToast({
                    title: 'Success',
                    description: 'Test message',
                    duration: 1000,
                });
            });

            expect(result.current.toasts).toHaveLength(1);

            act(() => {
                vi.advanceTimersByTime(1000);
            });

            expect(result.current.toasts).toHaveLength(0);
        });

        it('should use default duration of 4000ms', async () => {
            const { result } = renderHook(() => useToast());

            act(() => {
                result.current.showToast({
                    title: 'Test',
                    description: 'Test desc',
                });
            });

            expect(result.current.toasts).toHaveLength(1);

            // Toast should still exist before timeout
            act(() => {
                vi.advanceTimersByTime(3999);
            });

            expect(result.current.toasts).toHaveLength(1);

            // Toast should be removed after 4000ms
            act(() => {
                vi.advanceTimersByTime(1);
            });

            // Run pending timers
            act(() => {
                vi.runAllTimers();
            });

            expect(result.current.toasts).toHaveLength(0);
        });

        it('should pass through additional props', () => {
            const { result } = renderHook(() => useToast());

            act(() => {
                result.current.showToast({
                    title: 'Error',
                    description: 'Something went wrong',
                    severity: 'error',
                });
            });

            expect(result.current.toasts[0].severity).toBe('error');
        });

        it('should return toast id', () => {
            const { result } = renderHook(() => useToast());

            let toastId: string;

            act(() => {
                toastId = result.current.showToast({
                    title: 'Test',
                    description: 'Test',
                });
            });

            expect(toastId!).toBeTruthy();
            expect(result.current.toasts[0].id).toBe(toastId!);
        });
    });

    describe('removeToast', () => {
        it('should manually remove toast before timeout', () => {
            const { result } = renderHook(() => useToast());

            let toastId: string;

            act(() => {
                toastId = result.current.showToast({
                    title: 'Test',
                    description: 'Test',
                    duration: 5000,
                });
            });

            expect(result.current.toasts).toHaveLength(1);

            act(() => {
                result.current.removeToast(toastId!);
            });

            expect(result.current.toasts).toHaveLength(0);
        });
    });

    describe('clearToasts', () => {
        it('should clear all toasts', () => {
            const { result } = renderHook(() => useToast());

            act(() => {
                result.current.showToast({ title: 'Toast 1', description: 'Desc 1' });
                result.current.showToast({ title: 'Toast 2', description: 'Desc 2' });
            });

            expect(result.current.toasts).toHaveLength(2);

            act(() => {
                result.current.clearToasts();
            });

            expect(result.current.toasts).toHaveLength(0);
        });
    });
});