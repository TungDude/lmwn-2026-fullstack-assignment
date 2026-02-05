import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ExpandableText from '../ExpandableText';

describe('ExpandableText', () => {
    const shortText = 'Short text';
    const longText = 'This is a very long text that exceeds the maximum length and should be truncated with ellipsis';
    const maxLength = 50;

    describe('short text (no expansion needed)', () => {
        it('should render full text when shorter than maxLength', () => {
            const setExpanded = vi.fn();
            render(
                <ExpandableText
                    text={shortText}
                    maxLength={maxLength}
                    isExpanded={false}
                    setExpanded={setExpanded}
                />
            );

            expect(screen.getByText(shortText)).toBeInTheDocument();
        });

        it('should not show expand button for short text', () => {
            const setExpanded = vi.fn();
            render(
                <ExpandableText
                    text={shortText}
                    maxLength={maxLength}
                    isExpanded={false}
                    setExpanded={setExpanded}
                />
            );

            expect(screen.queryByRole('button')).not.toBeInTheDocument();
        });
    });

    describe('long text (expansion needed)', () => {
        it('should truncate text when collapsed', () => {
            const setExpanded = vi.fn();
            render(
                <ExpandableText
                    text={longText}
                    maxLength={maxLength}
                    isExpanded={false}
                    setExpanded={setExpanded}
                />
            );

            const displayedText = screen.getByText(/This is a very long text/);
            expect(displayedText.textContent).toContain('...');
            expect(displayedText.textContent).not.toBe(longText);
        });

        it('should show full text when expanded', () => {
            const setExpanded = vi.fn();
            render(
                <ExpandableText
                    text={longText}
                    maxLength={maxLength}
                    isExpanded={true}
                    setExpanded={setExpanded}
                />
            );

            expect(screen.getByText(longText, { exact: false })).toBeInTheDocument();
        });

        it('should show "Show more" button when collapsed', () => {
            const setExpanded = vi.fn();
            render(
                <ExpandableText
                    text={longText}
                    maxLength={maxLength}
                    isExpanded={false}
                    setExpanded={setExpanded}
                />
            );

            expect(screen.getByRole('button', { name: /show more/i })).toBeInTheDocument();
        });

        it('should show "Show less" button when expanded', () => {
            const setExpanded = vi.fn();
            render(
                <ExpandableText
                    text={longText}
                    maxLength={maxLength}
                    isExpanded={true}
                    setExpanded={setExpanded}
                />
            );

            expect(screen.getByRole('button', { name: /show less/i })).toBeInTheDocument();
        });

        it('should call setExpanded when button is clicked', async () => {
            const user = userEvent.setup();
            const setExpanded = vi.fn();

            render(
                <ExpandableText
                    text={longText}
                    maxLength={maxLength}
                    isExpanded={false}
                    setExpanded={setExpanded}
                />
            );

            const button = screen.getByRole('button', { name: /show more/i });
            await user.click(button);

            expect(setExpanded).toHaveBeenCalledWith(true);
        });

        it('should call setExpanded with false when collapse button clicked', async () => {
            const user = userEvent.setup();
            const setExpanded = vi.fn();

            render(
                <ExpandableText
                    text={longText}
                    maxLength={maxLength}
                    isExpanded={true}
                    setExpanded={setExpanded}
                />
            );

            const button = screen.getByRole('button', { name: /show less/i });
            await user.click(button);

            expect(setExpanded).toHaveBeenCalledWith(false);
        });
    });

    describe('custom labels', () => {
        it('should use custom showLabel', () => {
            const setExpanded = vi.fn();
            render(
                <ExpandableText
                    text={longText}
                    maxLength={maxLength}
                    isExpanded={false}
                    setExpanded={setExpanded}
                    showLabel="Read more"
                />
            );

            expect(screen.getByRole('button', { name: /read more/i })).toBeInTheDocument();
        });

        it('should use custom hideLabel', () => {
            const setExpanded = vi.fn();
            render(
                <ExpandableText
                    text={longText}
                    maxLength={maxLength}
                    isExpanded={true}
                    setExpanded={setExpanded}
                    hideLabel="Collapse"
                />
            );

            expect(screen.getByRole('button', { name: /collapse/i })).toBeInTheDocument();
        });
    });

    describe('typography props', () => {
        it('should pass through typography props', () => {
            const setExpanded = vi.fn();
            render(
                <ExpandableText
                    text={shortText}
                    maxLength={maxLength}
                    isExpanded={false}
                    setExpanded={setExpanded}
                    color="primary"
                    variant="h6"
                />
            );

            const typography = screen.getByText(shortText);
            expect(typography).toHaveClass('MuiTypography-h6');
        });
    });

    describe('icons', () => {
        it('should show ChevronDown icon when collapsed', () => {
            const setExpanded = vi.fn();
            render(
                <ExpandableText
                    text={longText}
                    maxLength={maxLength}
                    isExpanded={false}
                    setExpanded={setExpanded}
                />
            );

            // lucide-react icons render as SVG
            const button = screen.getByRole('button');
            expect(button.querySelector('svg')).toBeInTheDocument();
        });

        it('should show ChevronUp icon when expanded', () => {
            const setExpanded = vi.fn();
            render(
                <ExpandableText
                    text={longText}
                    maxLength={maxLength}
                    isExpanded={true}
                    setExpanded={setExpanded}
                />
            );

            const button = screen.getByRole('button');
            expect(button.querySelector('svg')).toBeInTheDocument();
        });
    });
});