import React, { FC } from 'react';
import Render from './Render';
import { TQuickUIProps } from './Types';

export interface IRenderComponents {
    components: TQuickUIProps[];
}

const RenderComponents: FC<IRenderComponents> = ({ components }) => {
    return <Render components={components} />;
};

export default RenderComponents;
