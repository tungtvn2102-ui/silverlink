import type { Metadata } from "next";
import CommunityClient from "./CommunityClient";

export const metadata: Metadata = {
  title: "Cộng đồng",
  description:
    "Cộng đồng SilverLink: tạo nhóm, đăng bài, bình luận và thả emoji cùng những người dùng khác.",
};

export default function CommunityPage() {
  return <CommunityClient />;
}
