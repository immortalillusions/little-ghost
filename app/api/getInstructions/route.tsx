//to simulate marzouqs code thing
// export async function GET(request: Request) {
//     return Response.json({ "gesture": "roll_right", "location": "91" });
// }

// to simulate marzouqs code thing
export async function GET() {
    try {
        const actionRes = await fetch("http://192.168.4.1");
        if (!actionRes.ok) throw new Error("Failed to fetch action");

        const locationRes = await fetch("http://192.168.4.1/heading");
        if (!locationRes.ok) throw new Error("Failed to fetch location");

        const action = await actionRes.text();
        const locationText = await locationRes.text();
        const location = parseFloat(locationText);  // Convert to number

        return Response.json({
            gesture: action,
            location: isNaN(location) ? null : location,
            mock: false
        });
    }
    catch (error) {
        // when we use mock data, it'll be slower bc we have to wait for the fetch to fail which is ok
        console.error("Error fetching data:", error);
        // Generate random gesture and location
        const gestures = ["pitch_up", "pitch_down", "roll_right", "roll_left"];
        const gesture = gestures[Math.floor(Math.random() * gestures.length)];
        const location = Math.floor(Math.random() * 361); // 0 to 360 inclusive
        return Response.json({ gesture, location, mock: true });

    }
}