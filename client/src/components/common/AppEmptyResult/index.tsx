import IntlMessages from "@lib/utils/IntlMessages";
import React from "react";
import { StyledEmptyResult, StyledEmptyResultBtn, StyledParaText, StyledTitle } from "./index.styled";

type AppEmptyResultProps = {
    title?: string;
    onAction: () => void;
    description?: string;
    actionTitle: string;
};

const AppEmptyResult: React.FC<AppEmptyResultProps> = ({
    title = <IntlMessages id="common.noRecordFound" />,
    description = "",
    actionTitle,
    onAction,
}) => {
    return (
        <StyledEmptyResult>
            <StyledTitle level={4}>{title}</StyledTitle>
            {description ? <StyledParaText>{description}</StyledParaText> : null}
            {actionTitle ? <StyledEmptyResultBtn onClick={onAction}>{actionTitle}</StyledEmptyResultBtn> : null}
        </StyledEmptyResult>
    );
};

export default AppEmptyResult;
