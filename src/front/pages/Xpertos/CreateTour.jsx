import { useState } from "react";
import { createTour } from "../../utils/api";

export default function CreateTour() {
    const [inputValue, setInputValue] = useState({
        title: "",
        description: "",
        location: "",
        base_price: "",
        duration: "",
        popular: "",
        tour_includes: "",
        tour_not_includes: "",
        images: "",
        rate: "",
    });

    const [errors, setErrors] = useState({});

    const fieldValidation = () => {
        const required = {};
        if (!inputValue.title.trim()) required.title = "Asigna un nombre al tour";
        if (!inputValue.location.trim()) required.location = "Indica la ubicación";
        if (!inputValue.base_price.trim()) required.base_price = "Por favor ingresa el precio";
        return required;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputValue((prev) => ({ ...prev, [name]: value }));
        if (value.trim() !== "") setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const requiredField = fieldValidation();
        setErrors(requiredField);
        if (Object.keys(requiredField).length > 0) return;

        // Convertimos strings separados por coma en arrays
        const payloadTour = {
            title: inputValue.title,
            description: inputValue.description,
            location: inputValue.location,
            base_price: inputValue.base_price,
            duration: inputValue.duration,
            rate: inputValue.rate || 0,
            popular: inputValue.popular
                ? inputValue.popular.split(",").map((x) => x.trim())
                : [],
            tour_includes: inputValue.tour_includes
                ? inputValue.tour_includes.split(",").map((x) => x.trim())
                : [],
            tour_not_includes: inputValue.tour_not_includes
                ? inputValue.tour_not_includes.split(",").map((x) => x.trim())
                : [],
            images: inputValue.images
                ? inputValue.images.split(",").map((x) => x.trim())
                : [],
        };

        try {
            await createTour(payloadTour);
            alert("Tour creado correctamente");
            // Limpiamos formulario

        } catch (error) {
            console.log("Error CreateTour:", error);
            alert("Error al crear el tour");
        } finally {
            setInputValue({
                title: "",
                description: "",
                location: "",
                base_price: "",
                duration: "",
                popular: "",
                tour_includes: "",
                tour_not_includes: "",
                images: "",
                rate: "",
            });
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100 m-2">
            <div className="border p-3 rounded shadow-sm w-100" style={{ maxWidth: 600 }}>
                <form onSubmit={handleSubmit}>
                    <h3 className="text-center mb-3">Crear Tour</h3>

                    {/** Campos principales **/}
                    {[
                        { label: "Título", name: "title", type: "text" },
                        { label: "Ubicación", name: "location", type: "text" },
                        { label: "Precio", name: "base_price", type: "number" },
                        { label: "Duración", name: "duration", type: "text" },
                        { label: "Calificación inicial", name: "rate", type: "number", min: 1, max: 5 },
                        { label: "Descripción", name: "description", type: "textarea" },
                        { label: "Palabras populares (separadas por coma)", name: "popular", type: "text" },
                        { label: "Incluye (separadas por coma)", name: "tour_includes", type: "text" },
                        { label: "No incluye (separadas por coma)", name: "tour_not_includes", type: "text" },
                        { label: "Imágenes (URLs separadas por coma)", name: "images", type: "text" },
                    ].map((field) => (
                        <div className="mb-3" key={field.name}>
                            <label className="form-label">{field.label}</label>
                            {field.type === "textarea" ? (
                                <textarea
                                    className={`form-control ${errors[field.name] ? "is-invalid" : ""}`}
                                    name={field.name}
                                    value={inputValue[field.name]}
                                    onChange={handleChange}
                                    rows={4}
                                />
                            ) : (
                                <input
                                    type={field.type}
                                    className={`form-control ${errors[field.name] ? "is-invalid" : ""}`}
                                    name={field.name}
                                    min={field?.min}
                                    max={field?.max}
                                    value={inputValue[field.name]}
                                    onChange={handleChange}
                                />
                            )}
                            {errors[field.name] && (
                                <div className="invalid-feedback">{errors[field.name]}</div>
                            )}
                        </div>
                    ))}

                    <button type="submit" className="btn btn-primary w-100 rounded-pill">
                        Crear Tour
                    </button>
                </form>
            </div>
        </div>
    );
}
