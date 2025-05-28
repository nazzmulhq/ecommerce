import "@ant-design/v5-patch-for-react-19";
import Providers from "@components/common/Providers";

import { Inter } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
interface LangLayoutProps {
    children: React.ReactNode;
    params: Promise<{
        lang: string;
    }>;
}

export default async function RootLayout({ children, params }: LangLayoutProps) {
    // const token = (await cookies()).get("token")?.value;
    // const { lang } = await params;

    const primaryColor = process.env.NEXT_PUBLIC_PRIMARY_COLOR || "#2299DD";

    return (
        <html>
            <body className={inter.className}>
                <NextTopLoader
                    color={primaryColor}
                    crawl={true}
                    crawlSpeed={200}
                    easing="ease"
                    height={2}
                    initialPosition={0.08}
                    shadow={`0 0 10px ${primaryColor},0 0 5px ${primaryColor}`}
                    showAtBottom={false}
                    showSpinner={false}
                    speed={200}
                    zIndex={1600}
                />
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
