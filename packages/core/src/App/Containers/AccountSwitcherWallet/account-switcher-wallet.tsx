import React from 'react';
import { useHistory } from 'react-router';
import { Button, Text, ThemedScrollbars, useOnClickOutside } from '@deriv/components';
// import { useWalletAccountsList } from '@deriv/hooks';
import { routes } from '@deriv/shared';
import { Localize, localize } from '@deriv/translations';
import { AccountSwitcherWalletItem } from './account-switcher-wallet-item';
import './account-switcher-wallet.scss';
import { observer, useStore } from '@deriv/stores';

type TAccountSwitcherWalletProps = {
    is_visible: boolean;
    toggle: (value: boolean) => void;
};

export const AccountSwitcherWallet = observer(({ is_visible, toggle }: TAccountSwitcherWalletProps) => {
    const { client } = useStore();
    const { wallet_list } = client;
    const dtrade_account_wallets = wallet_list?.filter(wallet => wallet.dtrade_loginid);

    const history = useHistory();

    const wrapper_ref = React.useRef<HTMLDivElement>(null);

    const validateClickOutside = (event: MouseEvent) =>
        is_visible && !(event.target as unknown as HTMLElement).classList.contains('acc-info');

    const closeAccountsDialog = React.useCallback(() => {
        toggle(false);
    }, [toggle]);

    useOnClickOutside(wrapper_ref, closeAccountsDialog, validateClickOutside);

    const handleTradersHubRedirect = async () => {
        closeAccountsDialog();
        history.push(routes.wallets);
    };

    return (
        <div className='account-switcher-wallet' ref={wrapper_ref}>
            <div className='account-switcher-wallet__header'>
                <Text as='h4' weight='bold' size='xs'>
                    <Localize i18n_default_text='Deriv Apps accounts' />
                </Text>
            </div>
            <ThemedScrollbars height={450}>
                <div className='account-switcher-wallet__list'>
                    {dtrade_account_wallets?.map(account => {
                        const show_badge = account?.is_malta_wallet || account?.is_virtual;

                        return (
                            <AccountSwitcherWalletItem
                                key={account.dtrade_loginid}
                                account={account}
                                closeAccountsDialog={closeAccountsDialog}
                                show_badge={show_badge}
                            />
                        );
                    })}
                </div>
            </ThemedScrollbars>
            <Button
                className='account-switcher-wallet__button'
                has_effect
                text={localize('Looking for CFDs? Go to Trader’s hub')}
                onClick={handleTradersHubRedirect}
                secondary
                small
            />
        </div>
    );
});
