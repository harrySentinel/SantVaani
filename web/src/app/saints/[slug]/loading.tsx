export default function Loading() {
  return (
    <div className="min-h-screen font-mukta bg-[#faf8f5] animate-pulse">
      <div className="hidden md:block h-16" />
      <div className="md:max-w-6xl md:mx-auto md:px-8 md:pt-10 md:grid md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-14">
        <div className="w-full h-[68vh] min-h-[420px] max-h-[620px] md:h-auto md:max-h-none md:aspect-[4/5] md:rounded-3xl bg-[#f1e7d8]" />
        <div className="px-5 md:px-0 pt-8 md:pt-0 space-y-4">
          <div className="h-10 w-2/3 rounded-full bg-[#f1e7d8]" />
          <div className="h-5 w-1/3 rounded-full bg-[#f1e7d8]" />
          <div className="mt-8 grid grid-cols-2 gap-3">
            <div className="h-16 rounded-2xl bg-[#f1e7d8]" />
            <div className="h-16 rounded-2xl bg-[#f1e7d8]" />
          </div>
          <div className="mt-6 space-y-3">
            <div className="h-4 w-full rounded-full bg-[#f1e7d8]" />
            <div className="h-4 w-5/6 rounded-full bg-[#f1e7d8]" />
            <div className="h-4 w-2/3 rounded-full bg-[#f1e7d8]" />
          </div>
        </div>
      </div>
    </div>
  );
}
