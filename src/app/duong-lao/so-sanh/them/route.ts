import { NextResponse, type NextRequest } from "next/server";

// Merges ?ids=…&add=… into a clean ?ids=… list (max 3), then redirects back.
export function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const ids = (searchParams.get("ids") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const add = searchParams.get("add");
  if (add && !ids.includes(add)) ids.push(add);

  const url = request.nextUrl.clone();
  url.pathname = "/duong-lao/so-sanh";
  url.search = ids.length ? `?ids=${ids.slice(0, 3).join(",")}` : "";
  return NextResponse.redirect(url);
}
