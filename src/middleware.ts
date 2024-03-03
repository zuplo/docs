import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();

  const isProduction = process.env.NODE_ENV === "production";
  const requestedHost = request.headers.get("X-Forwarded-Host");

  if (isProduction && requestedHost && !requestedHost.match(/zuplo.com/)) {
    const requestedPort = request.headers.get("X-Forwarded-Port");
    const requestedProto = request.headers.get("X-Forwarded-Proto");

    url.host = `zuplo.com`;
    url.protocol = requestedProto || url.protocol;
    url.port = requestedPort || url.port;

    console.log({ requestedHost });
    // return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
