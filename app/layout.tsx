import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StudySage — Your AI Study Sensei",
  description:
    "Meet Ryo, your AI-powered study buddy. Ask questions, generate quizzes, and create flashcards — powered by Google Gemini.",
  openGraph: {
    title: "StudySage — Your AI Study Sensei",
    description: "Study smarter with Ryo, your AI samurai sensei. Powered by Gemini.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.png" type="image/png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
