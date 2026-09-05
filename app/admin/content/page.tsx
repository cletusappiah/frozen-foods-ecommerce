export default function AdminContentPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display mb-2 text-2xl font-semibold text-navy">Content</h1>
      <p className="mb-6 text-sm text-navy/60">
        Homepage banner text and copy are currently set directly in the code
        (in <code className="rounded bg-navy/5 px-1">app/page.tsx</code>). A
        proper editable version - where you change this text right here and
        it updates the live site - is a good next feature to add once the
        store is running.
      </p>
      <div className="rounded-2xl border border-navy/10 bg-white p-5 shadow-sm">
        <h2 className="font-display mb-2 text-sm font-semibold text-navy/70">Current homepage headline</h2>
        <p className="text-navy">"Skip the sunrise trip to the port."</p>
      </div>
    </div>
  );
}
