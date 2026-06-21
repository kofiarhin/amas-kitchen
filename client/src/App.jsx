import { useEffect } from "react";

const images = {
  hero: "https://res.cloudinary.com/dlsiabgiw/image/upload/v1782005862/amas-kitchen/pexels-ekrulila-20488746_kz18zy.jpg",
  story:
    "https://res.cloudinary.com/dlsiabgiw/image/upload/v1782005864/amas-kitchen/pexels-thomas-wilson-1334312084-30746554_y0jcan.jpg",
};

const dishes = [
  {
    name: "Jollof Rice",
    desc: "Smoky rice served with grilled chicken and plantain.",
    price: "£12.99",
    image:
      "https://res.cloudinary.com/dlsiabgiw/image/upload/v1782005872/amas-kitchen/pexels-jagaba-36707706_ibjjnv.jpg",
  },
  {
    name: "Grilled Special",
    desc: "Charcoal-grilled meat with house seasoning.",
    price: "£14.99",
    image:
      "https://res.cloudinary.com/dlsiabgiw/image/upload/v1782005876/amas-kitchen/pexels-kubra-dogu-80605500-8837229_zvzsmp.jpg",
  },
  {
    name: "Chef Plate",
    desc: "A rich plate made fresh with bold flavours.",
    price: "£13.99",
    image:
      "https://res.cloudinary.com/dlsiabgiw/image/upload/v1782005876/amas-kitchen/pexels-zain-alabdeen-hammoudi-2151566197-37307214_cyghwx.jpg",
  },
  {
    name: "House Pasta",
    desc: "Creamy pasta served with herbs and grilled chicken.",
    price: "£11.99",
    image:
      "https://res.cloudinary.com/dlsiabgiw/image/upload/v1782005871/amas-kitchen/pexels-hamzaoui-fatma-2153886935-33434010_cwgzlj.jpg",
  },
];

const gallery = [
  "https://res.cloudinary.com/dlsiabgiw/image/upload/v1782005869/amas-kitchen/pexels-tonyleong81-2092916_s1s2ru.jpg",
  "https://res.cloudinary.com/dlsiabgiw/image/upload/v1782005869/amas-kitchen/pexels-saizstudio-17952746_tcmohu.jpg",
  "https://res.cloudinary.com/dlsiabgiw/image/upload/v1782005864/amas-kitchen/pexels-thomas-wilson-1334312084-30746554_y0jcan.jpg",
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
          <a className="text-amber-400" href="#">
            Home
          </a>
          <a href="#">Menu</a>
          <a href="#">Gallery</a>
          <a href="#">Contact</a>
        </div>

        <button className="rounded-lg border border-amber-400 px-5 py-2 text-sm font-bold text-amber-400 hover:bg-amber-400 hover:text-slate-950">
          Reserve Table
        </button>
      </nav>

      <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 md:grid-cols-2">
        <div>
          <p className="mb-4 text-sm font-bold uppercase tracking-widest text-amber-400">
            Welcome to
          </p>
          <h2 className="text-5xl font-extrabold leading-tight md:text-7xl">
            Ama&apos;s Kitchen
          </h2>
          <p className="mt-6 text-lg text-slate-300">
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

        <img
          src={images.hero}
          alt="Ama's Kitchen hero dish"
          className="h-[420px] w-full rounded-[2rem] object-cover shadow-2xl"
        />
      </section>

      <section className="bg-orange-50 px-6 py-16 text-slate-950">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-bold uppercase tracking-widest text-amber-700">
            Our Menu
          </p>
          <h2 className="mt-2 text-4xl font-extrabold">Popular Dishes</h2>

          <div className="mt-8 grid gap-6 md:grid-cols-4">
            {dishes.map((dish) => (
              <article
                key={dish.name}
                className="overflow-hidden rounded-2xl bg-white shadow"
              >
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="h-44 w-full object-cover"
                />
                <div className="p-5">
                  <h3 className="font-bold">{dish.name}</h3>
                  <p className="mt-2 text-sm text-slate-600">{dish.desc}</p>
                  <p className="mt-4 font-extrabold text-amber-700">
                    {dish.price}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-6 py-20 md:grid-cols-2">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-amber-400">
            About Us
          </p>
          <h2 className="mt-2 text-4xl font-extrabold">Our Story</h2>
          <p className="mt-5 text-slate-300">
            Ama&apos;s Kitchen was built around fresh ingredients, bold flavour,
            and meals that feel like home.
          </p>
        </div>

        <img
          src={images.story}
          alt="Restaurant kitchen"
          className="h-80 w-full rounded-3xl object-cover"
        />
      </section>

      <section className="bg-slate-900 px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-4xl font-extrabold">Gallery</h2>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {gallery.map((image) => (
              <img
                key={image}
                src={image}
                alt="Ama's Kitchen gallery"
                className="h-72 w-full rounded-2xl object-cover"
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
