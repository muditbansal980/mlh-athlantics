import type { Metadata } from "next";
import "../globals.css";

// import { QueryClientProvider } from "@tanstack/react-query";
import QueryProvider from '../../../providers/QueryProvider'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ThemeProvider } from "@/components/provider/theme-provider";
import DashboardLayout from "../../components/layout";
export const metadata: Metadata = {
  title: "Athlantic - Your Ultimate Sports Companion",
  description: "Athlantic is your all-in-one sports management system, designed to elevate your athletic performance and streamline your training. With Athlantic, you can track your workouts, monitor your progress, and connect with a vibrant community of athletes. Whether you're a beginner or a seasoned pro, Athlantic provides the tools and insights you need to reach your goals and unleash your full potential.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {/* <ThemeProvider> */}
          <QueryProvider>
            <DashboardLayout>
              {children}
            </DashboardLayout>
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryProvider>
        {/* </ThemeProvider> */}
      </body>
    </html>
  );
}
