export const runtime = "nodejs";

export async function POST(req) {
  try {
    const body = await req.json();

    const backendRes = await fetch(
      "https://code-review-backend-pj0v.onrender.com/review",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: body.code }),
      }
    );

    const text = await backendRes.text();

    if (!backendRes.ok) {
      return Response.json(
        { error: `Backend error: ${text}` },
        { status: backendRes.status }
      );
    }

    return Response.json(JSON.parse(text), { status: 200 });

  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function GET() {
  return Response.json({ status: "review route is alive" });
}