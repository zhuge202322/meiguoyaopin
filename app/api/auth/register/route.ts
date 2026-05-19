import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPw, setSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password, firstName, lastName } = await req.json();
    if (!email || !password || password.length < 6) {
      return NextResponse.json({ error: "Email and password (min 6 chars) required" }, { status: 400 });
    }
    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash: await hashPw(password),
        firstName,
        lastName,
      },
    });
    await setSession({ sub: user.id, role: "user", email: user.email });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
