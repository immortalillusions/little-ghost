import { createClient} from 'redis';

export async function POST(request: Request) {
    const redis = await createClient({ url: process.env.REDIS_URL }).connect();
    //let temp = 20; // temp (and change updateJSON to be 45)
    //let thermostat = false; // off
    //let light = false; // off
    //let lock = false; // unlocked
    // Redis only stores strings
    try {
        const { item, value } = await request.json();
        console.log("Received:", { item, value });
        await redis.set(item, String(value));
        return Response.json({ success: true, message: `${item} updated to ${value}` }, { status: 200 });
    } catch (err) {
        console.error("API error:", err);
        return Response.json({ success: false, message: "Internal server error" , error: String(err)}, { status: 500 });
    }
}