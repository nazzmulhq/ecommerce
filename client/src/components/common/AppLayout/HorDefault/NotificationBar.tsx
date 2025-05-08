import { StyledHeaderAlert } from "./index.styled";

export default function NotificationBar() {
    const onClose = () => {
        console.log("I was closed.");
    };

    return (
        <StyledHeaderAlert
            closable
            message=" Get flat 60% off on your first purchase"
            onClose={onClose}
            type="warning"
        />
    );
}
