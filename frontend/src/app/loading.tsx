import Image from "next/image";

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-12 transition-opacity duration-300">
      <div className="relative flex flex-col items-center">
        <div className="relative flex h-24 w-24 items-center justify-center">
          {/* Central Logo */}
          <Image
            src="/icon.png"
            alt="Loading..."
            width={56}
            height={56}
            className="animate-pulse object-contain drop-shadow-sm"
            priority
          />
          {/* Outer Spinning Ring */}
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-accent-soft border-t-accent opacity-90" />
        </div>

        <h3 className="mt-8 text-base font-semibold tracking-wider text-ink animate-pulse uppercase">
          Loading FIFA One Point
        </h3>
        <p className="mt-1 text-xs text-muted font-medium tracking-widest uppercase opacity-70">
          World Cup 2026
        </p>
      </div>
    </div>
  );
}
