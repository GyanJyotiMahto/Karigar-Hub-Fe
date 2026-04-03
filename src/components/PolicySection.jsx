// Static legal content layout component (can be updated later)

export function PolicySection({ number, title, children }) {
  return (
    <div className="mb-8">
      <h2 className="font-display text-xl font-bold text-[#2C1A0E] mb-3 flex items-start gap-3">
        {number && (
          <span className="shrink-0 w-7 h-7 rounded-full bg-[#C0522B]/10 text-[#C0522B] text-sm font-bold flex items-center justify-center mt-0.5">
            {number}
          </span>
        )}
        {title}
      </h2>
      <div className="pl-10 text-[#5C3317] text-sm leading-relaxed space-y-2">
        {children}
      </div>
    </div>
  );
}

export function PolicyList({ items }) {
  return (
    <ul className="space-y-1.5">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2">
          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#C0522B] shrink-0" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
