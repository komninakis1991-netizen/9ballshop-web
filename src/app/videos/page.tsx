"use client";

import { useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";

interface Video {
  id: string;
  title: string;
}

const categories: { key: string; labelKey: "matches" | "interviews" | "psychologyOfPool" | "vlogs"; videos: Video[] }[] = [
  {
    key: "matches",
    labelKey: "matches",
    videos: [
      { id: "mTwRytcA_sM", title: "Marios Komninakis vs Damianos Gialourakis - Argos Greek Open 2025" },
      { id: "e9nsWqqm764", title: "Marios Komninakis vs Christos Davetas - Argos Greek Open 2025" },
      { id: "VVgulEM5krk", title: "George Antonakis vs Marios Komninakis - Semi Final Argos Greek Open 2025" },
      { id: "SmcOfuuVpV0", title: "Marios Komninakis vs Thanos Dimoulias - Argos Greek Open 2025" },
      { id: "IlhFWNe0tJ0", title: "Komninakis vs Grigoris Spithouris - Patra Open" },
      { id: "HoI-uxSYsJY", title: "Marios Komninakis vs Grigoris Spithouris - Patra Open (fast version)" },
      { id: "4ZEOVfryCIg", title: "Marios Komninakis vs Harun Erbet - Zeki Open International 9ball" },
      { id: "lKxDuYUQb58", title: "Komninakis vs Kazakis - 2nd Round Different Athens Open" },
      { id: "-uh3s6f3zQk", title: "Wolfgang's Open Last 16 - Komninakis vs Papadopoulos (Falcao)" },
      { id: "fha5nh32JW4", title: "Wolfgang's Open Last 16 Knockout - Komninakis vs Vaggelis Gkremos" },
      { id: "v8KJdk9fbzA", title: "Marios Komninakis vs Giorgos Loisios - Final A' Division Open Megara" },
      { id: "OHG2WqerTQM", title: "Marios Komninakis vs Vaggelis Seidis - Quarter Finals A' Division Open Megara" },
      { id: "iq65HYMXpao", title: "Marios Komninakis vs Manos Spiridakis - Round 3 A' Division Open Megara" },
      { id: "jsVfd6Nifcw", title: "Marios Komninakis vs Giorgos Loisios - 2nd Round A' Division Open Megara" },
      { id: "yhTBDOvkoBQ", title: "Marios Komninakis vs Thanos Dimoulias - Round 1 Megara A' Division Open" },
      { id: "TaiMnMDEah8", title: "Komninakis vs Loisios - 10ball Race to 8" },
      { id: "yYVQSShiheU", title: "Marios Komninakis vs George Loisios - 10ball Race to 8" },
      { id: "PrLc0uWxLSw", title: "Marios Komninakis vs George Loisios - 10ball Race to 8" },
      { id: "UH4KgoJS1us", title: "Marios Komninakis vs George Loisios - 9ball (Winner Breaks 4\" Pockets)" },
      { id: "moPPgk1doec", title: "Marios Komninakis vs George Loisios - 9ball Race to 9 (Winner Breaks 4\" Pockets)" },
      { id: "M0ro-WZplmA", title: "Marios Komninakis vs Dimitris Karpouzelis - 9ball (Winner Breaks 4\" Pockets)" },
      { id: "xsrA2DTrVfM", title: "Marios Komninakis vs Menelaos Lolas - A' Invitational Cueniversity Race to 11" },
      { id: "ZKkoVWsRfys", title: "Marios Komninakis vs Dimitris Karpouzelis - 9ball Race to 9" },
      { id: "lKuKCCT1D_0", title: "Marios Komninakis vs Dimitris Karpouzelis - 9ball" },
      { id: "GTM_xJYozo8", title: "Marios Komninakis vs Qaed Alotaibi - 10ball World Cup Qualification" },
      { id: "q6yp6PNMN04", title: "Marios Komninakis vs Diliyan Tiklev - Longoni Open Sofia Balkan Pool Tour" },
      { id: "Hz6oSmQfP8c", title: "Marios Komninakis vs Dimitris Strevinas - 9ball Open Jouet" },
      { id: "O-nxTZFA6b0", title: "Marios Komninakis vs Joyme Vicente - Banana's Billiards San Antonio Texas" },
      { id: "Ms-51HOrM-8", title: "Lazaro Martinez vs Marios Komninakis - Betsy's Austin Texas" },
      { id: "kA4LJivGxrE", title: "Marios Komninakis vs Ben Satchel - Hall of Fame A Division" },
      { id: "VedRPNVIrZ0", title: "Marios Komninakis vs Greg Spithouris - Hall of Fame A Division" },
      { id: "qKcBlGCUXIw", title: "Marios Komninakis vs Jarrett Newman - Banana's Billiards San Antonio Texas" },
      { id: "LOVri9WAfbk", title: "Marios Komninakis vs Rudy Sanchez - Banana's Billiards San Antonio Texas" },
      { id: "5OY7g0OVvGs", title: "Alex Kazakis vs Marios Komninakis - 9ball Race to 7 Practice Session #8" },
      { id: "nWhW07Zywew", title: "Alex Kazakis vs Marios Komninakis - 9ball Race to 7 Practice Session #7" },
      { id: "gzSzDjAogPA", title: "Alex Kazakis vs Marios Komninakis - 9ball Race to 7 Practice Session #6" },
      { id: "4TEv8iUZ5ug", title: "Alex Kazakis vs Marios Komninakis - 10ball Race to 7 Practice Session #5" },
      { id: "qvgnpkQaiU8", title: "Alex Kazakis vs Marios Komninakis - 10ball Race to 7 Practice Session #4" },
      { id: "ANzVWjIWIug", title: "Alex Kazakis vs Marios Komninakis - 9ball Race to 5 Practice Session #3" },
      { id: "oEqCb72L2Is", title: "Alex Kazakis vs Marios Komninakis - 9ball Race to 5 Practice Session #2" },
      { id: "6T15sxtE5bU", title: "Alex Kazakis vs Marios Komninakis - 9ball Race to 5 Practice Session #1" },
      { id: "zMiqniA2CJ4", title: "Marios Komninakis vs Antonis Kakaris - Dynamic 9ball Open Argos" },
      { id: "aVewKcABpEA", title: "Marios Komninakis vs Christos Davetas - Rhodes A Division 9ball Open" },
      { id: "I8eT4jsjRQo", title: "Marios Komninakis vs Manos Spyridakis - Hall of Fame A Division Final" },
      { id: "4q0e39-Dvbc", title: "Marios Komninakis vs George Antonakis - 10ball Race to 8 Practice Session #2" },
      { id: "DH86yA1AE3E", title: "Marios Komninakis vs George Antonakis - 10ball Race to 8 Practice Session #1" },
      { id: "chbNisL2Pi4", title: "Komninakis vs Vasilakos - Daily Tournament Hall of Fame" },
      { id: "v3eHXNnBqvg", title: "Marios Komninakis vs Yannis Harlaftis - Patra 9ball Open Poolevard 2023" },
      { id: "RGFgCgPUBpI", title: "Marios Komninakis vs Petros Andrikopoulos - Argos 9ball Open 2023" },
      { id: "E8KiqvV0SJQ", title: "Marios Komninakis vs Christos Davetas - Argos 9ball Open 2023" },
      { id: "3oAbDn4zefc", title: "Marios Komninakis vs Toma Fation - Safe Billiards Christmas Handicap" },
      { id: "0o-Dbt0YPHE", title: "Marios Komninakis vs Diliyan Tiklev - Billiard Center A Division 9ball Open 2023" },
      { id: "Zoa0T9DZT1Q", title: "Marios Komninakis vs Fotis Demousis - Roger's 9ball Open B Category Final 2016" },
      { id: "Hd5AazJ5hW4", title: "Marios Komninakis vs Gannon Brown - 9ball Bar Table Tournament Oklahoma 2022" },
      { id: "DmYTiJFC9kQ", title: "Marios Komninakis - Bar Table 9ball Tournament Oklahoma 2022" },
      { id: "n_ukcb7lgJA", title: "Marios Komninakis vs Christos Davetas - Roger's B Category Open 2015" },
      { id: "ub8f_TL2UKU", title: "Marios Komninakis vs Alexander Kontaroudis - Roger's B Category Open 2015" },
      { id: "CkDaRjWH2D0", title: "Marios Komninakis vs Menelaos Lolas - PRINCE OF POOL Lamia 9ball Open 2023" },
      { id: "vFC42zvFfYg", title: "Marios Komninakis vs Marios Monokrousos - Roger's 10ball Open 2015" },
      { id: "_5OOPg2hYOA", title: "Marios Komninakis vs John Hondrogiannis - PRINCE OF POOL Lamia 9ball Open 2023" },
      { id: "vJ2n0DtY0Fo", title: "Marios Komninakis vs Christos Davetas - Billiard Center 9ball Open Thessaloniki" },
      { id: "mWGGZq6PvbE", title: "Marios Komninakis vs Spasian Spasov - Billiard Center 9ball Open Thessaloniki" },
      { id: "F1vQP_NDupI", title: "Marios Komninakis vs Martin Savov - Billiard Center 9ball Open Thessaloniki" },
      { id: "QSMc9PwA4IY", title: "Marios Komninakis vs Mitch Ellerman - Griff's Las Vegas" },
      { id: "rciZR4FITkI", title: "Bet $200 on the 7-Ball in Oklahoma" },
      { id: "JgENoHai-Fo", title: "Komninakis vs Gioldasis - 9ball Handicap Tournament" },
      { id: "Thp1NhG2ULo", title: "Marios Komninakis vs Spyros Katsoufris - Master's 9ball Open" },
      { id: "PJttDY29i_s", title: "Marios Komninakis vs Tsounakas - Master's 9ball Open" },
      { id: "tYqMfai7uws", title: "Marios Komninakis - National Championship Straight Pool 2020" },
      { id: "4uj3I9xa7XI", title: "17 Year Old Marios Komninakis vs Irina - 9ball Handicap Tournament" },
      { id: "VcItoCpAId0", title: "The Last Game 8-8" },
      { id: "cpiCiKdUUsA", title: "Step by Step Breakdown of a 9ball Runout" },
      { id: "FBxFCM2JJHo", title: "Komninakis Highlights" },
      { id: "xZ0nDa-KC9c", title: "9ball Runout" },
      { id: "AK_wQP9CIPA", title: "Masse Shot" },
      { id: "hNrn0V7efgo", title: "Komninakis Runouts Compilation" },
      { id: "abVpARfvjOg", title: "15 Year Old Marios Komninakis Playing Billiards" },
      { id: "CTnANgPcrKg", title: "Playing 9ball Pool in the US" },
      { id: "NPytJPu5Jis", title: "8 Ball Break - 6 Balls Down" },
      { id: "OR2nBDHLigc", title: "Pool Training - 97 Balls Runout" },
      { id: "i5dl2leYCz0", title: "Match Commentary vs Mitch Ellerman" },
    ],
  },
  {
    key: "interviews",
    labelKey: "interviews",
    videos: [
      { id: "tfgF8duoqwg", title: "KomniTalks: Alex Kazakis Interview (+Eng Subs)" },
      { id: "2eZIVtqaVGs", title: "KomniTalks: Money, Achieving Goals & Developing Your Abilities" },
      { id: "Y3abR7yH1ec", title: "KomniTalks: Fitness, Addictions, Challenges & Personal Growth" },
      { id: "AaHwUgFVeR8", title: "Conversation with a Former Fugitive Lifer (from Livestream)" },
    ],
  },
  {
    key: "psychology",
    labelKey: "psychologyOfPool",
    videos: [
      { id: "dK-NYnWvIyQ", title: "How to Learn Pool: 5 Tips to Improve Your Game" },
      { id: "ysTElGuJBBY", title: "How to Handle Wins and Losses, in Pool and in Life" },
      { id: "YphtHOV3qyM", title: "Negative Thoughts & Psychology During Matches" },
      { id: "wZOE7Zivmv0", title: "Consistency: The 5 Factors That Affect It" },
      { id: "X_mB_dHZ5PE", title: "Confidence: 5 Ways to Boost It for Better Match Performance" },
      { id: "vKvR5E9OrFk", title: "Luck in Pool" },
      { id: "eSpf7MPL6Bc", title: "Concentration: How to Improve Your Focus" },
      { id: "rEnqWPpBaW4", title: "Fitness: What Role Does It Play in Pool?" },
      { id: "I7FBJny_No8", title: "7 Traits of Champions" },
      { id: "OriPUcDMYOA", title: "Q&A: Managing Opponents & Psychology in Official Matches" },
      { id: "f7BBz2Y61FA", title: "How Habits Work & Their Relationship to Self-Esteem" },
      { id: "Iky3FingTQs", title: "The Benefits of Dedicating Your Life to a Goal" },
      { id: "jukNLk6FRrI", title: "The Risk of Decisions & The Reward of Discipline" },
      { id: "M3upkPO8k-4", title: "Gambling: How I Got Hooked & What I Did to Quit" },
    ],
  },
  {
    key: "vlogs",
    labelKey: "vlogs",
    videos: [
      { id: "5vIzBqq6wxA", title: "How I Went to America for 3 Months with No Money - Part 1" },
      { id: "QaKZn_yfRDw", title: "How I Ended Up in Texas & What I Did to Survive - Part 2" },
      { id: "bkRKES_cPSU", title: "Back to America with a Suitcase and a Cue - Part 3: The Return" },
      { id: "NdOWNiO6tpI", title: "3rd Time in America, with a Suitcase and a Cue for 2 Months" },
      { id: "iZfZ_L0ezx0", title: "How I Went to the US for 3 Months with No Money (+Eng Subs)" },
      { id: "OZXND7eLF1c", title: "I Went to America with No Money, Lived Through Pool (+Eng Subs) Part 2" },
      { id: "H4ShBWMGotk", title: "Pool in the Bars of Texas" },
      { id: "-mXF2jFYDcA", title: "Starting Billiards: The Early Years & The Road to Nationals" },
      { id: "c5fac3w9oO0", title: "Vlog: 10ball World Championship in Doha, Qatar 2024 (+Eng Subs)" },
      { id: "-dP8El45ajI", title: "Vlog: European Pool Championship in Turkey (+Eng Subs)" },
      { id: "i5e_QIyIsEg", title: "KomniVlog: Morocco Open Tournament Experience (+Eng Subs)" },
      { id: "rBSz02osbkE", title: "KomniTalks Vlog: Pool Tournament in Morocco - WNT Morocco Open (+Eng Subs)" },
      { id: "D_rc1Xkqp7Q", title: "KomniTalks Vlog: Pool Tournament in Sofia - Longoni 9ball Open Balkan Pool Tour" },
      { id: "wBbOyI5YNS4", title: "9ball Open at Jouet Ioannina - Review" },
      { id: "JJSzpvPL5-s", title: "What's in My Cue Case" },
    ],
  },
];

export default function VideosPage() {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState("matches");
  const [playing, setPlaying] = useState<string | null>(null);

  const currentCategory = categories.find((c) => c.key === activeCategory)!;

  return (
    <div className="bg-navy min-h-screen">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <p className="text-gold/60 text-xs uppercase tracking-[0.3em] mb-3">
            {t.videos.subtitle}
          </p>
          <h1 className="font-heading text-4xl md:text-5xl text-cream">
            {t.videos.title}
          </h1>
          <p className="text-cream/50 mt-4 max-w-2xl mx-auto">
            {t.videos.description}
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex rounded-lg border border-gold/20 overflow-hidden flex-wrap justify-center">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => {
                  setActiveCategory(cat.key);
                  setPlaying(null);
                }}
                className={`px-5 py-2.5 text-sm uppercase tracking-wider transition-colors ${
                  activeCategory === cat.key
                    ? "bg-gold text-navy font-semibold"
                    : "text-cream/60 hover:text-cream"
                }`}
              >
                {t.videos[cat.labelKey]}
                <span className="ml-1.5 text-xs opacity-60">
                  ({cat.videos.length})
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Featured Video Player */}
        {playing && (
          <div className="max-w-4xl mx-auto mb-10">
            <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-gold/20">
              <iframe
                src={`https://www.youtube.com/embed/${playing}?autoplay=1`}
                title="Video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
            <p className="text-cream font-heading text-lg mt-4">
              {currentCategory.videos.find((v) => v.id === playing)?.title}
            </p>
          </div>
        )}

        {/* Video Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentCategory.videos.map((video) => (
            <button
              key={video.id}
              onClick={() => {
                setPlaying(video.id);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`group block text-left bg-navy-light border rounded-lg overflow-hidden transition-all duration-300 ${
                playing === video.id
                  ? "border-gold/60"
                  : "border-gold/10 hover:border-gold/40"
              }`}
            >
              <div className="relative aspect-video bg-slate-mid">
                <img
                  src={`https://i.ytimg.com/vi/${video.id}/mqdefault.jpg`}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-gold/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5 text-navy ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-cream text-sm font-medium line-clamp-2 group-hover:text-gold transition-colors">
                  {video.title}
                </h3>
              </div>
            </button>
          ))}
        </div>

        {/* Subscribe CTA */}
        <div className="text-center mt-16">
          <a
            href="https://www.youtube.com/@komninakis"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-navy font-semibold px-8 py-3 rounded transition-colors text-sm uppercase tracking-wider"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
            {t.videos.subscribeOnYouTube}
          </a>
        </div>
      </section>
    </div>
  );
}
