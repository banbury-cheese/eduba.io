import { NextResponse } from "next/server";
import { auth } from "@/auth";

const PROTECTED_PATTERNS: RegExp[] = [
  /^\/sectors(\/|$)/,
  /^\/create-page(\/|$)/,
  /^\/api\/sector-chat(\/|$)/,
  /^\/api\/create-page(\/|$)/,
  /^\/api\/discover-site(\/|$)/,
];

const isProtected = (path: string) =>
  PROTECTED_PATTERNS.some((pattern) => pattern.test(path));

export default auth((req) => {
  const path = req.nextUrl.pathname;
  const accept = req.headers.get("accept") ?? "";
  const wantsMarkdown = accept.includes("text/markdown");

  if (isProtected(path) && !req.auth) {
    if (path.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const signInUrl = new URL("/api/auth/signin", req.url);
    signInUrl.searchParams.set("callbackUrl", req.url);
    return NextResponse.redirect(signInUrl);
  }

  if (wantsMarkdown && !path.startsWith("/api/")) {
    const url = req.nextUrl.clone();
    url.pathname = `/api/md${url.pathname === "/" ? "" : url.pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon|icon|images|fonts|\\.well-known|robots\\.txt|sitemap\\.xml).*)",
  ],
};
