export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <span className="text-2xl font-bold text-emerald-600">Find</span>
      <span className="text-2xl font-bold text-gray-900">IT</span>
    </div>
  );
}
