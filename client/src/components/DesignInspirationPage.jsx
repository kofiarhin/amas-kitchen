import { ArrowRight, CheckCircle } from "@phosphor-icons/react";

const inspirations = [
  {
    title: "Warm Accra-home palette",
    tag: "Visual system",
    detail: "Build from palm-oil orange, cocoa brown, cream and charcoal so the interface feels premium without losing Ghanaian warmth.",
  },
  {
    title: "Food photography first",
    tag: "Imagery",
    detail: "Use close, generous crops of jollof, waakye, grills and prep moments. Every page should make the food feel fresh, warm and ready to order.",
  },
  {
    title: "Signature dish storytelling",
    tag: "Content",
    detail: "Lead with the three plates customers come back for, then use short badges like Customer Favourite and House Special to make decisions easy.",
  },
  {
    title: "Delivery-first ordering",
    tag: "UX",
    detail: "Keep the menu simple: category pills, visible prices, quantity controls and a sticky cart that moves customers from browsing to checkout fast.",
  },
  {
    title: "Catering confidence",
    tag: "Services",
    detail: "Frame events, corporate lunches and private dining as dependable food support with clear portions, custom quotes and low-friction enquiry paths.",
  },
  {
    title: "Social proof and care",
    tag: "Trust",
    detail: "Pair testimonials with contact cues, opening hours and delivery areas to make the brand feel reliable, reachable and human.",
  },
];

const heroImage = "https://images.pexels.com/photos/20488744/pexels-photo-20488744.jpeg?auto=compress&cs=tinysrgb&w=900";

function InspirationCards() {
  return <div className="inspiration-grid">{inspirations.map((item, index) => <article className="inspiration-card" key={item.title}><span>{String(index + 1).padStart(2, "0")}</span><p>{item.tag}</p><h3>{item.title}</h3><small>{item.detail}</small></article>)}</div>;
}

export default function DesignInspirationPage() {
  return <><section className="page-hero inspiration-hero"><p className="eyebrow">Design inspiration shortlist</p><h1>A focused visual direction for Ama's Kitchen.</h1><p>Reviewed against the current Accra delivery-kitchen experience: warm Ghanaian food, premium care, fast ordering and service enquiries.</p></section><section className="section inspiration-shortlist"><div className="section-heading"><p className="eyebrow">Shortlist</p><h2>Six ideas to guide the next design pass.</h2><a href="/menu">See the live menu <ArrowRight size={16} /></a></div><InspirationCards /><div className="shortlist-checklist"><p><CheckCircle size={20} weight="fill" /> Checked against current homepage, menu, services, about and contact flows.</p><p><CheckCircle size={20} weight="fill" /> Keeps the existing warm premium Ghanaian brand direction intact.</p><p><CheckCircle size={20} weight="fill" /> Prioritises customer-facing design decisions over generic kitchen decor trends.</p></div></section><section className="split-section"><img src={heroImage} alt="Ghanaian food plate inspiration" /><div><p className="eyebrow">Recommended next move</p><h2>Turn this shortlist into production sections.</h2><p>Use the warm palette, food-first photography and delivery-first UX as the baseline for future homepage, menu and service refinements.</p><a href="/services" className="text-link">Compare with services page</a></div></section></>;
}
