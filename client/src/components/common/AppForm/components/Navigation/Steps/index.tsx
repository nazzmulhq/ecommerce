import { TSteps } from "@components/common/AppForm/components/type";
import { Steps as StepsAntd } from "antd";
import { FC } from "react";

const Steps: FC<TSteps> = props => {
    return <StepsAntd {...props} />;
};

export default Steps;
