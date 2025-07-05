import { createClient} from 'redis';

export async function POST(request: Request) {
  const redis = await createClient({ url: process.env.REDIS_URL }).connect();

  const { type, value } = await request.json();
  const thermoLocation = await redis.get("thermo_location");
  const lockLocation = await redis.get("lock_location");
  const lightLocation = await redis.get("light_location");
  const locations: Record<string, number> = {
    "thermo_location": Number(thermoLocation),
    "lock_location": Number(lockLocation),
    "light_location": Number(lightLocation),
  };

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
  const tooClose = otherKeys.some(k => Math.abs(Number(locations[k]) - value) < 45);

  if (tooClose) {
    return Response.json({
      success: false,
      message: `Items must be 45+ degrees apart.`,
      positions: {
      thermo_location: locations.thermo_location,
      lock_location: locations.lock_location,
      light_location: locations.light_location,
    }
    }, { status: 400 });
  }

  // Save new value
  locations[currentKey] = value;
  
  // Update Redis cache
  await redis.set("thermo_location", locations["thermo_location"]);
  await redis.set("lock_location", locations["lock_location"]);
  await redis.set("light_location", locations["light_location"]);

  return Response.json({ success: true, message: `Saved ${currentKey} as ${value}`,       positions: {
      thermo_location: locations.thermo_location,
      lock_location: locations.lock_location,
      light_location: locations.light_location,
    } }, { status: 200 });
}