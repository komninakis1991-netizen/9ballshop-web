import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="bg-navy min-h-screen">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(212,168,67,0.06)_0%,transparent_60%)]" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-gold/60 text-xs uppercase tracking-[0.3em] mb-3">The Story</p>
          <h1 className="font-heading text-4xl md:text-5xl text-cream mb-6">About Marios</h1>
          <p className="text-cream/50 text-lg">
            From the pool halls of Athens to building a global billiards brand.
          </p>
        </div>
      </section>

      {/* Bio */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-20">
        <div className="space-y-8 text-cream/70 leading-relaxed text-lg">
          <p>
            Marios Komninakis grew up in Greece with a cue in his hand and a dream that stretched
            far beyond the Mediterranean. From a young age, billiards wasn&apos;t just a game &mdash;
            it was a discipline, a language, and ultimately, a way of life.
          </p>
          <p>
            With nothing but determination and a deep love for the sport, Marios made the
            bold move from Greece to the United States, building connections and a reputation
            in the competitive billiards world. That journey &mdash; navigating a new country
            without money or connections &mdash; shaped his philosophy: that mastery comes through
            discipline, resilience, and an unwavering commitment to excellence.
          </p>

          <div className="py-8 border-y border-gold/10">
            <h2 className="font-heading text-2xl text-cream mb-6">The 9BallShop Vision</h2>
            <p>
              9BallShop was born from Marios&apos;s frustration with the lack of curated,
              high-quality billiards equipment available online. Too many shops offer everything
              without expertise. 9BallShop is different &mdash; every product is personally
              selected and tested by someone who has spent thousands of hours at the table.
            </p>
          </div>

          <div>
            <h2 className="font-heading text-2xl text-cream mb-6">Beyond the Table</h2>
            <p>
              Marios is also a passionate writer and thinker. His articles on Medium explore
              topics ranging from mental preparation and discipline to personal stories of
              transformation. He believes that the lessons learned at the billiards table &mdash;
              patience, precision, strategic thinking &mdash; apply to every aspect of life.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-8">
            <div className="bg-navy-light border border-gold/10 rounded-lg p-6 text-center">
              <p className="text-gold font-heading text-3xl mb-2">15+</p>
              <p className="text-cream/40 text-sm uppercase tracking-wider">Years Playing</p>
            </div>
            <div className="bg-navy-light border border-gold/10 rounded-lg p-6 text-center">
              <p className="text-gold font-heading text-3xl mb-2">60+</p>
              <p className="text-cream/40 text-sm uppercase tracking-wider">Products Curated</p>
            </div>
            <div className="bg-navy-light border border-gold/10 rounded-lg p-6 text-center">
              <p className="text-gold font-heading text-3xl mb-2">7</p>
              <p className="text-cream/40 text-sm uppercase tracking-wider">Articles Published</p>
            </div>
          </div>

          <div className="text-center pt-8">
            <h2 className="font-heading text-2xl text-cream mb-6">Connect with Marios</h2>
            <div className="flex gap-4 justify-center flex-wrap">
              <a
                href="https://medium.com/@marioskomninakis"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-gold/30 hover:border-gold text-gold px-6 py-3 rounded transition-colors text-sm uppercase tracking-wider"
              >
                Medium
              </a>
              <a
                href="https://9ballshop.com"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-gold/30 hover:border-gold text-gold px-6 py-3 rounded transition-colors text-sm uppercase tracking-wider"
              >
                9ballshop.com
              </a>
              <Link
                href="/blog"
                className="bg-gold hover:bg-gold-light text-navy font-semibold px-6 py-3 rounded transition-colors text-sm uppercase tracking-wider"
              >
                Read Blog
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
