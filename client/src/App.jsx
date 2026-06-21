import { useEffect } from "react";

export default function App() {
  useEffect(() => {
    const getHealth = async () => {
      const res = await fetch("http://localhost:5000/health");
      const data = await res.json();
      console.log({ data });
    };

    getHealth();
  }, []);
  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
      <h1 className="text-4xl font-bold">Welcome to Ama's Kitchen</h1>
      <p>Curating the best dishes served</p>
    </main>
  );
}
