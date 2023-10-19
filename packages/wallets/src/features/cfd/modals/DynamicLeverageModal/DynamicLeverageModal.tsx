import React from 'react';
import { useDynamicLeverage } from '@deriv/api';
import { ModalWrapper, WalletText } from '../../../../components/Base';
import { useModal } from '../../../../components/ModalProvider';
import useDevice from '../../../../hooks/useDevice';
import BackArrow from '../../../../public/images/ic-back-arrow.svg';
import { JurisdictionModal } from '../JurisdictionModal';
import { DynamicLeverageMarketCard } from './DynamicLeverageMarketCard';
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
                            show(<JurisdictionModal />);
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
