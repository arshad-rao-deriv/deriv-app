import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { mockStore } from '@deriv/stores';
import { CFDDemoAccountDisplay } from '../cfd-demo-account-display';
import CFDProviders from '../../cfd-providers';

const mock_connect_props = {
    modules: {
        cfd: {
            dxtrade_tokens: {
                demo: '',
                real: '',
            },
            setMT5TradeAccount: jest.fn(),
        },
    },
    client: {
        isEligibleForMoreDemoMt5Svg: () => true,
    },
} as const;

describe('<CFDDemoAccountDisplay />', () => {
    const TESTED_CASES = {
        EU: 'eu',
        LOADING: 'loading',
        NON_EU_DMT5: 'non_eu_dmt5',
        NON_EU_DXTRADE: 'non_eu_dxtrade',
    } as const;

    let props: React.ComponentProps<typeof CFDDemoAccountDisplay>;

    beforeEach(() => {
        props = {
            current_list: {},
            has_cfd_account_error: false,
            has_maltainvest_account: false,
            is_eu: false,
            is_eu_country: false, // depends on client IP address
            is_loading: false,
            is_logged_in: true,
            isSyntheticCardVisible: jest.fn(() => true),
            isFinancialCardVisible: jest.fn(() => true),
            onSelectAccount: jest.fn(),
            openAccountNeededModal: jest.fn(),
            openAccountTransfer: jest.fn(),
            openPasswordManager: jest.fn(),
            platform: 'mt5',
            residence: 'id',
            standpoint: {
                financial_company: 'svg',
                gaming_company: 'svg',
                iom: false,
                malta: false,
                maltainvest: false,
                svg: true,
            },
        };
    });

    type TESTED_CASES_VALUES = typeof TESTED_CASES[keyof typeof TESTED_CASES];

    const checkAccountCardsRendering = (tested_case: TESTED_CASES_VALUES) => {
        const component_testid = 'dt_cfd_demo_accounts_display';
        const first_account_card = 'Derived';
        const second_account_card = {
            eu: 'CFDs',
            non_eu: 'Financial',
        };

        if (tested_case === TESTED_CASES.LOADING) {
            expect(screen.queryByTestId(component_testid)).not.toBeInTheDocument();
            expect(screen.queryByText(first_account_card)).not.toBeInTheDocument();
            expect(screen.queryByText(second_account_card.eu)).not.toBeInTheDocument();
            expect(screen.queryByText(second_account_card.non_eu)).not.toBeInTheDocument();
        } else {
            expect(screen.getByTestId(component_testid)).toBeInTheDocument();
        }

        if (tested_case === TESTED_CASES.EU) {
            expect(screen.queryByText(first_account_card)).not.toBeInTheDocument();
            expect(screen.getByText(second_account_card.eu)).toBeInTheDocument();
            expect(screen.queryByText(second_account_card.non_eu)).not.toBeInTheDocument();
        } else if (tested_case === TESTED_CASES.NON_EU_DMT5 || tested_case === TESTED_CASES.NON_EU_DXTRADE) {
            expect(screen.getByText(first_account_card)).toBeInTheDocument();
            expect(screen.getByText(second_account_card.non_eu)).toBeInTheDocument();
        }
    };

    it('should render Derived & Financial cards with enabled buttons on Deriv MT5 when non-EU, non-IoM, is_logged_in=true & has_maltainvest_account=false', () => {
        render(<CFDDemoAccountDisplay {...props} />, {
            wrapper: ({ children }) => <CFDProviders store={mockStore(mock_connect_props)}>{children}</CFDProviders>,
        });

        checkAccountCardsRendering(TESTED_CASES.NON_EU_DMT5);
        const add_demo_account_buttons = screen.getAllByRole('button', { name: /add demo account/i });
        expect(add_demo_account_buttons).toHaveLength(2);

        fireEvent.click(add_demo_account_buttons[0]);
        expect(props.onSelectAccount).toHaveBeenCalledWith({ type: 'synthetic', category: 'demo', platform: 'mt5' });

        fireEvent.click(add_demo_account_buttons[1]);
        expect(props.onSelectAccount).toHaveBeenCalledWith({ type: 'financial', category: 'demo', platform: 'mt5' });
    });

    it('should render Derived & Financial cards without "Add demo account" buttons on Deriv MT5 when is_logged_in=false & is_eu_country=false', () => {
        render(<CFDDemoAccountDisplay {...props} is_logged_in={false} />, {
            wrapper: ({ children }) => <CFDProviders store={mockStore(mock_connect_props)}>{children}</CFDProviders>,
        });

        checkAccountCardsRendering(TESTED_CASES.NON_EU_DMT5);
        expect(screen.queryByRole('button', { name: /add demo account/i })).not.toBeInTheDocument();
    });

    it('should render a CFDs card only with enabled "Add demo account" button on Deriv MT5 when EU, is_logged_in=true, standpoint.iom=true & has_maltainvest_account=false', () => {
        props.standpoint.iom = true;
        props.isSyntheticCardVisible = jest.fn(() => false);
        render(<CFDDemoAccountDisplay {...props} is_eu />, {
            wrapper: ({ children }) => <CFDProviders store={mockStore(mock_connect_props)}>{children}</CFDProviders>,
        });

        checkAccountCardsRendering(TESTED_CASES.EU);
        const add_demo_account_button = screen.getByRole('button', { name: /add demo account/i });
        expect(add_demo_account_button).toBeEnabled();

        fireEvent.click(add_demo_account_button);
        expect(props.openAccountNeededModal).toHaveBeenCalledWith('maltainvest', 'Deriv Multipliers', 'demo CFDs');
    });

    it('should render a CFDs card only without "Add demo account" button on Deriv MT5 when is_logged_in=false & is_eu_country=true (also when redirected from Deriv X platform)', () => {
        props.isSyntheticCardVisible = jest.fn(() => false);
        render(<CFDDemoAccountDisplay {...props} is_logged_in={false} is_eu_country />, {
            wrapper: ({ children }) => <CFDProviders store={mockStore(mock_connect_props)}>{children}</CFDProviders>,
        });

        checkAccountCardsRendering(TESTED_CASES.EU);
        expect(screen.queryByRole('button', { name: /add demo account/i })).not.toBeInTheDocument();
    });

    it('should render Derived & Financial cards with enabled buttons on Deriv X when is_logged_in=true & is_eu=false', () => {
        render(<CFDDemoAccountDisplay {...props} platform='dxtrade' />, {
            wrapper: ({ children }) => <CFDProviders store={mockStore(mock_connect_props)}>{children}</CFDProviders>,
        });

        checkAccountCardsRendering(TESTED_CASES.NON_EU_DXTRADE);
        const add_demo_account_buttons = screen.getAllByRole('button', { name: /add demo account/i });
        expect(add_demo_account_buttons).toHaveLength(2);

        fireEvent.click(add_demo_account_buttons[0]);
        expect(props.onSelectAccount).toHaveBeenCalledWith({
            type: 'synthetic',
            category: 'demo',
            platform: 'dxtrade',
        });

        fireEvent.click(add_demo_account_buttons[1]);
        expect(props.onSelectAccount).toHaveBeenCalledWith({
            type: 'financial',
            category: 'demo',
            platform: 'dxtrade',
        });
    });

    it('should render Derived & Financial cards without "Add demo account" buttons on Deriv X when is_logged_in=false & is_eu_country=false', () => {
        render(<CFDDemoAccountDisplay {...props} is_logged_in={false} platform='dxtrade' />, {
            wrapper: ({ children }) => <CFDProviders store={mockStore(mock_connect_props)}>{children}</CFDProviders>,
        });

        checkAccountCardsRendering(TESTED_CASES.NON_EU_DXTRADE);
        expect(screen.queryByRole('button', { name: /add demo account/i })).not.toBeInTheDocument();
    });

    it('should disable all "Add demo account" buttons when has_cfd_account_error=true', () => {
        render(<CFDDemoAccountDisplay {...props} has_cfd_account_error />, {
            wrapper: ({ children }) => <CFDProviders store={mockStore(mock_connect_props)}>{children}</CFDProviders>,
        });

        checkAccountCardsRendering(TESTED_CASES.NON_EU_DMT5);
        const add_demo_account_buttons = screen.getAllByRole('button', { name: /add demo account/i });
        expect(add_demo_account_buttons[0]).toBeDisabled();
        expect(add_demo_account_buttons[1]).toBeDisabled();
    });

    it('should show loading when is_loading=true', () => {
        render(<CFDDemoAccountDisplay {...props} is_loading />, {
            wrapper: ({ children }) => <CFDProviders store={mockStore(mock_connect_props)}>{children}</CFDProviders>,
        });

        expect(screen.getByTestId('dt_barspinner')).toBeInTheDocument();
        checkAccountCardsRendering(TESTED_CASES.LOADING);
    });
});
