import { FC } from "react";
import { IconType } from "react-icons";
import { BiArrowBack } from "react-icons/bi";

export interface IIcons extends IconType {
    name: TIconNames;
}

export type TIconNames = "BiArrowBack";

const icons = {
    BiArrowBack,
};

const Icons: FC<IIcons> = ({ name }) => {
    const IconComponent = icons[name];
    if (!IconComponent) {
        console.error(`Icon ${name} not found`);
        return null;
    }

    return <IconComponent />;
};

export default Icons;
