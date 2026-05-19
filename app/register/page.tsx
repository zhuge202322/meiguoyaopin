"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthLayout from "@/components/AuthLayout";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirm: "",
    agree: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function update<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (form.password.length < 6) return setError("Password must be at least 6 characters");
    if (form.password !== form.confirm) return setError("Passwords do not match");
    if (!form.agree) return setError("You must agree to the terms");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          firstName: form.firstName,
          lastName: form.lastName,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Registration failed");
        setLoading(false);
        return;
      }
      router.push("/");
      router.refresh();
    } catch {
      setError("Network error");
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Sign up to save your visit details, manage refills, and track shipments."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-[#1E7FFF] hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">First name</label>
            <input className="input" required value={form.firstName} onChange={(e) => update("firstName", e.target.value)} autoComplete="given-name" />
          </div>
          <div>
            <label className="label">Last name</label>
            <input className="input" required value={form.lastName} onChange={(e) => update("lastName", e.target.value)} autoComplete="family-name" />
          </div>
        </div>

        <div>
          <label className="label">Email</label>
          <input type="email" required className="input" value={form.email} onChange={(e) => update("email", e.target.value)} autoComplete="email" />
        </div>

        <div>
          <label className="label">Password</label>
          <input type="password" required className="input" placeholder="At least 6 characters" value={form.password} onChange={(e) => update("password", e.target.value)} autoComplete="new-password" />
        </div>

        <div>
          <label className="label">Confirm password</label>
          <input type="password" required className="input" value={form.confirm} onChange={(e) => update("confirm", e.target.value)} autoComplete="new-password" />
        </div>

        <label className="flex items-start gap-2 text-[13px] text-[#3a3a3a]">
          <input
            type="checkbox"
            checked={form.agree}
            onChange={(e) => update("agree", e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#1E7FFF]"
          />
          <span>
            I agree to the{" "}
            <Link href="/terms" className="text-[#1E7FFF] hover:underline">Terms</Link>,{" "}
            <Link href="/privacy" className="text-[#1E7FFF] hover:underline">Privacy Policy</Link>, and{" "}
            <Link href="/hipaa" className="text-[#1E7FFF] hover:underline">HIPAA Notice</Link>.
          </span>
        </label>

        {error && (
          <div className="rounded-md bg-rose-50 border border-rose-200 px-3 py-2 text-[13px] text-rose-700">
            {error}
          </div>
        )}

        <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>
    </AuthLayout>
  );
}
