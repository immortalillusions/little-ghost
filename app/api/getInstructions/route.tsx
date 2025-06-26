export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return Response.json(makeMock());
  }

  try {
    const [actionRes, locationRes] = await Promise.all([
      fetch("http://192.168.4.1"),
      fetch("http://192.168.4.1/heading"),
    ]);

    if (!actionRes.ok || !locationRes.ok)
      throw new Error("Device did not answer");

    const action   = await actionRes.text();
    const location = Number.parseFloat(await locationRes.text());

    return Response.json({
      gesture:  action.trim(),
      location: Number.isFinite(location) ? location : null,
      mock:     false,
    });

  } catch (err) {
    return Response.json(makeMock());
  }
}

function makeMock() {
  const gestures = ["pitch_up","pitch_down","roll_right","roll_left"];
  return {
    gesture:  gestures[Math.floor(Math.random()*gestures.length)],
    location: Math.floor(Math.random()*361),
    mock:     true,
  };
}
