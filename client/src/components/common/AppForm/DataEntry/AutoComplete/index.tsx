import { AutoCompleteProps, AutoComplete as AutoCompletes } from "antd";
import { FC } from "react";
import { DataEntryFieldTypes } from "../types";
export interface IAutoComplete {
    ctype: typeof DataEntryFieldTypes.AUTO_COMPLETE;
    props: AutoCompleteProps;
}

const AutoComplete: FC<IAutoComplete> = ({ props }) => {
    return <AutoCompletes {...props} />;
};

export default AutoComplete;
