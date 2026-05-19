import { redirect } from "next/navigation";

// All-orders shortcut just redirects to dashboard for now (same view).
export default function AllOrdersPage() {
  redirect("/admin");
}
