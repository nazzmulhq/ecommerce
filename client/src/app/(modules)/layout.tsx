import AppLayout from "@components/common/AppLayout";

interface ModuleLayoutProps {
    children: React.ReactNode;
}

export default async function ModuleLayout({ children }: ModuleLayoutProps) {
    return <AppLayout>{children}</AppLayout>;
}
