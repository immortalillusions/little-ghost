import { createClient } from 'redis';

export async function GET() {
  const redis = await createClient({ url: process.env.REDIS_URL }).connect();

  const thermoLocation = await redis.get("thermo_location");
  const lockLocation = await redis.get("lock_location");
  const lightLocation = await redis.get("light_location");
  const temp = await redis.get("temp");
  const light = await redis.get("light");
  const lock = await redis.get("lock");
  const thermostat = await redis.get("thermostat");
  const locations: Record<string, number> = {
    "thermo_location": Number(thermoLocation),
    "lock_location": Number(lockLocation),
    "light_location": Number(lightLocation),
  };
  return Response.json({
      thermo_location: locations.thermo_location,
      lock_location: locations.lock_location,
      light_location: locations.light_location,
      temp: Number(temp),
      light: light === 'true',
      lock: lock === 'true',
      thermostat: thermostat === 'true'
    }, { status: 200 });
}
