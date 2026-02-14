import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-navy-light border-t border-gold/10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-heading text-xl text-gold mb-4">9BALLSHOP</h3>
            <p className="text-cream/60 text-sm leading-relaxed">
              Premium billiards equipment for serious players. Curated by Marios Komninakis.
            </p>
          </div>
          <div>
            <h4 className="text-cream font-semibold mb-4 text-sm uppercase tracking-wider">Shop</h4>
            <ul className="space-y-2">
              {["Cues", "Shafts", "Balls", "Gloves", "Cases", "Accessories"].map((cat) => (
                <li key={cat}>
                  <Link href={`/shop?category=${cat}`} className="text-cream/50 hover:text-gold text-sm transition-colors">
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-cream font-semibold mb-4 text-sm uppercase tracking-wider">Company</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-cream/50 hover:text-gold text-sm transition-colors">About</Link></li>
              <li><Link href="/blog" className="text-cream/50 hover:text-gold text-sm transition-colors">Blog</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-cream font-semibold mb-4 text-sm uppercase tracking-wider">Connect</h4>
            <ul className="space-y-2">
              <li><a href="https://medium.com/@marioskomninakis" target="_blank" rel="noopener noreferrer" className="text-cream/50 hover:text-gold text-sm transition-colors">Medium</a></li>
              <li><a href="https://9ballshop.com" target="_blank" rel="noopener noreferrer" className="text-cream/50 hover:text-gold text-sm transition-colors">9ballshop.com</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gold/10 mt-8 pt-8 text-center">
          <p className="text-cream/40 text-sm">&copy; {new Date().getFullYear()} 9BallShop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
