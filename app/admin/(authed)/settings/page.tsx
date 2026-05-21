import { getSupportEmail } from "@/lib/settings";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { SettingsForm } from "./SettingsForm";

async function updateSupportEmail(formData: FormData) {
  "use server";
  const email = formData.get("email")?.toString();
  if (email) {
    await prisma.setting.upsert({
      where: { key: "supportEmail" },
      update: { value: email },
      create: { key: "supportEmail", value: email },
    });
    revalidatePath("/", "layout");
  }
}

export default async function SettingsPage() {
  const email = await getSupportEmail();

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Global Settings</h1>
        <p className="text-gray-500 mt-1">Manage global configurations for the website.</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm max-w-2xl">
        <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
        <SettingsForm defaultEmail={email} updateAction={updateSupportEmail} />
      </div>
    </div>
  );
}
