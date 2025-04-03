import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Wordnest</h1>
      <p className="mb-4">A fun crossword-style word game!</p>
      <Link to="/game" className="bg-blue-500 text-white px-4 py-2 rounded-lg">
        Start Game
      </Link>
    </div>
  );
}
