import React from 'react';
import { useDynamicLeverage } from '@deriv/api';
import { ModalTransition, ModalWrapper, WalletText } from '../../../../components';
import { useModal } from '../../../../components/ModalProvider';
import useDevice from '../../../../hooks/useDevice';
import BackArrow from '../../../../public/images/ic-back-arrow.svg';
import { DynamicLeverageMarketCard } from '../../screens/DynamicLeverage/DynamicLeverageMarketCard';
import { JurisdictionModal } from '../JurisdictionModal';
import './DynamicLeverageModal.scss';

const DynamicLeverageModal = () => {
    const { data: dynamicLeverages } = useDynamicLeverage();
    const { isMobile } = useDevice();
    const { setModalState, show } = useModal();

    return (
        <ModalWrapper hideCloseButton>
            <div className='wallets-dynamic-leverage-modal'>
                <div className='wallets-dynamic-leverage-modal__title'>
                    <BackArrow
                        className='wallets-dynamic-leverage-modal__title-back'
                        data-testid='back_icon'
                        onClick={() => {
                            setModalState({
                                marketType: 'financial',
                            });
                            show(
                                <ModalTransition
                                    className='wallets-jurisdiction-modal-transition'
                                    key='wallets-jurisdiction-modal-transition'
                                >
                                    <JurisdictionModal />
                                </ModalTransition>
                            );
                        }}
                    />
                    <WalletText color='prominent' size={isMobile ? 'xs' : 'sm'} weight='bold'>
                        Get more out of Deriv MT5 Financial
                    </WalletText>
                </div>
                <div className='wallets-dynamic-leverage-modal__container'>
                    <WalletText size='sm'>
                        Enjoy dynamic leverage of <strong>up to 1:1500</strong> when trading selected instruments in the
                        forex, commodities, cryptocurrencies, and stock indices markets. Our dynamic leverage adjusts
                        automatically to your trading position, based on asset type and trading volume.
                    </WalletText>
                    <div className='wallets-dynamic-leverage-modal__content'>
                        {dynamicLeverages.map(market => (
                            <DynamicLeverageMarketCard
                                data={market.data}
                                description={market.description}
                                key={`dynamic-leverage-modal__${market.key}`}
                                leverage={market.leverage}
                                title={market.title}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </ModalWrapper>
    );
};
export default DynamicLeverageModal;