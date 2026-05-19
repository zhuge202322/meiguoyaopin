import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { checkPw, setSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  if (!email || !password) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (!user || !(await checkPw(password, user.passwordHash))) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }
  await setSession({ sub: user.id, role: "user", email: user.email });
  return NextResponse.json({ ok: true });
}
