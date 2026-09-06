export default function HelpPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="font-display mb-6 text-2xl font-semibold text-navy">Help Center</h1>

      <div className="space-y-6">
        <div>
          <h2 className="font-semibold text-navy">How do I place an order?</h2>
          <p className="mt-1 text-sm text-slate-body">
            Browse the shop, add items to your cart, then proceed to checkout. You&apos;ll enter
            your delivery address and pay with Mobile Money or card via Paystack.
          </p>
        </div>
        <div>
          <h2 className="font-semibold text-navy">How long does delivery take?</h2>
          <p className="mt-1 text-sm text-slate-body">
            We deliver across Accra within the same week your order is placed.
          </p>
        </div>
        <div>
          <h2 className="font-semibold text-navy">How can I track my order?</h2>
          <p className="mt-1 text-sm text-slate-body">
            Check the status of your orders anytime under My Account in your account menu.
          </p>
        </div>
        <div>
          <h2 className="font-semibold text-navy">Need more help?</h2>
          <p className="mt-1 text-sm text-slate-body">
            Reach out to us and we&apos;ll get back to you as soon as we can.
          </p>
        </div>
      </div>
    </div>
  );
}