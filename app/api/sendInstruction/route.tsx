// to send to arduino
import {fetchData} from "../../data"
export async function GET(request: Request){
    const data = await fetchData();
    console.log("Data fetched in API:", data);
    return Response.json({
            temp: data.temp,
            thermostat: data.thermostat,
            light: data.light,
            lock: data.lock,
            message: data.message
        });
}