import Layouts from "@components/common/Layouts";
import Providers from "@components/common/providers";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import NextTopLoader from "nextjs-toploader";

const inter = Inter({ subsets: ["latin"] });
interface LangLayoutProps {
    children: React.ReactNode;
    params: Promise<{
        lang: string;
    }>;
}

export default async function LangLayout({ children, params }: LangLayoutProps) {
    const token = (await cookies()).get("token")?.value;
    const { lang } = await params;

    return (
        <html>
            <body className={inter.className} lang={lang}>
                <NextTopLoader
                    color="#2299DD"
                    crawl={true}
                    crawlSpeed={200}
                    easing="ease"
                    height={2}
                    initialPosition={0.08}
                    shadow="0 0 10px #2299DD,0 0 5px #2299DD"
                    showAtBottom={false}
                    showSpinner={false}
                    speed={200}
                    zIndex={1600}
                />
                <Providers>
                    <Layouts token={token}>{children}</Layouts>
                </Providers>
            </body>
        </html>
    );
}
