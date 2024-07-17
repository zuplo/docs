export default function Badge({
  title,
  className,
}: {
  className: string;
  title: string;
}) {
  return (
    <div
      className={`inline-block ${className} text-xs font-semibold px-3 py-1 rounded-full`}
    >
      {title}
    </div>
  );
}
