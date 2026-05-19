const ITEMS = [
  "Doctor consultation & free express shipping included",
  "Limited time: Semaglutide from $99/mo*",
  "Limited time: Tirzepatide from $179/mo*",
  "All doses, one flat price",
];

function Pulse() {
  return (
    <svg viewBox="0 0 32 16" className="inline-block h-3 w-7 mx-3 align-middle" aria-hidden="true">
      <polyline
        points="0,8 8,8 11,3 15,13 19,6 23,10 27,8 32,8"
        fill="none"
        stroke="#7DB3FF"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function PromoBar() {
  // Two identical tracks side-by-side; animate -50% for seamless loop
  const track = [...ITEMS, ...ITEMS, ...ITEMS];
  return (
    <div className="bg-navy text-white text-[13px] font-medium overflow-hidden">
      <div className="flex whitespace-nowrap py-[18px]">
        <div className="flex shrink-0 animate-marquee">
          {track.map((t, i) => (
            <span key={`a-${i}`} className="flex items-center px-2">
              <Pulse />
              <span className="tracking-wide">{t}</span>
            </span>
          ))}
        </div>
        <div className="flex shrink-0 animate-marquee" aria-hidden="true">
          {track.map((t, i) => (
            <span key={`b-${i}`} className="flex items-center px-2">
              <Pulse />
              <span className="tracking-wide">{t}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
