import type { Metadata } from 'next';
import './globals.css';
import SWRegister from "./sw-register";
import { AuthProvider } from '@/context/authContext';

export const metadata: Metadata = {
    title: 'TimeKeep',
    description: 'Ett sätt att hålla koll på tiden',
    manifest: "/manifest.json",
    // themeColor: "#0f172a",
    appleWebApp: {
        capable: true,
        statusBarStyle: "black-translucent",
        title: "Time Keep"
    }
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang='en'>
            <body>
                <SWRegister />
                <AuthProvider>{children}</AuthProvider>
            </body>
        </html>
    );
}
