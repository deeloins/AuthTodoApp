import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex h-screen items-center justify-center flex-col gap-4">
      <h1 className="text-4xl font-bold">Welcome to Ye's List Todo App</h1>
      <div className="flex gap-4">
        <Link href="/login" className="bg-blue-500 hover:bg-green-400 text-white px-4 py-2 rounded">
          Login
        </Link>
        <Link href="/register" className="bg-green-500 hover:bg-green-400 text-white px-4 py-2 rounded">
          Register
        </Link>
      </div>
    </div>
  );
}
