import { Link } from "react-router-dom";
import "../styles/HomeTiles.css";

const ITEMS = [
    {
        title: "Tours culturales",
        desc: "Viaje a España y México, al arte, la historia y la arquitectura.",
        img: "https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=1200&auto=format&fit=crop",
        to: "/panel?cat=cultural",
    },
    {
        title: "Tours Gastronómicos",
        desc: "Sabores del mundo: street food y alta cocina inolvidable.",
        img: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop",
        to: "/panel?cat=food",
    },
    {
        title: "Tours Naturales",
        desc: "Explora montañas, lagunas y playas únicas para desconectar.",
        img: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop",
        to: "/panel?cat=nature",
    },
    // duplica para completar 9 (puedes cambiar textos/imagenes)
    {
        title: "Tours culturales",
        desc: "Rutas de museos y barrios históricos que te sorprenden.",
        img: "https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=1200&auto=format&fit=crop",
        to: "/panel?cat=cultural",
    },
    {
        title: "Tours Gastronómicos",
        desc: "Saborea mercados, cafés icónicos y recetas locales.",
        img: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop",
        to: "/panel?cat=food",
    },
    {
        title: "Tours Naturales",
        desc: "Caminatas suaves, miradores y experiencias al aire libre.",
        img: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop",
        to: "/panel?cat=nature",
    },
    {
        title: "Tours culturales",
        desc: "Teatros, festivales y artes vivas en ciudades vibrantes.",
        img: "https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=1200&auto=format&fit=crop",
        to: "/panel?cat=cultural",
    },
    {
        title: "Tours Gastronómicos",
        desc: "Degustaciones, viñedos y cocina local con historia.",
        img: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop",
        to: "/panel?cat=food",
    },
    {
        title: "Tours Naturales",
        desc: "Ríos, cascadas y reservas para recargar energía.",
        img: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop",
        to: "/panel?cat=nature",
    },
];

export default function HomeDiscover() {
    return (
        <section className="home-discover container py-5">
            <div className="text-center mb-4">
                <h2 className="fw-semibold mb-2">Descubre, Inspírate y Comparte</h2>
                <p className="text-muted mb-0">
                    Tours culturales, gastronómicos, naturales y todo para explorar el mundo
                </p>
            </div>

            <div className="row g-4">
                {ITEMS.map((it, i) => (
                    <div className="col-12 col-md-6 col-lg-4" key={i}>
                        <Link to={it.to} className="tile link-unstyled d-block">
                            <div className="tile-img" role="img" aria-label={it.title}>
                                <img src={it.img} alt={it.title} loading="lazy" />
                            </div>
                            <div className="tile-body">
                                <h6 className="mb-1">{it.title}</h6>
                                <p className="small mb-0">{it.desc}</p>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>

            <div className="text-center">
                <Link to="/panel" className="btn btn-outline-secondary mt-4 px-4">
                    Ver más
                </Link>
            </div>
        </section>
    );
}
