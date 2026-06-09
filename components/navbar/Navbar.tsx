export default function Navbar() {
  return (
    <nav data-site-nav className="relative z-40 flex flex-col gap-3 border-b bg-white px-5 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between lg:px-8">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold text-pink-600">CareerOS</h1>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs font-medium text-gray-600 sm:gap-x-6 sm:text-sm">
        <p>Dashboard</p>
        <p>Explore Careers</p>
        <p>Applications</p>
        <p>Messages</p>
      </div>
    </nav>
  );
}
