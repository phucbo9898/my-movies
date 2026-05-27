export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-zinc-950/95 backdrop-blur-xl">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 text-center">
        <div className="mb-3">
          <div className="inline-flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-sm font-black text-zinc-950 shadow-lg shadow-primary/20">
              M
            </div>
            <span className="text-sm font-semibold text-white">MyMovies</span>
          </div>
        </div>

        <p className="text-xs text-zinc-500">
          © {currentYear} MyMovies. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
