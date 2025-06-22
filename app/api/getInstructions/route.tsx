// to simulate marzouqs code thing
// export async function GET(request: Request){
//     return Response.json({"gesture":"roll_right", "location":"91"});
// }
// to simulate marzouqs code thing
export async function GET() {
    const actionRes = await fetch("http://192.168.4.1");
    const locationRes = await fetch("http://192.168.4.1/heading");

    const action = await actionRes.text();
    const locationText = await locationRes.text();
    const location = parseFloat(locationText);  // Convert to number

    return Response.json({
        gesture: action,
        location: isNaN(location) ? null : location
    });
}