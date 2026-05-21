"use client";

import { useState } from "react";
import { changeAdminPassword } from "./actions";

export function ChangePasswordForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setSuccess(false);
    setError(null);

    const res = await changeAdminPassword(formData);
    
    if (res.error) {
      setError(res.error);
    } else if (res.success) {
      setSuccess(true);
      const form = document.getElementById("change-password-form") as HTMLFormElement;
      if (form) form.reset();
      setTimeout(() => setSuccess(false), 3000);
    }
    
    setLoading(false);
  }

  return (
    <form
      id="change-password-form"
      action={handleSubmit}
      className="space-y-4"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Current Password
        </label>
        <input
          type="password"
          name="currentPassword"
          required
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          New Password
        </label>
        <input
          type="password"
          name="newPassword"
          required
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Confirm New Password
        </label>
        <input
          type="password"
          name="confirmPassword"
          required
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand"
        />
      </div>

      {error && (
        <div className="rounded-md bg-rose-50 border border-rose-200 px-3 py-2 text-[13px] text-rose-700">
          {error}
        </div>
      )}

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={loading}
          className="bg-brand text-white px-4 py-2 rounded-md hover:bg-brand/90 transition disabled:opacity-50"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
        {success && <span className="text-sm text-green-600">Password updated successfully!</span>}
      </div>
    </form>
  );
}
