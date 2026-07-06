export default function Loader({ label = "लोड हुँदैछ..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-3">
      <div className="w-10 h-10 border-4 border-ink/15 border-t-sindoor rounded-full animate-spin" />
      <p className="text-slate text-sm font-utility tracking-wide">{label}</p>
    </div>
  );
}
