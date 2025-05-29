import { TProgress } from "@components/common/AppForm/components/type";
import { Progress as Progresss } from "antd";
import { FC } from "react";

const Progress: FC<TProgress> = props => {
    return <Progresss {...props} />;
};

export default Progress;
