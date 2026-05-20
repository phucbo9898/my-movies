export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-zinc-950/95 backdrop-blur-xl">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand Section */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-sm font-black text-zinc-950 shadow-lg shadow-primary/20">
                M
              </div>
              <span className="text-sm font-semibold text-white">MyMovies</span>
            </div>
            <p className="text-xs text-zinc-400">
              Stream your favorite movies and series with ease. Quality
              entertainment at your fingertips.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-300">
              Navigation
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-xs text-zinc-400 transition hover:text-white"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-xs text-zinc-400 transition hover:text-white"
                >
                  Movies
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-xs text-zinc-400 transition hover:text-white"
                >
                  Series
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-xs text-zinc-400 transition hover:text-white"
                >
                  Browse
                </a>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-300">
              Features
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-xs text-zinc-400 transition hover:text-white"
                >
                  High Quality
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-xs text-zinc-400 transition hover:text-white"
                >
                  No Ads
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-xs text-zinc-400 transition hover:text-white"
                >
                  Watchlist
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-xs text-zinc-400 transition hover:text-white"
                >
                  Multiple Devices
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-300">
              Support
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-xs text-zinc-400 transition hover:text-white"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-xs text-zinc-400 transition hover:text-white"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-xs text-zinc-400 transition hover:text-white"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-xs text-zinc-400 transition hover:text-white"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 h-px bg-white/5" />

        {/* Bottom Section */}
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-xs text-zinc-500">
            © {currentYear} MyMovies. All rights reserved. Stream with ease.
          </p>
          <div className="flex gap-4">
            <a
              href="#"
              className="text-xs text-zinc-400 transition hover:text-white"
            >
              Twitter
            </a>
            <a
              href="#"
              className="text-xs text-zinc-400 transition hover:text-white"
            >
              Facebook
            </a>
            <a
              href="#"
              className="text-xs text-zinc-400 transition hover:text-white"
            >
              Instagram
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
