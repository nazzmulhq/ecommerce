// import "slick-carousel/slick/slick-theme.css";
// import "slick-carousel/slick/slick.css";
import MiniSidebarToggle from "./MiniSidebarToggle";

export interface AppLayoutProps {
    children: React.ReactNode;
    token?: string;
}

// Server Component wrapper for AppLayout
export default function AppLayout({ children }: AppLayoutProps) {
    return <MiniSidebarToggle>{children}</MiniSidebarToggle>;
}
