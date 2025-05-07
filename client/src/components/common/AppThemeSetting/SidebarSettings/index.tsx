import { CheckOutlined } from "@ant-design/icons";

import { useSidebarActionsContext, useSidebarContext } from "@lib/context/AppContextProvider/SidebarContextProvider";
import IntlMessages from "@lib/utils/IntlMessages";
import Image from "next/image";
import {
    StyledCustomizedItem,
    StyledCustomizedSwitch,
    StyledCustomizedSwitchView,
    StyledCustomizeNavOption,
    StyledCustomizeNavOptionContent,
    StyledCustomizeNavOptionItem,
    StyledCustomizeNavOptionRightIcon,
} from "../index.styled";
import { StyledSidebarSettings } from "./index.styled";
import NavMenuStyle from "./NavMenuStyle";

const SidebarSettings = () => {
    const { sidebarBgImageId, allowSidebarBgImage } = useSidebarContext();

    const { updateSidebarBgImage, setSidebarBgImage } = useSidebarActionsContext();

    const onToggleSidebarImage = () => {
        setSidebarBgImage(!allowSidebarBgImage);
    };
    const onUpdateSidebarBgImage = (image: number | string) => {
        updateSidebarBgImage(image);
    };

    return (
        <StyledSidebarSettings>
            <NavMenuStyle />
            <StyledCustomizedItem>
                <StyledCustomizedSwitchView>
                    <h4>
                        <IntlMessages id="customizer.sidebarImage" />
                    </h4>
                    <StyledCustomizedSwitch checked={allowSidebarBgImage} onChange={onToggleSidebarImage} />
                </StyledCustomizedSwitchView>

                {allowSidebarBgImage ? (
                    <StyledCustomizeNavOption style={{ marginTop: 20 }}>
                        {sidebarBgImages.map(imagesObj => {
                            return (
                                <StyledCustomizeNavOptionItem key={imagesObj.id}>
                                    <StyledCustomizeNavOptionContent
                                        onClick={() => onUpdateSidebarBgImage(imagesObj.id)}
                                    >
                                        <Image alt="nav" height={80} src={`${imagesObj.image}`} width={40} />
                                        {sidebarBgImageId === imagesObj.id ? (
                                            <StyledCustomizeNavOptionRightIcon>
                                                <CheckOutlined />
                                            </StyledCustomizeNavOptionRightIcon>
                                        ) : null}
                                    </StyledCustomizeNavOptionContent>
                                </StyledCustomizeNavOptionItem>
                            );
                        })}
                    </StyledCustomizeNavOption>
                ) : null}
            </StyledCustomizedItem>
        </StyledSidebarSettings>
    );
};

export default SidebarSettings;
