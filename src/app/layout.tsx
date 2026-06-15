import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import { createClient } from "@/lib/supabase/server";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import Footer from "@/components/layout/Footer";
import type { Profile } from "@/lib/types";

const beVietnam = Be_Vietnam_Pro({
  variable: "--font-be-vietnam",
  subsets: ["vietnamese", "latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "SilverLink — Kết nối, chăm sóc, trao cơ hội cho người cao tuổi",
    template: "%s | SilverLink",
  },
  description:
    "Nền tảng 3-trong-1 cho người cao tuổi Việt Nam: nhà dưỡng lão được kiểm chứng, việc làm cao tuổi, cẩm nang chăm sóc và cộng đồng thân thiện.",
  icons: {
    icon: "/icon.svg",
    shortcut: "/favicon.ico",
    apple: "/icon-192.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const largeText = cookieStore.get("sl-lt")?.value === "1";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile: Profile | null = null;
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    profile = data;
  }

  return (
    <html
      lang="vi"
      className={`${beVietnam.variable} h-full antialiased ${largeText ? "lt" : ""}`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <Header profile={profile} largeText={largeText} />
        <main className="flex-1 pb-24 md:pb-0">{children}</main>
        <Footer />
        <BottomNav loggedIn={!!profile} />
      </body>
    </html>
  );
}
