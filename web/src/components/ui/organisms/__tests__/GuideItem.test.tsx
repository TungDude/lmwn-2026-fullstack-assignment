import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GuideItem from '../GuideItem';
import { createGuideItemWithRestaurant } from '@shared/packages/tests';
import { renderWithTheme } from '@/tests/render';

vi.mock('@/hooks/useResponsive', () => ({
    default: () => ({
        isMobile: false,
        isSmallScreen: false,
        isTablet: false,
    }),
}));

const mockShowToast = vi.fn();

vi.mock('@/hooks/useToast', () => ({
    useToast: () => ({
        showToast: mockShowToast,
    }),
}));

vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

describe('GuideItem', () => {
    const mockGuideItem = createGuideItemWithRestaurant({
        restaurant: {
            id: "rest-1",
            name: 'Test Restaurant',
            categories: ['Thai', 'Street Food'],
            rating: 4.5,
            numberOfReviews: 100,
            phoneNo: '02-123-4567',
            address: '123 Test St, Bangkok',
            workingHours: [
                { day: 1, open: '09:00', close: '17:00' }, // Mon
                { day: 2, open: '09:00', close: '17:00' }, // Tue
                { day: 3, open: '09:00', close: '17:00' }, // Wed
                { day: 6, open: '10:00', close: '15:00' }, // Sat
                { day: 7, open: '10:00', close: '15:00' }, // Sun
            ],
        },
    });

    beforeEach(() => {
        vi.clearAllMocks();
        mockShowToast.mockClear();
    });

    describe('basic rendering', () => {
        it('should render restaurant name', () => {
            renderWithTheme(<GuideItem guideItem={mockGuideItem} />);

            expect(screen.getByText('Test Restaurant')).toBeInTheDocument();
        });

        it('should render categories as tags', () => {
            renderWithTheme(<GuideItem guideItem={mockGuideItem} />);

            expect(screen.getByText('Thai')).toBeInTheDocument();
            expect(screen.getByText('Street Food')).toBeInTheDocument();
        });

        it('should render rating', () => {
            renderWithTheme(<GuideItem guideItem={mockGuideItem} />);

            expect(screen.getByText('4.5 (100)')).toBeInTheDocument();
        });

        it('should render description', () => {
            const guideWithDesc = createGuideItemWithRestaurant({
                description: 'Amazing food and great atmosphere',
            });

            renderWithTheme(<GuideItem guideItem={guideWithDesc} />);

            expect(screen.getByText('Amazing food and great atmosphere')).toBeInTheDocument();
        });
    });

    describe('working hours aggregation', () => {
        it('should aggregate consecutive days with same hours', () => {
            renderWithTheme(<GuideItem guideItem={mockGuideItem} />);

            // Mon-Wed should be aggregated
            expect(screen.getByText(/weekDay.monday.*weekDay.wednesday/)).toBeInTheDocument();
            expect(screen.getByText('09:00 - 17:00')).toBeInTheDocument();

            // Sat-Sun should be aggregated
            expect(screen.getByText(/weekDay.saturday.*weekDay.sunday/)).toBeInTheDocument();
            expect(screen.getByText('10:00 - 15:00')).toBeInTheDocument();
        });

        it('should show single day when not consecutive', () => {
            const guideWithSingleDay = createGuideItemWithRestaurant({
                restaurant: {
                    workingHours: [
                        { day: 1, open: '09:00', close: '17:00' },
                    ],
                },
            });

            renderWithTheme(<GuideItem guideItem={guideWithSingleDay} />);

            expect(screen.getByText('weekDay.monday')).toBeInTheDocument();
            expect(screen.getByText('09:00 - 17:00')).toBeInTheDocument();
        });

        it('should handle no working hours', () => {
            const guideNoHours = createGuideItemWithRestaurant({
                restaurant: {
                    workingHours: [],
                },
            });

            renderWithTheme(<GuideItem guideItem={guideNoHours} />);

            expect(screen.queryByText('workingHours')).not.toBeInTheDocument();
        });
    });

    describe('contact information', () => {
        it('should render phone number', () => {
            renderWithTheme(<GuideItem guideItem={mockGuideItem} />);

            expect(screen.getByText('02-123-4567')).toBeInTheDocument();
        });

        it('should render address', () => {
            renderWithTheme(<GuideItem guideItem={mockGuideItem} />);

            expect(screen.getByText('123 Test St, Bangkok')).toBeInTheDocument();
        });

        it('should render empty state contact section when no data', () => {
            const guideNoContact = createGuideItemWithRestaurant({
                restaurant: {
                    phoneNo: undefined,
                    address: undefined,
                },
            });

            renderWithTheme(<GuideItem guideItem={guideNoContact} />);

            expect(screen.getByText('missingContactInfo')).toBeInTheDocument();
        });
    });

    describe('social media links', () => {
        it('should render Line link when available', () => {
            const guideWithLine = createGuideItemWithRestaurant({
                restaurant: {
                    line: 'testrestaurant',
                },
            });

            renderWithTheme(<GuideItem guideItem={guideWithLine} />);

            expect(screen.getByText('testrestaurant')).toBeInTheDocument();
        });

        it('should render Instagram link when available', () => {
            const guideWithIG = createGuideItemWithRestaurant({
                restaurant: {
                    instagram: '@testrestaurant',
                },
            });

            renderWithTheme(<GuideItem guideItem={guideWithIG} />);

            expect(screen.getByText('@testrestaurant')).toBeInTheDocument();
        });

        it('should not render social section when no social media', () => {
            const guideNoSocial = createGuideItemWithRestaurant({
                restaurant: {
                    line: undefined,
                    instagram: undefined,
                    facebook: undefined,
                    url: undefined,
                },
            });

            renderWithTheme(<GuideItem guideItem={guideNoSocial} />);

            expect(screen.queryByText('socialMedia')).not.toBeInTheDocument();
        });
    });

    describe('user interactions', () => {
        it('should call onImageClick when image is clicked', async () => {
            const user = userEvent.setup();
            const mockOnImageClick = vi.fn();
            const guideWithImages = createGuideItemWithRestaurant({
                photos: [
                    { id: '1', smallUrl: '/img1.jpg', largeUrl: '/img1-lg.jpg' },
                    { id: '2', smallUrl: '/img2.jpg', largeUrl: '/img2-lg.jpg' },
                ],
            });

            renderWithTheme(
                <GuideItem
                    guideItem={guideWithImages}
                    onImageClick={mockOnImageClick}
                />
            );

            const images = screen.getAllByRole('img');
            await user.click(images[0]);

            expect(mockOnImageClick).toHaveBeenCalledWith(0);
        });

        it('should open phone dialer when phone is clicked', async () => {
            const user = userEvent.setup();
            const hrefSpy = vi.spyOn(globalThis.location, 'href', 'set');

            renderWithTheme(<GuideItem guideItem={mockGuideItem} />);

            const phoneLink = screen.getByText('02-123-4567');
            await user.click(phoneLink);

            expect(hrefSpy).toHaveBeenCalledWith('tel:02-123-4567');
        });
    });

    describe('share functionality', () => {
        it('should use navigator.share when available', async () => {
            const user = userEvent.setup();
            const mockShare = vi.fn().mockResolvedValue(undefined);
            Object.defineProperty(globalThis.navigator, 'share', {
                value: mockShare,
                writable: true,
            });

            renderWithTheme(<GuideItem guideItem={mockGuideItem} />);

            const shareButton = screen.getByLabelText('share');
            await user.click(shareButton);

            expect(mockShare).toHaveBeenCalledWith(
                expect.objectContaining({
                    title: 'Test Restaurant',
                })
            );
        });

        it('should show toast when share is not supported', async () => {
            const user = userEvent.setup();;

            Object.defineProperty(globalThis.navigator, 'share', {
                value: undefined,
                writable: true,
            });

            renderWithTheme(<GuideItem guideItem={mockGuideItem} />);

            const shareButton = screen.getByLabelText('share');
            await user.click(shareButton);

            expect(mockShowToast).toHaveBeenCalledWith(
                expect.objectContaining({
                    severity: 'warning',
                })
            );
        });
    });

    describe('edge cases', () => {
        it('should show empty state when restaurant is missing', () => {
            const guideNoRestaurant = createGuideItemWithRestaurant({
                restaurant: null,
            });

            renderWithTheme(<GuideItem guideItem={guideNoRestaurant} />);

            expect(screen.getByText('missingRestaurantData')).toBeInTheDocument();
        });

        it('should render branch when available', () => {
            const guideWithBranch = createGuideItemWithRestaurant({
                restaurant: {
                    name: 'Test Restaurant',
                    branch: 'Central World',
                },
            });

            renderWithTheme(<GuideItem guideItem={guideWithBranch} />);

            expect(screen.getByText(/branch.*Central World/)).toBeInTheDocument();
        });
    });
});