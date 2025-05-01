import Layouts from "@ui/Layouts";
import Providers from "@ui/providers";
import { cookies } from "next/headers";

interface LangLayoutProps {
    children: React.ReactNode;
}

export default async function LangLayout({ children }: LangLayoutProps) {
    const token = (await cookies()).get("token")?.value;

    return (
        <Providers>
            <Layouts token={token}>{children}</Layouts>
        </Providers>
    );
}
