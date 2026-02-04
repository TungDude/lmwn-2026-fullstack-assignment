import { type Components, type Theme } from '@mui/material/styles';
import type { CardProps as MuiCardProps } from '@mui/material/Card';

declare module '@mui/material/Card' {
    interface CardOwnProps {
        shadow?: boolean;
    }
}

export const cardTheme: Components<Theme>['MuiCard'] = {
    styleOverrides: {
        root: ({ theme, ownerState }) => {
            const cardProps = ownerState as MuiCardProps & { shadow?: boolean };

            return {
                borderRadius: 8,
                border: `1px solid ${theme.palette.border.main}`,
                boxShadow: cardProps.shadow
                    ? '-2px 2px 7px 1px #0F0F0F26'
                    : 'none',
                transition: 'box-shadow 0.3s ease',
                '&:hover': {
                    boxShadow: cardProps.shadow
                        ? '-2px 2px 7px 1px #0F0F0F40'
                        : 'none',
                },
            };
        },
    },
};