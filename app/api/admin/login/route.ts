import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { checkPw, hashPw, setSession } from "@/lib/auth";

// Admin login. On first call, if no AdminUser exists, creates one
// from ADMIN_BOOTSTRAP_EMAIL / ADMIN_BOOTSTRAP_PASSWORD.
export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  if (!email || !password) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // Bootstrap: if no admin exists, allow first login to provision one
  // matching env credentials.
  const count = await prisma.adminUser.count();
  if (count === 0) {
    const seedEmail = process.env.ADMIN_BOOTSTRAP_EMAIL;
    const seedPw = process.env.ADMIN_BOOTSTRAP_PASSWORD;
    if (seedEmail && seedPw && email.toLowerCase() === seedEmail.toLowerCase() && password === seedPw) {
      const admin = await prisma.adminUser.create({
        data: {
          email: seedEmail.toLowerCase(),
          passwordHash: await hashPw(seedPw),
          name: "Admin",
        },
      });
      await setSession({ sub: admin.id, role: "admin", email: admin.email });
      return NextResponse.json({ ok: true, bootstrapped: true });
    }
  }

  const admin = await prisma.adminUser.findUnique({ where: { email: email.toLowerCase() } });
  if (!admin || !(await checkPw(password, admin.passwordHash))) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }
  await setSession({ sub: admin.id, role: "admin", email: admin.email });
  return NextResponse.json({ ok: true });
}
