import type { Metadata } from "next";
import AccountClient from "./AccountClient";

export const metadata: Metadata = { title: "Tài khoản của tôi" };

export default function AccountPage() {
  return <AccountClient />;
}
