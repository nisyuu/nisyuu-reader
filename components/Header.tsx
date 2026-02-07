import ThemeToggle from './ThemeToggle';

export default function Header() {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="border-t-[6px] border-b-[6px] border-double border-black dark:border-gray-300 py-8 mb-8 relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="container mx-auto px-4">
        <div className="text-center">
          <div className="text-xs uppercase tracking-[0.3em] mb-3 text-gray-600 dark:text-gray-400 font-semibold">
            {currentDate}
          </div>
          <div className="border-t-2 border-b-2 border-black dark:border-gray-300 py-4 mb-3">
            <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-2 drop-shadow-sm">
              NISYUU READER
            </h1>
          </div>
          <p className="text-lg md:text-2xl italic text-gray-700 dark:text-gray-300 font-serif">
            Nisyuu's Daily News Selection
          </p>
          <div className="mt-4 border-t border-black dark:border-gray-300 w-48 mx-auto"></div>
        </div>
      </div>
    </header>
  );
}
