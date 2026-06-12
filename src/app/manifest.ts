import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SilverLink — Kết nối người cao tuổi Việt Nam",
    short_name: "SilverLink",
    description:
      "Nhà dưỡng lão được kiểm chứng, việc làm cao tuổi và cộng đồng thân thiện.",
    start_url: "/",
    display: "standalone",
    background_color: "#faf9f7",
    theme_color: "#185a4c",
    lang: "vi",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
