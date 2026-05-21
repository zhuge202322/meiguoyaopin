"use client";

import { useState } from "react";

export function SettingsForm({
  defaultEmail,
  updateAction,
}: {
  defaultEmail: string;
  updateAction: (formData: FormData) => Promise<void>;
}) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  return (
    <form
      action={async (formData) => {
        setLoading(true);
        setSuccess(false);
        await updateAction(formData);
        setLoading(false);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }}
      className="space-y-4"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Support Email
        </label>
        <input
          type="email"
          name="email"
          defaultValue={defaultEmail}
          required
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand"
        />
        <p className="text-xs text-gray-500 mt-1">
          This email will be dynamically updated across the entire website (Footer, Contact Us, FAQ, etc.).
        </p>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={loading}
          className="bg-brand text-white px-4 py-2 rounded-md hover:bg-brand/90 transition disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Settings"}
        </button>
        {success && <span className="text-sm text-green-600">Saved successfully!</span>}
      </div>
    </form>
  );
}
