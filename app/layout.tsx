import { Inter } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/lib/store";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "KaiCenter SC | Sistema de Reservas",
    description: "Reserva tu turno de entrenamiento en KaiCenter SC",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <StoreProvider>
                    {children}
                </StoreProvider>
            </body>
        </html>
    );
}
