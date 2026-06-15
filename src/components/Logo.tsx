import Image from "next/image";

export default function Logo({
  compact = false,
  className = "",
}: {
  compact?: boolean;
  className?: string;
}) {
  if (compact) {
    return (
      <span className={`flex items-center gap-2 ${className}`}>
        <Image
          src="/silverlink-mark.svg"
          alt=""
          width={40}
          height={40}
          priority
          className="h-10 w-10 shrink-0"
        />
        <span className="text-xl font-extrabold tracking-tight text-stone-950">
          Silver<span className="text-brand-700">Link</span>
        </span>
      </span>
    );
  }

  return (
    <Image
      src="/silverlink-logo.svg"
      alt="SilverLink"
      width={215}
      height={75}
      priority
      style={{ height: "auto" }}
      className={className}
    />
  );
}
