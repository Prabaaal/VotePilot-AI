import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VotePilot AI — Your Election Education Companion",
  description: "Understand Indian elections without the confusion. Personalized voter guidance, booth day simulator, and AI-powered Q&A in English, Hindi, and Assamese.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
