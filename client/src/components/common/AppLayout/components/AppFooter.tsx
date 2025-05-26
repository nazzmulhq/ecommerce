"use client";
import { useLayoutContext } from "@lib/context/AppContextProvider/LayoutContextProvider";
import { StyledMainFooter } from "./AppFooter.styled";

const AppFooter = () => {
    const { footer } = useLayoutContext();

    if (footer) {
        return (
            <StyledMainFooter>
                <p>Copy right @demo {new Date().getFullYear()}</p>
            </StyledMainFooter>
        );
    }
    return null;
};

export default AppFooter;
