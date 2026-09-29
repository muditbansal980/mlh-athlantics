export const metadata = {
  title: 'mlh-athlantics',
  description: 'Leetcode  for sports',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
