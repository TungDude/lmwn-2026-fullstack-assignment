import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useToastStore } from '../toast-store';

describe('useToastStore', () => {
    beforeEach(() => {
        useToastStore.setState({ toasts: [] });
        vi.clearAllMocks();
    });

    describe('addToast', () => {
        it('should add a toast with generated id', () => {
            const { addToast } = useToastStore.getState();

            const id = addToast({
                title: 'Success',
                description: 'Operation completed',
                severity: 'success',
            });

            const state = useToastStore.getState();

            expect(state.toasts).toHaveLength(1);
            expect(state.toasts[0]).toEqual({
                id,
                title: 'Success',
                description: 'Operation completed',
                severity: 'success',
            });
            expect(id).toBeTruthy();
        });

        it('should add multiple toasts', () => {
            const { addToast } = useToastStore.getState();

            addToast({ title: 'Toast 1', description: 'Desc 1' });
            addToast({ title: 'Toast 2', description: 'Desc 2' });

            const state = useToastStore.getState();

            expect(state.toasts).toHaveLength(2);
            expect(state.toasts[0].title).toBe('Toast 1');
            expect(state.toasts[1].title).toBe('Toast 2');
        });

        it('should generate unique ids', () => {
            const { addToast } = useToastStore.getState();

            const id1 = addToast({ title: 'Toast 1', description: 'Desc 1' });
            const id2 = addToast({ title: 'Toast 2', description: 'Desc 2' });

            expect(id1).not.toBe(id2);
        });
    });

    describe('removeToast', () => {
        it('should remove toast by id', () => {
            const { addToast, removeToast } = useToastStore.getState();

            const id = addToast({ title: 'Test', description: 'Test desc' });

            expect(useToastStore.getState().toasts).toHaveLength(1);

            removeToast(id);

            expect(useToastStore.getState().toasts).toHaveLength(0);
        });

        it('should only remove specified toast', () => {
            const { addToast, removeToast } = useToastStore.getState();

            const id1 = addToast({ title: 'Toast 1', description: 'Desc 1' });
            const id2 = addToast({ title: 'Toast 2', description: 'Desc 2' });

            removeToast(id1);

            const state = useToastStore.getState();
            expect(state.toasts).toHaveLength(1);
            expect(state.toasts[0].id).toBe(id2);
        });

        it('should handle removing non-existent toast', () => {
            const { addToast, removeToast } = useToastStore.getState();

            addToast({ title: 'Test', description: 'Test desc' });

            removeToast('non-existent-id');

            expect(useToastStore.getState().toasts).toHaveLength(1);
        });
    });

    describe('clearToasts', () => {
        it('should clear all toasts', () => {
            const { addToast, clearToasts } = useToastStore.getState();

            addToast({ title: 'Toast 1', description: 'Desc 1' });
            addToast({ title: 'Toast 2', description: 'Desc 2' });

            expect(useToastStore.getState().toasts).toHaveLength(2);

            clearToasts();

            expect(useToastStore.getState().toasts).toHaveLength(0);
        });

        it('should handle clearing empty toasts', () => {
            const { clearToasts } = useToastStore.getState();

            clearToasts();

            expect(useToastStore.getState().toasts).toHaveLength(0);
        });
    });
});