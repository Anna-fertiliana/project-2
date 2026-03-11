import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, username, phone, password } = body;

    if (!email || !password || !username) {
      return NextResponse.json(
        { message: "Email, username, dan password wajib diisi" },
        { status: 400 }
      );
    }

    const res = await fetch(
      "https://be-social-media-api-production.up.railway.app/api/auth/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          username,
          phone,
          password,
        }),
      }
    );

    const data = await res.json();

   if (!res.ok) {
  return NextResponse.json(
    {
      message: data.message || "Register gagal",
      errors: data.errors || null,
    },
    { status: res.status }
  );
}

    return NextResponse.json({
      message: "Register berhasil",
      data: data.data,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}