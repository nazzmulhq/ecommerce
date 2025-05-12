import styled from "styled-components";
import { shouldForwardProp } from "@styled-system/should-forward-prop"; // Optional: can manually define too

type StyledAppSelectedIconProps = {
    backgroundColor?: string;
    color?: string;
};

export const StyledAppSelectedIcon = styled.div.withConfig({
    shouldForwardProp: (prop) => !["backgroundColor", "color"].includes(prop)
})<StyledAppSelectedIconProps>`
    width: 20px;
    height: 20px;
    border-radius: ${({ theme }) => theme.sizes.borderRadius.circle};
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    position: absolute;
    right: 10px;
    top: 10px;
    z-index: 1;
    background-color: ${({ backgroundColor, theme }) => backgroundColor || theme.palette.text.primary};
    color: ${({ color }) => color};

    .anticon {
        background-color: ${({ backgroundColor }) => backgroundColor || "transparent"};
        color: ${({ color, theme }) => color || theme.palette.background.paper};
    }

    &.isCenter {
        right: auto;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }

    & svg {
        font-size: ${({ theme }) => theme.font.size.sm};
    }
`;
