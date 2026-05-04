import "./globals.css";
import "./navigation.css";
import "./venues.css";

const isGithubActions = process.env.GITHUB_ACTIONS === "true";
const basePath = isGithubActions ? "/congresoapp" : "";

export const metadata = {
  title: "XXXIII Congreso Nacional de Derecho Procesal",
  description:
    "Plataforma digital del XXXIII Congreso Nacional de Derecho Procesal, La Plata, 5 al 7 de noviembre de 2026.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <meta name="theme-color" content="#002350" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Libre+Baskerville:wght@700&display=swap"
          rel="stylesheet"
        />
        <link rel="manifest" href={`${basePath}/manifest.json`} />
      </head>
      <body>{children}</body>
    </html>
  );
}
