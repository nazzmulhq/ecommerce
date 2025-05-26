interface LayoutProps {
    children: React.ReactNode;
    breadcrumb: React.ReactNode;
}

export default function Layout({ children, breadcrumb }: LayoutProps) {
    return (
        <section>
            {breadcrumb}
            {children}
        </section>
    );
}
