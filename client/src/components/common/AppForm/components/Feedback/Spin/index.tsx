import { TSpin } from "@components/common/AppForm/components/type";
import { Spin as Spins } from "antd";
import { FC } from "react";

const Spin: FC<TSpin> = props => {
    return <Spins {...props} />;
};

export default Spin;
