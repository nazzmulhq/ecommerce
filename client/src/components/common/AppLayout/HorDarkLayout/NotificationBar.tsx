import { StyledHeaderAlertDark } from "./index.styled";

export default function NotificationBar() {
    const onClose = () => {
        console.log("I was closed.");
    };

    return (
        <StyledHeaderAlertDark
            closable
            message=" Get flat 60% off on your first purchase"
            onClose={onClose}
            type="warning"
        />
    );
}
