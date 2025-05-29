import { TTimeline } from "@components/common/AppForm/components/type";
import { Timeline as Timelines } from "antd";
import { FC } from "react";

const Timeline: FC<TTimeline> = props => {
    return <Timelines {...props} />;
};

export default Timeline;
