import Link from "next/link";

export default function CheckoutSuccessPage() {
  return (
    <div className="bg-navy min-h-screen flex items-center justify-center">
      <div className="max-w-md mx-auto px-4 text-center">
        <div className="w-16 h-16 bg-emerald/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-emerald" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="font-heading text-3xl text-cream mb-4">Thank You!</h1>
        <p className="text-cream/60 mb-8">
          Your order has been placed successfully. You will receive a confirmation email shortly.
        </p>
        <Link
          href="/shop"
          className="bg-gold hover:bg-gold-light text-navy font-semibold px-8 py-3 rounded transition-colors text-sm uppercase tracking-wider"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
