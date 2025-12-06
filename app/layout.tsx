import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "PT INOVASIIN SMART SOLUTION | Turn Your Ideas Into Reality",
  description:
    "Jasa digital dan kreatif profesional: 3D Modelling, VR/AR Development, Website & App Development, Motion Graphics. Wujudkan ide Anda menjadi produk digital yang mengesankan.",
  keywords: [
    "3D Modelling",
    "VR Development",
    "AR Development",
    "Web Development",
    "Mobile App",
    "Motion Graphics",
    "Digital Agency Indonesia",
    "Creative Agency",
  ],
  authors: [{ name: "PT INOVASIIN SMART SOLUTION" }],
  openGraph: {
    title: "PT INOVASIIN SMART SOLUTION | Turn Your Ideas Into Reality",
    description:
      "Jasa digital dan kreatif profesional: 3D Modelling, VR/AR Development, Website & App Development, Motion Graphics.",
    type: "website",
    locale: "id_ID",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans antialiased`}
        style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
      >
        {children}
      </body>
    </html>
  );
}
