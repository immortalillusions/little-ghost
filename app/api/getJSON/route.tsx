import fs from "fs/promises";
import path from "path";

export async function GET(request: Request) {

  const locationsPath = path.join(process.cwd(), "locations.json");
  const locationsRaw = await fs.readFile(locationsPath, "utf-8");
  const locations = JSON.parse(locationsRaw);

  return Response.json(locations);
}