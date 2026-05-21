"use server";

import { getAdminSession, hashPw, checkPw } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function changeAdminPassword(formData: FormData) {
  const session = await getAdminSession();
  if (!session) {
    return { error: "Unauthorized" };
  }

  const currentPassword = formData.get("currentPassword")?.toString();
  const newPassword = formData.get("newPassword")?.toString();
  const confirmPassword = formData.get("confirmPassword")?.toString();

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { error: "All fields are required" };
  }

  if (newPassword !== confirmPassword) {
    return { error: "New passwords do not match" };
  }

  if (newPassword.length < 6) {
    return { error: "New password must be at least 6 characters" };
  }

  const admin = await prisma.adminUser.findUnique({
    where: { id: session.sub },
  });

  if (!admin) {
    return { error: "Admin not found" };
  }

  const isCorrect = await checkPw(currentPassword, admin.passwordHash);
  if (!isCorrect) {
    return { error: "Incorrect current password" };
  }

  const newHash = await hashPw(newPassword);
  await prisma.adminUser.update({
    where: { id: admin.id },
    data: { passwordHash: newHash },
  });

  return { success: true };
}
