import MessageItem from "./MessageItem";

import { messages } from "@lib/fakedb";
import IntlMessages from "@lib/utils/IntlMessages";
import { Dropdown, List } from "antd";
import { AiOutlineMail } from "react-icons/ai";
import {
    DropDownWrapper,
    StyledAppScrollbar,
    StyledHeaderMsgBtn,
    StyledHeaderMsgIcon,
    StyledHeaderMsgLink,
    StyledHeaderMsgLinkText,
} from "./index.styled";

const items = [
    {
        key: 1,
        label: (
            <div className="header">
                <IntlMessages id="dashboard.messages" />({messages.length})
            </div>
        ),
    },
    {
        key: 2,
        label: (
            <StyledAppScrollbar>
                <List
                    dataSource={messages}
                    renderItem={item => {
                        return <MessageItem item={item} key={item.id} />;
                    }}
                />
            </StyledAppScrollbar>
        ),
    },
    {
        key: 3,
        label: (
            <StyledHeaderMsgBtn type="primary">
                <IntlMessages id="common.viewAll" />
            </StyledHeaderMsgBtn>
        ),
    },
];
const AppHeaderMessages = () => {
    return (
        <DropDownWrapper>
            <Dropdown
                getPopupContainer={triggerNode => triggerNode}
                menu={{ items }}
                overlayClassName="header-messages"
                trigger={["click"]}
            >
                <StyledHeaderMsgLink onClick={e => e.preventDefault()}>
                    <StyledHeaderMsgIcon>
                        <AiOutlineMail />
                    </StyledHeaderMsgIcon>
                    <StyledHeaderMsgLinkText>
                        <IntlMessages id="dashboard.messages" />
                    </StyledHeaderMsgLinkText>
                </StyledHeaderMsgLink>
            </Dropdown>
        </DropDownWrapper>
    );
};

export default AppHeaderMessages;
