import { useState } from "react";
import { isFavorite, toggleFavorite } from "../utils/favorites";

export default function HeartButton({ tourId, className = "" }) {
    const [fav, setFav] = useState(isFavorite(tourId));
    return (
        <button
            type="button"
            aria-label="Favorito"
            className={`btn btn-light border rounded-circle ${className}`}
            onClick={() => setFav(isFavorite(toggleFavorite(tourId).includes(tourId)))}
            onMouseDown={(e) => e.preventDefault()}
            style={{ width: 36, height: 36, display: "grid", placeItems: "center" }}
            title={fav ? "Quitar de favoritos" : "Agregar a favoritos"}
        >
            {fav ? "💖" : "🤍"}
        </button>
    );
}
