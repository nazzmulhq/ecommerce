import { TResult } from "@components/common/AppForm/components/type";
import { Result as Results } from "antd";
import { FC } from "react";
import { renderComponent } from "../../Render";

const Result: FC<TResult> = props => {
    const { children, extra, ...rest } = props;

    if (children && extra) {
        return (
            <Results {...rest} extra={renderComponent(extra)}>
                {renderComponent(children)}
            </Results>
        );
    }

    if (children) {
        return <Results {...rest}>{renderComponent(children)}</Results>;
    }

    if (extra) {
        return <Results {...rest} extra={renderComponent(extra)} />;
    }

    return <Results {...rest} />;
};

export default Result;
