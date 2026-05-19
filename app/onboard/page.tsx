"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import Progress from "@/components/onboard/Progress";
import YesNo from "@/components/onboard/YesNo";
import { US_STATES, MEDICAL_CONDITIONS } from "@/components/onboard/data";
import { ArrowLeft, ArrowRight, CheckCircle2, Stethoscope, Truck, BadgeCheck } from "lucide-react";

type Plan = "1" | "3" | "6" | "12";
type Product = "semaglutide" | "tirzepatide";

type Form = {
  // Step 1
  state: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  sms: "yes" | "no" | "";
  smsTransactional: boolean;
  smsMarketing: boolean;
  // Step 2
  sex: "" | "male" | "female";
  dob: string;
  heightFt: string;
  heightIn: string;
  weight: string;
  goalWeight: string;
  // Step 3
  conditions: string[];
  medications: string;
  allergies: string;
  pregnant: "yes" | "no" | "";
  // Step 4
  product: "" | Product;
  plan: "" | Plan;
  password: string;
  agree: boolean;
  // Shipping (Step 4)
  address1: string;
  address2: string;
  city: string;
  zip: string;
};

const empty: Form = {
  state: "", firstName: "", lastName: "", email: "", phone: "", sms: "",
  smsTransactional: false, smsMarketing: false,
  sex: "", dob: "", heightFt: "", heightIn: "", weight: "", goalWeight: "",
  conditions: [], medications: "", allergies: "", pregnant: "",
  product: "", plan: "", password: "", agree: false,
  address1: "", address2: "", city: "", zip: "",
};

const PRICING: Record<Product, Record<Plan, number> & { normal: number }> = {
  semaglutide: { "1": 99, "3": 133, "6": 117, "12": 99, normal: 169 },
  tirzepatide: { "1": 179, "3": 199, "6": 183, "12": 149, normal: 249 },
};

export default function OnboardPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<Form>(empty);
  const [done, setDone] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const update = (patch: Partial<Form>) => setForm((f) => ({ ...f, ...patch }));

  const bmi = useMemo(() => {
    const ft = parseFloat(form.heightFt);
    const inc = parseFloat(form.heightIn || "0");
    const w = parseFloat(form.weight);
    if (!ft || !w) return null;
    const meters = (ft * 12 + inc) * 0.0254;
    const kg = w * 0.453592;
    return +(kg / (meters * meters)).toFixed(1);
  }, [form.heightFt, form.heightIn, form.weight]);

  const canNext = (() => {
    if (step === 1) {
      return !!form.state && !!form.firstName && !!form.lastName && /.+@.+\..+/.test(form.email) &&
        form.phone.replace(/\D/g, "").length >= 10 && form.sms !== "" &&
        (form.sms === "no" || form.smsTransactional);
    }
    if (step === 2) return !!form.sex && !!form.dob && !!form.heightFt && !!form.weight;
    if (step === 3) return form.conditions.length > 0 && form.pregnant !== "";
    if (step === 4) {
      return !!form.product && !!form.plan && form.password.length >= 8 && form.agree
        && !!form.address1 && !!form.city && /^\d{5}(-\d{4})?$/.test(form.zip.trim());
    }
    return false;
  })();

  async function next() {
    if (step < 4) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    // Final submit
    setSubmitError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/onboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: form.product, plan: form.plan,
          firstName: form.firstName, lastName: form.lastName,
          email: form.email, phone: form.phone,
          address1: form.address1, address2: form.address2,
          city: form.city, state: form.state, zip: form.zip,
          // Intake snapshot
          sex: form.sex, dob: form.dob,
          heightFt: form.heightFt, heightIn: form.heightIn,
          weight: form.weight, goalWeight: form.goalWeight,
          conditions: form.conditions, medications: form.medications,
          allergies: form.allergies, pregnant: form.pregnant,
          smsTransactional: form.smsTransactional, smsMarketing: form.smsMarketing,
          bmi,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setSubmitError(json.error || "Submission failed. Please try again.");
        return;
      }
      setOrderNumber(json.orderNumber);
      setDone(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setSubmitError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }
  function back() {
    if (step > 1) setStep(step - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (done) return <DonePage form={form} orderNumber={orderNumber} />;

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-slate-100">
        <div className="container h-16 flex items-center justify-center"><Logo /></div>
      </div>

      <div className="container max-w-2xl py-10">
        <Progress step={step} total={4} />

        <div className="mt-10">
          {step === 1 && <Step1 form={form} update={update} />}
          {step === 2 && <Step2 form={form} update={update} bmi={bmi} />}
          {step === 3 && <Step3 form={form} update={update} />}
          {step === 4 && <Step4 form={form} update={update} />}
        </div>

        <div className="mt-10 flex items-center justify-between">
          <button onClick={back} disabled={step === 1}
            className="inline-flex items-center gap-2 text-sm font-semibold text-ink-muted disabled:opacity-30 hover:text-brand">
            <ArrowLeft size={16} /> Back
          </button>
          <button onClick={next} disabled={!canNext || submitting}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
            {step === 4 ? (submitting ? "Submitting…" : "Submit") : "Continue"}{" "}
            <ArrowRight size={18} className="ml-1" />
          </button>
        </div>

        {submitError && (
          <div className="mt-4 rounded-md bg-rose-50 border border-rose-200 px-3 py-2 text-[13px] text-rose-700">
            {submitError}
          </div>
        )}

        <p className="mt-8 text-center text-xs text-ink-muted">
          By continuing you agree to our{" "}
          <Link href="/terms" className="underline">Terms</Link> and{" "}
          <Link href="/privacy" className="underline">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
}

/* ─── Step 1 ────────────────────────────────────────────────── */
function Step1({ form, update }: { form: Form; update: (p: Partial<Form>) => void }) {
  return (
    <div>
      <h1 className="text-3xl md:text-4xl font-extrabold text-center">Start your approval — tell us about you.</h1>

      <div className="mt-8 space-y-6">
        <div>
          <label className="label req">Which state do you live in?</label>
          <select className="input" value={form.state} onChange={(e) => update({ state: e.target.value })}>
            <option value="">Select your state</option>
            {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <p className="hint">This helps us connect you with a licensed provider in your state.</p>
        </div>

        <div>
          <label className="label req">What is your name?</label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <input className="input" value={form.firstName} onChange={(e) => update({ firstName: e.target.value })} />
              <p className="text-xs text-ink-muted mt-1">First Name</p>
            </div>
            <div>
              <input className="input" value={form.lastName} onChange={(e) => update({ lastName: e.target.value })} />
              <p className="text-xs text-ink-muted mt-1">Last Name</p>
            </div>
          </div>
        </div>

        <div>
          <label className="label req">What is your email address?</label>
          <input className="input" type="email" placeholder="example@example.com"
            value={form.email} onChange={(e) => update({ email: e.target.value })} />
        </div>

        <div>
          <label className="label req">
            Please enter the best phone number to reach you on just in case the doctor has any
            questions regarding your medical information.
          </label>
          <input className="input" placeholder="(000) 000-0000"
            value={form.phone} onChange={(e) => update({ phone: e.target.value })} />
        </div>

        <div>
          <label className="label req">
            Can we also send you text messages about your prescription including tracking
            information and refill information?
          </label>
          <YesNo value={form.sms} onChange={(v) => update({ sms: v })} />
        </div>

        <label className="flex items-start gap-3 text-xs text-ink-soft leading-relaxed">
          <input type="checkbox" className="mt-1 h-4 w-4" checked={form.smsTransactional}
            onChange={(e) => update({ smsTransactional: e.target.checked })} />
          <span>
            I agree to receive transactional text messages from MyFastRx at the number provided
            regarding appointment reminders, treatment updates, prescription notifications, and
            account alerts. Message frequency may vary. Message &amp; data rates may apply. Reply STOP
            to opt out. Reply HELP for help.*
          </span>
        </label>

        <label className="flex items-start gap-3 text-xs text-ink-soft leading-relaxed">
          <input type="checkbox" className="mt-1 h-4 w-4" checked={form.smsMarketing}
            onChange={(e) => update({ smsMarketing: e.target.checked })} />
          <span>
            I agree to receive recurring marketing text messages from MyFastRx at the number
            provided, including promotions and special offers. Consent is not a condition of
            purchase. Message frequency may vary. Message &amp; data rates may apply. Reply STOP to
            opt out. Reply HELP for help.
          </span>
        </label>
      </div>
    </div>
  );
}

/* ─── Step 2 ────────────────────────────────────────────────── */
function Step2({ form, update, bmi }: { form: Form; update: (p: Partial<Form>) => void; bmi: number | null }) {
  return (
    <div>
      <h1 className="text-3xl md:text-4xl font-extrabold text-center">A few basics about your health.</h1>

      <div className="mt-8 space-y-6">
        <div>
          <label className="label req">Sex assigned at birth</label>
          <div className="grid grid-cols-2 gap-3">
            {(["female","male"] as const).map((v) => (
              <button key={v} type="button" onClick={() => update({ sex: v })}
                className={`rounded-md border px-4 py-3 text-sm font-semibold capitalize transition
                  ${form.sex === v ? "border-brand bg-brand-50 text-brand" : "border-slate-300 hover:border-brand"}`}>
                {v}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="label req">Date of birth</label>
          <input type="date" className="input" value={form.dob} onChange={(e) => update({ dob: e.target.value })} />
        </div>

        <div>
          <label className="label req">Height</label>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <input className="input" inputMode="numeric" placeholder="5"
                value={form.heightFt} onChange={(e) => update({ heightFt: e.target.value })} />
              <span className="text-sm text-ink-muted">ft</span>
            </div>
            <div className="flex items-center gap-2">
              <input className="input" inputMode="numeric" placeholder="8"
                value={form.heightIn} onChange={(e) => update({ heightIn: e.target.value })} />
              <span className="text-sm text-ink-muted">in</span>
            </div>
          </div>
        </div>

        <div>
          <label className="label req">Current weight</label>
          <div className="flex items-center gap-2">
            <input className="input" inputMode="numeric" placeholder="180"
              value={form.weight} onChange={(e) => update({ weight: e.target.value })} />
            <span className="text-sm text-ink-muted">lbs</span>
          </div>
        </div>

        <div>
          <label className="label">Goal weight (optional)</label>
          <div className="flex items-center gap-2">
            <input className="input" inputMode="numeric" placeholder="160"
              value={form.goalWeight} onChange={(e) => update({ goalWeight: e.target.value })} />
            <span className="text-sm text-ink-muted">lbs</span>
          </div>
        </div>

        {bmi !== null && (
          <div className="rounded-xl border border-brand-100 bg-brand-50 p-4 text-sm text-ink-soft">
            Estimated BMI: <span className="font-bold text-brand">{bmi}</span>{" "}
            {bmi >= 27 ? "— you may qualify for GLP-1 therapy." : "— a provider will review eligibility."}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Step 3 ────────────────────────────────────────────────── */
function Step3({ form, update }: { form: Form; update: (p: Partial<Form>) => void }) {
  function toggle(c: string) {
    if (c === "None of the above") return update({ conditions: ["None of the above"] });
    const next = form.conditions.filter((x) => x !== "None of the above");
    update({ conditions: next.includes(c) ? next.filter((x) => x !== c) : [...next, c] });
  }
  return (
    <div>
      <h1 className="text-3xl md:text-4xl font-extrabold text-center">Tell us about your medical history.</h1>

      <div className="mt-8 space-y-6">
        <div>
          <label className="label req">Have you been diagnosed with any of the following? (select all that apply)</label>
          <div className="grid gap-2">
            {MEDICAL_CONDITIONS.map((c) => {
              const checked = form.conditions.includes(c);
              return (
                <label key={c} className={`flex items-center gap-3 rounded-md border px-4 py-3 text-sm cursor-pointer transition
                  ${checked ? "border-brand bg-brand-50" : "border-slate-200 hover:border-brand"}`}>
                  <input type="checkbox" className="h-4 w-4" checked={checked} onChange={() => toggle(c)} />
                  <span className="text-ink">{c}</span>
                </label>
              );
            })}
          </div>
        </div>

        <div>
          <label className="label">Are you currently taking any medications? (list them)</label>
          <textarea className="input min-h-[90px]" placeholder="e.g. Metformin 500mg, Lisinopril 10mg…"
            value={form.medications} onChange={(e) => update({ medications: e.target.value })} />
        </div>

        <div>
          <label className="label">Do you have any drug allergies?</label>
          <textarea className="input min-h-[80px]" placeholder="e.g. Penicillin, sulfa drugs… or 'None'"
            value={form.allergies} onChange={(e) => update({ allergies: e.target.value })} />
        </div>

        <div>
          <label className="label req">Are you currently pregnant, breastfeeding, or trying to become pregnant?</label>
          <YesNo value={form.pregnant} onChange={(v) => update({ pregnant: v })} />
        </div>
      </div>
    </div>
  );
}

/* ─── Step 4 ────────────────────────────────────────────────── */
function Step4({ form, update }: { form: Form; update: (p: Partial<Form>) => void }) {
  const product = form.product as Product | "";
  const plan = form.plan as Plan | "";
  const price = product && plan ? PRICING[product][plan] : null;

  return (
    <div>
      <h1 className="text-3xl md:text-4xl font-extrabold text-center">Choose your treatment & create your account.</h1>

      <div className="mt-8 space-y-6">
        <div>
          <label className="label req">Preferred medication</label>
          <div className="grid gap-3 md:grid-cols-2">
            {([
              { id: "semaglutide", name: "Semaglutide", from: 99, normal: 169 },
              { id: "tirzepatide", name: "Tirzepatide", from: 179, normal: 249 },
            ] as const).map((p) => (
              <button type="button" key={p.id} onClick={() => update({ product: p.id })}
                className={`text-left rounded-xl border p-5 transition ${form.product === p.id ? "border-brand bg-brand-50" : "border-slate-200 hover:border-brand"}`}>
                <p className="font-bold text-lg">{p.name}</p>
                <p className="text-xs text-ink-muted">Compounded GLP-1</p>
                <p className="mt-2 text-2xl font-extrabold text-brand">From ${p.from}<span className="text-sm font-medium text-ink-muted">/mo</span></p>
                <p className="text-xs text-ink-muted line-through">${p.normal}/mo</p>
              </button>
            ))}
          </div>
        </div>

        {product && (
          <div>
            <label className="label req">Plan length</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {(["1","3","6","12"] as const).map((m) => (
                <button key={m} type="button" onClick={() => update({ plan: m })}
                  className={`rounded-md border px-3 py-3 text-sm font-semibold transition
                    ${form.plan === m ? "border-brand bg-brand text-white" : "border-slate-300 hover:border-brand"}`}>
                  {m} mo · ${PRICING[product][m]}/mo
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="rounded-xl border border-slate-200 p-5 space-y-4">
          <p className="text-[13px] font-bold uppercase tracking-wide text-[#6b7280]">
            Shipping address (cash on delivery)
          </p>
          <div>
            <label className="label req">Street address</label>
            <input className="input" placeholder="123 Main St"
              value={form.address1} onChange={(e) => update({ address1: e.target.value })} />
          </div>
          <div>
            <label className="label">Apt / suite (optional)</label>
            <input className="input" placeholder="Apt 4B"
              value={form.address2} onChange={(e) => update({ address2: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label req">City</label>
              <input className="input"
                value={form.city} onChange={(e) => update({ city: e.target.value })} />
            </div>
            <div>
              <label className="label req">ZIP</label>
              <input className="input" placeholder="12345" inputMode="numeric"
                value={form.zip} onChange={(e) => update({ zip: e.target.value })} />
            </div>
          </div>
          <p className="text-[12px] text-[#6b7280]">
            Shipping to <span className="font-semibold text-[#212322]">{form.state || "—"}</span>.
            You can update the address before fulfillment.
          </p>
        </div>

        <div>
          <label className="label req">Create a password</label>
          <input type="password" className="input" placeholder="At least 8 characters"
            value={form.password} onChange={(e) => update({ password: e.target.value })} />
        </div>

        <label className="flex items-start gap-3 text-xs text-ink-soft">
          <input type="checkbox" className="mt-1 h-4 w-4" checked={form.agree}
            onChange={(e) => update({ agree: e.target.checked })} />
          <span>
            I confirm the information above is accurate and I consent to Telehealth services,
            the Privacy Policy, HIPAA Notice and Terms of Use.
          </span>
        </label>

        {price && (
          <div className="rounded-xl bg-slate-50 p-5 text-sm">
            <p className="font-bold capitalize text-ink">{form.product} — {form.plan} month plan</p>
            <p className="mt-1 text-ink-soft">Billed today: <span className="font-bold text-brand">${price}/mo</span> · Free shipping · Cancel anytime</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Done screen ───────────────────────────────────────────── */
function DonePage({ form, orderNumber }: { form: Form; orderNumber: string | null }) {
  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-slate-100">
        <div className="container h-16 flex items-center justify-center"><Logo /></div>
      </div>
      <div className="container max-w-xl py-20 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-brand">
          <CheckCircle2 size={36} />
        </div>
        <h1 className="mt-6 text-3xl md:text-4xl font-extrabold">You&apos;re all set, {form.firstName || "friend"}!</h1>
        <p className="mt-4 text-ink-soft">
          Your information has been submitted. A licensed provider in <span className="font-semibold">{form.state}</span> will
          review your case and contact you within 24 hours.
        </p>
        {orderNumber && (
          <p className="mt-4 inline-block rounded-md bg-brand-50 px-3 py-1.5 text-[13px] text-brand font-bold">
            Order # {orderNumber}
          </p>
        )}
        <div className="mt-8 grid gap-3 text-left">
          {[
            { icon: Stethoscope, t: "Doctor review", d: "A licensed U.S. physician reviews your medical history." },
            { icon: BadgeCheck, t: "Prescription written", d: "If approved, your prescription is sent to our partner pharmacy." },
            { icon: Truck, t: "Discreet shipping", d: "Your medication arrives in plain, unmarked packaging — free." },
          ].map((s, i) => (
            <div key={i} className="flex items-start gap-3 rounded-xl border border-slate-100 p-4">
              <s.icon className="text-brand mt-0.5" size={20} />
              <div>
                <p className="font-semibold">{s.t}</p>
                <p className="text-sm text-ink-muted">{s.d}</p>
              </div>
            </div>
          ))}
        </div>
        <Link href="/" className="btn-outline mt-10 inline-flex">Back to home</Link>
      </div>
    </div>
  );
}
