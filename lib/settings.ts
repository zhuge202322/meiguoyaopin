import { prisma } from "@/lib/db";

export async function getSupportEmail() {
  const setting = await prisma.setting.findUnique({
    where: { key: 'supportEmail' }
  });
  return setting?.value || 'reliontomx@Gmail.com';
}
