export async function GET() {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    "http://localhost:3000";

  const response = await fetch(`${baseUrl}/locations.json`, {
    cache: "no-store", // optional: prevent caching in dev
  });

  if (!response.ok) {
    return new Response("Failed to load locations.json", { status: 500 });
  }

  const locations = await response.json();
  return Response.json(locations);
}
