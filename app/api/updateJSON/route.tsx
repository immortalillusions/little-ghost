import fs from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  const { type, value } = await request.json();

  const locationsPath = path.join(process.cwd(), "locations.json");
  const locationsRaw = await fs.readFile(locationsPath, "utf-8");
  const locations = JSON.parse(locationsRaw);

  // Map type to key in JSON
  const keyMap: Record<string, string> = {
    thermostat: "thermo_location",
    lock: "lock_location",
    light: "light_location",
  };

  if (!keyMap[type]) {
    return Response.json({ success: false, message: "Invalid type", positions: {
      thermo_location: locations.thermo_location,
      lock_location: locations.lock_location,
      light_location: locations.light_location,
    } }, { status: 400 });
  }
 // Check for proximity to other types
  const currentKey = keyMap[type];
  const otherKeys = Object.values(keyMap).filter(k => k !== currentKey);
  const tooClose = otherKeys.some(k => Math.abs(locations[k] - value) < 20);

  if (tooClose) {
    return Response.json({
      success: false,
      message: `Items must be 20+ degrees apart.`,
      positions: {
      thermo_location: locations.thermo_location,
      lock_location: locations.lock_location,
      light_location: locations.light_location,
    }
    }, { status: 400 });
  }

  // Save new value
  locations[currentKey] = value;
  await fs.writeFile(locationsPath, JSON.stringify(locations, null, 2), "utf-8");
  return Response.json({ success: true, message: `Saved ${currentKey} as ${value}`,       positions: {
      thermo_location: locations.thermo_location,
      lock_location: locations.lock_location,
      light_location: locations.light_location,
    } }, { status: 200 });
}