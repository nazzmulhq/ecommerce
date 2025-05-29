import { TTour } from "@components/common/AppForm/components/type";
import { Tour as Tours } from "antd";
import { FC } from "react";

const Tour: FC<TTour> = props => {
    return <Tours {...props} />;
};

export default Tour;
