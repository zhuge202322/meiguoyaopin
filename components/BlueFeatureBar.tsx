import { Stethoscope, Truck, Lock, BadgeCheck } from "lucide-react";

const ITEMS = [
  { icon: BadgeCheck, label: "US-licensed healthcare providers" },
  { icon: Truck, label: "Free shipping on all prescriptions" },
  { icon: Lock, label: "Confidential online consultation" },
  { icon: Stethoscope, label: "Doctor-guided treatment plans" },
];

export default function BlueFeatureBar() {
  const track = [...ITEMS, ...ITEMS, ...ITEMS];
  return (
    <div className="bg-[#1E7FFF] text-white overflow-hidden">
      <div className="flex whitespace-nowrap py-4">
        <div className="flex shrink-0 animate-marquee-slow">
          {track.map((it, i) => (
            <span key={`a-${i}`} className="flex items-center px-8 text-[14px] font-medium">
              <it.icon size={18} className="mr-2 opacity-90" />
              {it.label}
            </span>
          ))}
        </div>
        <div className="flex shrink-0 animate-marquee-slow" aria-hidden="true">
          {track.map((it, i) => (
            <span key={`b-${i}`} className="flex items-center px-8 text-[14px] font-medium">
              <it.icon size={18} className="mr-2 opacity-90" />
              {it.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
