import Link from "next/link";
export default function Footer() {
  return (
    <footer className="mt-16 border-t border-navy/10 bg-navy text-white/70">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-8">
          <div>
            <h3 className="font-display text-lg font-semibold text-white">Port-Fresh</h3>
            <p className="mt-2 text-sm">
              Frozen foods straight from the port, delivered to your door across Accra.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">Shop</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/shop" className="hover:text-white">
                  All products
                </Link>
              </li>
              <li>
                <Link href="/shop/cart" className="hover:text-white">
                  Cart
                </Link>
              </li>
              <li>
                <Link href="/shop/account/orders" className="hover:text-white">
                  My orders
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">Company</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-white">
                  About us
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-white">
                  Contact us
                </Link>
              </li>
              <li>
                <Link href="/help" className="hover:text-white">
                  Help center
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">We deliver with care</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li>Cold-chain packaging</li>
              <li>Pay with Mobile Money or Card</li>
              <li>Same-week delivery in Accra</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs sm:mt-10 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} Port-Fresh Frozen Foods. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/" className="hover:text-white">
              Terms &amp; Conditions
            </Link>
            <Link href="/" className="hover:text-white">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}