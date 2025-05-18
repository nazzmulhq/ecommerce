interface LayoutProps {
    children: React.ReactNode;
    list: React.ReactNode;
}

export default function Layout({ children, list }: LayoutProps) {
    return (
        <section>
            {list}
            {children}
        </section>
    );
}
