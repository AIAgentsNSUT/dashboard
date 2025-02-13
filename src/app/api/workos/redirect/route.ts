import { getOrganisationSignInUrl } from "@/lib/auth";

export async function GET(request: Request) {
  const hostname = request.headers.get("host") || "";

  try {
    const signInUrl = await getOrganisationSignInUrl(hostname);

    return Response.redirect(signInUrl, 302);
  } catch (error) {
    console.error("Error generating sign-in URL:", error);

    return new Response("Internal Server Error", { status: 500 });
  }
}
