import "./globals.css";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata = {
  title: "Digitalis Infoproducts — Produtos digitais e conteúdo educacional online",
  description:
    "Digitalis Infoproducts LLC — criação, comercialização e distribuição de produtos digitais (infoprodutos) e conteúdos educacionais online para o mercado latino.",
  openGraph: {
    type: "website",
    title: "Digitalis Infoproducts",
    description: "Produtos digitais e conteúdo educacional online para o mercado latino.",
  },
};

export const viewport = {
  themeColor: "#6366f1",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={poppins.variable}>
      <body className="text-slate-900 antialiased">{children}</body>
    </html>
  );
}
