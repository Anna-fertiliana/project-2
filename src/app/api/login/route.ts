import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email dan password wajib diisi" },
        { status: 400 }
      );
    }

    // kirim request ke backend API
    const res = await fetch(
      "https://be-social-media-api-production.up.railway.app/api/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { message: data.message || "Login gagal" },
        { status: res.status }
      );
    }

    // kirim response ke frontend
    return NextResponse.json({
      message: "Login berhasil",
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