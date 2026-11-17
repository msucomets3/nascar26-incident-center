import type {
  Metadata,
} from "next";
import type {
  ReactNode,
} from "react";

export const metadata: Metadata = {
  title:
    "AJRabbitGaming Incident Center",
  description:
    "NASCAR 26 Incident Center",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
  <body
    style={{
      background: "#08111f",
      margin: 0,
    }}
  >
    {children}
  </body>
</html>
  );
}