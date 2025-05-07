import { useLayoutContext } from "@lib/context/AppContextProvider/LayoutContextProvider";
import { StyledFooterBtn, StyledFooterBtnView, StyledMainFooter } from "./AppFooter.styled";

const AppFooter = () => {
    const { footer } = useLayoutContext();

    if (footer) {
        return (
            <StyledMainFooter>
                <p>Copy right @crema 2021</p>
                <StyledFooterBtnView>
                    <StyledFooterBtn color="primary" type="link">
                        Buy Now
                    </StyledFooterBtn>
                </StyledFooterBtnView>
            </StyledMainFooter>
        );
    }
    return null;
};

export default AppFooter;
