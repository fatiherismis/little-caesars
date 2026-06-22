import "./globals.css";
import { Inter_Tight, Playfair_Display, JetBrains_Mono } from "next/font/google";
import { CartProvider } from "@/components/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Bold Typography font yığını — next/font ile yüklenir, CSS değişkenlerine bağlanır.
const sans = Inter_Tight({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
  display: "swap",
});
const serif = Playfair_Display({
  subsets: ["latin", "latin-ext"],
  variable: "--font-serif",
  display: "swap",
});
const mono = JetBrains_Mono({
  subsets: ["latin", "latin-ext"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata = {
  title: "LITTLE CAESARS — Pizza, Yeniden Tanımlandı",
  description: "Taze hamur. Cesur lezzet. Hızlı teslimat. Online sipariş.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr" className={`${sans.variable} ${serif.variable} ${mono.variable}`}>
      <body className="font-sans">
        <CartProvider>
          <Navbar />
          <main className="min-h-[70vh]">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
