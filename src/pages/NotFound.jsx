import { Link, useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-red-100">
      <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
      <Link to="/" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
        Go Home
      </Link>
      <button
        onClick={() => navigate(-1)}
        className="mt-2 text-blue-700 underline"
      >
        back
      </button>
    </div>
  );
}