import { RateProps, Rate as Rates } from 'antd';
import React, { FC } from 'react';
import { RATE } from '../../Types';

export interface IRate {
    ctype: typeof RATE;
    props: RateProps;
}

const Rate: FC<IRate> = ({ props }) => {
    return <Rates {...props} />;
};

export default Rate;
