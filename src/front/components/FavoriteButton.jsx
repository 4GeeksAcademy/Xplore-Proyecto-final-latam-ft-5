// src/front/components/FavoriteButton.jsx
import { useEffect, useState } from "react";
import { isFavorite, toggleFavorite } from "../utils/favorites";

/**
 * Props:
 * - tour: { id, title, image, location, price, tags? }
 * - size? ("sm" | "md") -> opcional
 */
export default function FavoriteButton({ tour, size = "md" }) {
    const [fav, setFav] = useState(isFavorite(tour.id));

    useEffect(() => {
        const onUpd = () => setFav(isFavorite(tour.id));
        window.addEventListener("xplora:favorites:updated", onUpd);
        return () => window.removeEventListener("xplora:favorites:updated", onUpd);
    }, [tour.id]);

    function onClick(e) {
        e.preventDefault(); // evita navegar si está en una tarjeta con <Link>
        toggleFavorite({
            id: tour.id,
            title: tour.title,
            image: tour.image || "",
            location: tour.location || "",
            price: tour.price || 0,
            tags: tour.tags || [],
        });
        setFav((v) => !v);
    }

    const cls =
        size === "sm"
            ? "btn btn-light btn-sm rounded-pill"
            : "btn btn-light rounded-pill";

    return (
        <button
            type="button"
            onClick={onClick}
            className={cls}
            aria-pressed={fav}
            title={fav ? "Quitar de favoritos" : "Agregar a favoritos"}
        >
            {fav ? "♥ Favorito" : "♡ Favorito"}
        </button>
    );
}
