import Link from "next/link";

export default function Logo({
  className = "",
  width = 180,
}: {
  className?: string;
  width?: number;
}) {
  return (
    <Link href="/" className={`inline-block ${className}`} aria-label="MyFastRx home">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/logo-myfastrx-1.png"
        srcSet="/images/logo-myfastrx-1-300x94.png 300w, /images/logo-myfastrx-1.png 454w"
        sizes={`${width}px`}
        width={width}
        height={Math.round((width * 142) / 454)}
        alt="MyFastRx"
        className="block h-auto w-auto"
        style={{ maxWidth: width }}
        loading="eager"
      />
    </Link>
  );
}
