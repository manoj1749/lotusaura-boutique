import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { Playfair_Display, Lato } from "next/font/google";

const display = Playfair_Display({ subsets: ["latin"], variable: "--font-display" });
const body = Lato({ subsets: ["latin"], weight: ["300", "400", "700"], variable: "--font-body" });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
  className={`${display.variable} ${body.variable} font-body bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark transition-colors duration-300`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
