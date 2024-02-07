import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";

export function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");
  query ? redirect(`/docs?search=${query}`) : redirect("/docs");
}
