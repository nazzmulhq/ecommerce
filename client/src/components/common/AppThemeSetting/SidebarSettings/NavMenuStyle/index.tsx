import Image from "next/image";

import AppSelectedIcon from "@components/common/AppSelectedIcon";
import { useSidebarActionsContext, useSidebarContext } from "@lib/context/AppContextProvider/SidebarContextProvider";
import IntlMessages from "@lib/utils/IntlMessages";
import { StyledCustomizedItem } from "../../index.styled";
import { StyledNavMenu, StyledNavMenuItem, StyledNavMenuItemCur } from "./index.styled";

const NavMenuStyle = () => {
    const { menuStyle } = useSidebarContext();
    const { updateMenuStyle } = useSidebarActionsContext();
    const onMenuStyleChange = (menuStyle: string) => {
        updateMenuStyle(menuStyle);
    };

    return (
        <StyledCustomizedItem>
            <h3>
                <IntlMessages id="customizer.sidebarSettings" />
            </h3>
            <StyledCustomizedItem>
                <h4>
                    <IntlMessages id="customizer.menuStyle" />
                </h4>
                <StyledNavMenu style={{}}>
                    {menuStyles.map(menu => {
                        return (
                            <StyledNavMenuItem key={menu.id} style={{}}>
                                <StyledNavMenuItemCur onClick={() => onMenuStyleChange(menu.alias)}>
                                    <Image alt="nav" height={86} src={`${menu.image}`} width={62} />
                                    {menuStyle === menu.alias ? <AppSelectedIcon /> : null}
                                </StyledNavMenuItemCur>
                            </StyledNavMenuItem>
                        );
                    })}
                </StyledNavMenu>
            </StyledCustomizedItem>
        </StyledCustomizedItem>
    );
};

export default NavMenuStyle;
