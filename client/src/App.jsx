import { useEffect, useMemo, useReducer, useState } from "react";
import { ArrowRight, Check, Clock, MapPin, Minus, Plus, ShoppingBag, Trash, WarningCircle } from "@phosphor-icons/react";
import { cartReducer, cartSubtotal, formatMoney, initialCart, lineTotal } from "./lib/cart";
import businessConfig from "../../shared/businessConfig.json";
import AdminApp from "./admin/AdminApp";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const heroImage = "https://res.cloudinary.com/dlsiabgiw/image/upload/v1782005862/amas-kitchen/pexels-ekrulila-20488746_kz18zy.jpg";

function SkeletonMenu() {
  return <div className="menu-grid" aria-label="Loading menu">{[1, 2, 3].map((value) => <div className="dish-skeleton" key={value}><span /><span /><span /></div>)}</div>;
}

function FoodCard({ item, canOrder, onAdd, index }) {
  const [quantity, setQuantity] = useState(1);
  const [selected, setSelected] = useState([]);
  const toggle = (option, group) => {
    const id = String(option._id);
    setSelected((current) => {
      const withoutGroup = group.maxSelections === 1 ? current.filter((entry) => entry.group !== group.name) : current;
      if (current.some((entry) => entry.id === id)) return current.filter((entry) => entry.id !== id);
      const groupCount = withoutGroup.filter((entry) => entry.group === group.name).length;
      return groupCount >= group.maxSelections ? withoutGroup : [...withoutGroup, { ...option, id, group: group.name }];
    });
  };
  const valid = (item.addonGroups || []).every((group) => selected.filter((entry) => entry.group === group.name).length >= group.minSelections);
  return <article className="dish" style={{ "--delay": `${index * 70}ms` }}>
    <div className="dish-media"><img src={item.images?.[0]} alt="" loading="lazy" /><span>{item.category}</span>{!item.available && <strong>Sold out</strong>}</div>
    <div className="dish-copy"><div><h3>{item.name}</h3><p>{item.description}</p></div><b>{formatMoney(item.basePrice)}</b></div>
    {(item.addonGroups || []).map((group) => <fieldset key={group.name} className="addons"><legend>{group.name} <small>{group.required ? "Required" : `Up to ${group.maxSelections}`}</small></legend>{group.options.map((option) => <label key={option._id} className={!option.available ? "unavailable" : ""}><input type={group.maxSelections === 1 ? "radio" : "checkbox"} name={`${item._id}-${group.name}`} checked={selected.some((entry) => entry.id === String(option._id))} disabled={!option.available} onChange={() => toggle(option, group)} /><span>{option.name}</span><small>+{formatMoney(option.price)}</small></label>)}</fieldset>)}
    <div className="dish-actions"><div className="quantity" aria-label="Quantity"><button aria-label="Decrease quantity" onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus size={14} /></button><span>{quantity}</span><button aria-label="Increase quantity" onClick={() => setQuantity(Math.min(50, quantity + 1))}><Plus size={14} /></button></div><button className="add-button" disabled={!canOrder || !item.available || !valid} onClick={() => onAdd(item, quantity, selected)}>Add <ArrowRight size={17} /></button></div>
  </article>;
}

function Checkout({ bootstrap, cart, dispatch }) {
  const business = bootstrap.business || businessConfig;
  const [form, setForm] = useState({ customerName: "", phone: "", email: "", line1: "", line2: "", city: business.city, instructions: "", deliveryArea: "", notes: "" });
  const [state, setState] = useState({ status: "idle", message: "", order: null });
  const subtotal = cartSubtotal(cart);
  const eligible = bootstrap.ordering.canOrder && cart.lines.length > 0 && subtotal >= bootstrap.minimumOrder;
  const update = (event) => setForm((value) => ({ ...value, [event.target.name]: event.target.value }));
  const submit = async (event) => {
    event.preventDefault(); if (!eligible) return;
    setState({ status: "submitting", message: "", order: null });
    try {
      const response = await fetch(`${API_URL}/api/orders`, { method: "POST", headers: { "Content-Type": "application/json", "Idempotency-Key": globalThis.crypto.randomUUID() }, body: JSON.stringify({ customerName: form.customerName, phone: form.phone, email: form.email, items: cart.lines.map((line) => ({ foodItemId: line.item._id, quantity: line.quantity, selectedAddonIds: line.addons.map((addon) => addon.id || addon._id) })), deliveryAddress: { line1: form.line1, line2: form.line2, city: form.city, instructions: form.instructions }, deliveryArea: form.deliveryArea, notes: form.notes }) });
      const result = await response.json(); if (!response.ok) throw new Error(result.error?.message || "We could not place the order.");
      dispatch({ type: "clear" }); setState({ status: "success", message: "", order: result.data });
    } catch (error) { setState({ status: "error", message: error.message, order: null }); }
  };
  if (state.status === "success") return <aside className="checkout success-panel" aria-live="polite"><span className="success-mark"><Check size={28} weight="bold" /></span><p className="eyebrow">Order received</p><h2>{state.order.orderNumber}</h2><p>We will prepare your food for immediate delivery. Pay {formatMoney(state.order.total)} in cash when it arrives.</p></aside>;
  return <aside className="checkout" id="checkout"><div className="checkout-heading"><div><p className="eyebrow">Your order</p><h2>Ready when you are.</h2></div><ShoppingBag size={25} /></div>
    {cart.lines.length === 0 ? <div className="empty-cart"><ShoppingBag size={28} /><p>Your basket is empty.</p><span>Choose a dish from the menu to begin.</span></div> : <div className="cart-lines">{cart.lines.map((line) => <div className="cart-line" key={line.lineId}><div><strong>{line.quantity} × {line.item.name}</strong>{line.addons.length > 0 && <small>{line.addons.map((addon) => addon.name).join(", ")}</small>}</div><span>{formatMoney(lineTotal(line))}</span><button aria-label={`Remove ${line.item.name}`} onClick={() => dispatch({ type: "remove", lineId: line.lineId })}><Trash size={16} /></button></div>)}</div>}
    <dl className="totals"><div><dt>Subtotal</dt><dd>{formatMoney(subtotal)}</dd></div><div><dt>Delivery</dt><dd>{formatMoney(bootstrap.deliveryFee)}</dd></div><div className="grand-total"><dt>Total</dt><dd>{formatMoney(subtotal + bootstrap.deliveryFee)}</dd></div></dl>
    {subtotal < bootstrap.minimumOrder && cart.lines.length > 0 && <p className="minimum-note">Add {formatMoney(bootstrap.minimumOrder - subtotal)} more to reach the minimum.</p>}
    <form onSubmit={submit} className="checkout-form"><div className="field"><label htmlFor="customerName">Full name</label><input id="customerName" name="customerName" value={form.customerName} onChange={update} required maxLength="100" /></div><div className="field-grid"><div className="field"><label htmlFor="phone">Phone</label><input id="phone" name="phone" value={form.phone} onChange={update} required /></div><div className="field"><label htmlFor="email">Email <small>Optional</small></label><input id="email" name="email" type="email" value={form.email} onChange={update} /></div></div><div className="field"><label htmlFor="line1">Delivery address</label><input id="line1" name="line1" value={form.line1} onChange={update} required /></div><div className="field-grid"><div className="field"><label htmlFor="city">City</label><input id="city" name="city" value={form.city} onChange={update} required /></div><div className="field"><label htmlFor="deliveryArea">Delivery area</label><select id="deliveryArea" name="deliveryArea" value={form.deliveryArea} onChange={update} required><option value="">Choose area</option>{bootstrap.deliveryZones.map((zone) => <option key={zone._id || zone.name}>{zone.name}</option>)}</select></div></div><div className="field"><label htmlFor="instructions">Delivery instructions <small>Optional</small></label><textarea id="instructions" name="instructions" value={form.instructions} onChange={update} maxLength="300" rows="2" /></div>{state.status === "error" && <p className="form-error" role="alert"><WarningCircle size={17} />{state.message}</p>}<button className="checkout-button" disabled={!eligible || state.status === "submitting"}>{state.status === "submitting" ? "Sending order…" : "Place cash order"}</button><p className="payment-note">Cash on Delivery only. Immediate delivery; no scheduled orders.</p></form>
  </aside>;
}

function PublicApp() {
  const [bootstrap, setBootstrap] = useState(null); const [error, setError] = useState("");
  const [cart, dispatch] = useReducer(cartReducer, initialCart, (value) => { try { return JSON.parse(localStorage.getItem("amas-cart")) || value; } catch { return value; } });
  useEffect(() => { localStorage.setItem("amas-cart", JSON.stringify(cart)); }, [cart]);
  useEffect(() => { const controller = new AbortController(); fetch(`${API_URL}/api/public/bootstrap`, { signal: controller.signal }).then(async (response) => { const result = await response.json(); if (!response.ok) throw new Error(result.error?.message || "Menu unavailable"); setBootstrap(result.data); }).catch((reason) => { if (reason.name !== "AbortError") setError(reason.message); }); return () => controller.abort(); }, []);
  const categories = useMemo(() => bootstrap ? [...new Set(bootstrap.menu.map((item) => item.category))] : [], [bootstrap]);
  const business = bootstrap?.business || businessConfig;
  return <main><nav className="nav"><a href="#top" className="brand">Ama’s <span>Kitchen</span></a><div className="nav-links"><a href="#menu">Menu</a><a href="#how">How it works</a></div><a href="#checkout" className="basket-link"><ShoppingBag size={18} />Basket <span>{cart.lines.length}</span></a></nav>
    <header className="hero" id="top"><div className="hero-copy"><p className="eyebrow">{business.heroEyebrow}</p><h1>{business.heroTitle}</h1><p>{business.heroDescription}</p><div className="hero-actions"><a href="#menu" className="primary-link">Order today <ArrowRight size={18} /></a><span><Clock size={18} /> {business.businessHours}</span></div></div><div className="hero-visual"><img src={heroImage} alt="A freshly prepared dish from Ama's Kitchen" /><div className="delivery-note"><MapPin size={20} weight="fill" /><span><b>{business.deliveryMode}</b>Choose your area in {business.city} at checkout</span></div></div></header>
    {bootstrap && !bootstrap.ordering.canOrder && <div className="closure" role="status"><WarningCircle size={20} /><div><strong>Ordering is closed</strong><span>{bootstrap.ordering.reason} The menu is still open for browsing.</span></div></div>}
    <section className="menu-section" id="menu"><div className="section-heading"><div><p className="eyebrow">Cooked in small batches</p><h2>Today’s menu</h2></div><p>Every plate is prepared to order. Sold-out dishes stay visible so you know what to come back for.</p></div>{error ? <div className="error-state" role="alert"><WarningCircle size={28} /><h3>The menu could not load.</h3><p>{error}</p><button onClick={() => location.reload()}>Try again</button></div> : !bootstrap ? <SkeletonMenu /> : <div className="ordering-layout"><div>{categories.map((category) => <section className="category" key={category}><div className="category-title"><h3>{category}</h3><span>{bootstrap.menu.filter((item) => item.category === category).length} dishes</span></div><div className="menu-grid">{bootstrap.menu.filter((item) => item.category === category).map((item, index) => <FoodCard key={item._id} item={item} index={index} canOrder={bootstrap.ordering.canOrder} onAdd={(selectedItem, quantity, addons) => dispatch({ type: "add", item: selectedItem, quantity, addons })} />)}</div></section>)}</div><Checkout bootstrap={bootstrap} cart={cart} dispatch={dispatch} /></div>}</section>
    <section className="how" id="how"><p className="eyebrow">Simple by design</p><div className="how-grid"><h2>Pick a plate.<br />We’ll handle the rest.</h2><ol><li><span>01</span><div><b>Choose your food</b><p>Build your plate and check the minimum as you go.</p></div></li><li><span>02</span><div><b>Tell us where</b><p>Select an active delivery area in {business.city} and share clear directions.</p></div></li><li><span>03</span><div><b>Pay at your door</b><p>Your order arrives ready to enjoy. Payment is cash only.</p></div></li></ol></div></section>
    <footer><a href="#top" className="brand">Ama’s <span>Kitchen</span></a><p>Fresh food from {business.area}, {business.city}. Immediate delivery. {business.businessHours}.</p>{bootstrap && <a href={`tel:${bootstrap.supportPhone}`}>{bootstrap.supportPhone}</a>}</footer>
  </main>;
}

export default function App() {
  return window.location.pathname.startsWith("/admin") ? <AdminApp /> : <PublicApp />;
}
