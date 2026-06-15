export const metadata = {
  title: "Greg Frye",
  description: "Creative Director & Brand + Product Designer",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{
        fontFamily: "'Times New Roman', Times, serif",
        backgroundColor: '#fafaf9',
        color: '#1c1b1a',
        lineHeight: 1.6,
        WebkitFontSmoothing: 'antialiased',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        margin: 0,
        padding: 0,
      }}>
        {children}
      </body>
    </html>
  );
}
