import "./globals.css";

export const metadata = {
  title: "NEON//RANGE",
  description: "Beginner-friendly cyber range"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
