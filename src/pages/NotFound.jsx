import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-red-100">
      <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
      <Link to="/" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
        Go Home
      </Link>
    </div>
  );
}
