import React, { FC } from 'react';
import { useDynamicLeverage } from '@deriv/api';
import { WalletText } from '../../../../components/Base';
import { DynamicLeverageTableColumnHeader } from './DynamicLeverageTableColumnHeader';
import './DynamicLeverageMarketCard.scss';

type TDynamicLeverageMarketCardProps = NonNullable<
    Exclude<ReturnType<typeof useDynamicLeverage>['data'][0], 'undefined'>
>;

export const DynamicLeverageMarketCard: FC<TDynamicLeverageMarketCardProps> = ({
    data,
    description,
    leverage,
    title,
}) => (
    <div className='wallets-dynamic-leverage-modal__market'>
        <div className='wallets-dynamic-leverage-modal__market-title'>
            <WalletText align='center' data-testid='market_title' size='sm' weight='bold'>
                {title}
            </WalletText>
            {!!description && (
                <WalletText align='center' data-testid='description_title' size='2xs' style={{ fontStyle: 'italic' }}>
                    {description}
                </WalletText>
            )}
            <WalletText align='center' color='error' data-testid='leverage_title' size='xs'>
                {leverage}
            </WalletText>
        </div>
        <div className='wallets-dynamic-leverage-modal__market-table'>
            <div className='wallets-dynamic-leverage-modal__market-table-header-row'>
                <DynamicLeverageTableColumnHeader subtitle='(lots)' title='From' />
                <DynamicLeverageTableColumnHeader subtitle='(lots)' title='to' />
                <DynamicLeverageTableColumnHeader subtitle='(1:x)' title='Leverage' />
            </div>
            <div>
                {data?.map(columns => (
                    <div
                        className='wallets-dynamic-leverage-modal__market-table-row'
                        key={`${columns.from}-${columns.to}-${columns.leverage}`}
                    >
                        {Object.entries(columns).map(([columnKey, value]) => (
                            <div key={`${title}_${columnKey}_${value}`}>
                                <WalletText align='center' size='sm'>
                                    {value}
                                </WalletText>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    </div>
);
