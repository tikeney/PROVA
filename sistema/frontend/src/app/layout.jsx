import "./globals.css";

export const metadata = {
  title: "TechRent - Gestão de Estoque",
  description: "Sistema de gestão de estoque",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
      </body>
    </html>
  );
}
