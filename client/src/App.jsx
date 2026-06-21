import { useEffect } from "react";

const dishes = [
  [
    "🍛",
    "Jollof Rice",
    "Smoky rice, grilled chicken, fried plantain.",
    "£12.99",
  ],
  [
    "🍲",
    "Egusi Soup",
    "Rich melon seed soup served with pounded yam.",
    "£13.99",
  ],
  ["🍝", "Chicken Alfredo", "Creamy pasta with grilled chicken.", "£11.99"],
  ["🥩", "Pepper Steak", "Juicy steak with fries and fresh salad.", "£14.99"],
];

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
    <main className="min-h-screen bg-slate-950 text-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <h1 className="text-2xl font-bold text-amber-400">
          Ama&apos;s Kitchen
        </h1>

        <div className="hidden gap-8 text-sm font-medium md:flex">
          <a href="#" className="text-amber-400">
            Home
          </a>
          <a href="#">Menu</a>
          <a href="#">About</a>
          <a href="#">Contact</a>
        </div>

        <button className="rounded-lg border border-amber-400 px-5 py-2 text-sm font-semibold text-amber-400 hover:bg-amber-400 hover:text-slate-950">
          Reserve a Table
        </button>
      </nav>

      <section className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-20 md:grid-cols-2">
        <div>
          <p className="mb-4 text-sm font-bold uppercase tracking-widest text-amber-400">
            Welcome to
          </p>

          <h2 className="text-5xl font-extrabold leading-tight md:text-7xl">
            Ama&apos;s Kitchen
          </h2>

          <p className="mt-6 max-w-xl text-lg text-slate-300">
            Curating the best dishes served with love, flavour, and passion.
            Good food, great vibes, unforgettable memories.
          </p>

          <div className="mt-8 flex gap-4">
            <button className="rounded-lg bg-amber-400 px-6 py-3 font-bold text-slate-950 hover:bg-amber-300">
              View Menu
            </button>
            <button className="rounded-lg border border-white/30 px-6 py-3 font-bold hover:bg-white hover:text-slate-950">
              Book a Table
            </button>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl">
          <div className="flex aspect-square items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-amber-500 to-orange-800 text-9xl">
            🍗
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-slate-900">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-8 md:grid-cols-3">
          {["Fresh Ingredients", "Expertly Cooked", "Made With Love"].map(
            (item) => (
              <div key={item} className="rounded-2xl bg-white/5 p-6">
                <h3 className="font-bold text-amber-400">{item}</h3>
                <p className="mt-2 text-sm text-slate-300">
                  Quality meals prepared daily with care and flavour.
                </p>
              </div>
            ),
          )}
        </div>
      </section>

      <section className="bg-orange-50 px-6 py-16 text-slate-950">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-bold uppercase tracking-widest text-amber-700">
            Our Menu
          </p>

          <div className="mt-2 flex items-end justify-between gap-6">
            <div>
              <h2 className="text-4xl font-extrabold">Popular Dishes</h2>
              <p className="mt-2 text-slate-600">
                A selection of our customers&apos; favourites.
              </p>
            </div>

            <button className="hidden rounded-lg border border-amber-700 px-5 py-3 font-bold text-amber-700 md:block">
              View Full Menu
            </button>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-4">
            {dishes.map(([emoji, name, desc, price]) => (
              <article
                key={name}
                className="overflow-hidden rounded-2xl bg-white shadow"
              >
                <div className="flex h-40 items-center justify-center bg-amber-100 text-7xl">
                  {emoji}
                </div>

                <div className="p-5">
                  <h3 className="font-bold">{name}</h3>
                  <p className="mt-2 text-sm text-slate-600">{desc}</p>
                  <p className="mt-4 font-extrabold text-amber-700">{price}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
