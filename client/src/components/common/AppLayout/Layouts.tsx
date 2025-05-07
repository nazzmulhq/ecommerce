import BitBucket from "./BitBucket";
import DrawerLayout from "./DrawerLayout";
import HorDefault from "./HorDefault";
import MiniSidebar from "./MiniSidebar";
import Standard from "./Standard";
// import HorLightNav from './HorLightNav';

import { NavStyle } from "@lib/constants/AppEnums";
import Default from "./Default";
import HorDarkLayout from "./HorDarkLayout";
import HorHeaderFixed from "./HorHeaderFixed";
import MiniSidebarToggle from "./MiniSidebarToggle";
import HeaderUserLayout from "./UserHeader";
import HeaderUserMiniLayout from "./UserMiniHeader";
// import HorDarkNav from './HorDarkNav';

const Layouts: any = {
    [NavStyle.STANDARD]: Standard,
    [NavStyle.DEFAULT]: Default,
    [NavStyle.HEADER_USER]: HeaderUserLayout,
    [NavStyle.HEADER_USER_MINI]: HeaderUserMiniLayout,
    [NavStyle.MINI_SIDEBAR_TOGGLE]: MiniSidebarToggle,
    [NavStyle.MINI]: MiniSidebar,
    [NavStyle.DRAWER]: DrawerLayout,
    [NavStyle.BIT_BUCKET]: BitBucket,
    [NavStyle.H_DEFAULT]: HorDefault,
    [NavStyle.HOR_HEADER_FIXED]: HorHeaderFixed,
    [NavStyle.HOR_DARK_LAYOUT]: HorDarkLayout,
};
export default Layouts;
