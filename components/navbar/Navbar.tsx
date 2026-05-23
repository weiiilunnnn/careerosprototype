export default function Navbar() {
  return (
    <nav className="flex items-center justify-between border-b px-8 py-4">
      <h1 className="text-2xl font-bold text-pink-600">
        CareerOS
      </h1>

      <div className="flex gap-6 text-sm text-gray-600">
        <p>Dashboard</p>
        <p>Explore Careers</p>
        <p>Applications</p>
        <p>Messages</p>
      </div>
    </nav>
  );
}