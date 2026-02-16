import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import { Toaster } from "sonner";

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
                className={`${inter.className} antialiased`}
            >
                <StoreProvider>
                    {children}
                    <Toaster position="bottom-center" richColors />
                </StoreProvider>
            </body>
        </html>
    );
}
