import { useState } from "react"

export default function CreateTour() {
    const [inputValue, setInputValue] = useState({
        tourName: "",
        destination: "",
        description: "",
        date: "",
        coverPhoto: null,
        image: null,
        imageTwo: null,
        imageThree: null,
        imageFour: null

    });

    const [errors, setErrors] = useState({})


    const fieldValidation = () => {
        const required = {}
        if (inputValue.tourName.trim() == '') { required.tourName = 'Asigna un nombre al tour' }
        if (inputValue.destination.trim() == '') { required.destination = 'Destino del tour requerido' }
        if (inputValue.description.trim() == '') { required.description = 'Por favor agrega una descripción' }
        if (!inputValue.date.trim()) { required.date = "Asigna fecha del tour" }
        if (!inputValue.coverPhoto) { required.coverPhoto = 'Agrega una foto de portada al tour ' }
        return required
    }

    const handleChange = (e) => {
        const { name, value, files } = e.target

        setInputValue((prevValue) => ({ ...prevValue, [name]: files ? files[0] : value }))//<-si es un file guarda el file, si no guarda el value

        if ((value && value.trim() !== '') && files?.length > 0) {
            setErrors((prevErr) => ({ ...prevErr, [name]: "" }))
        }
    }


    const handleSubmit = (e) => {
        e.preventDefault()

        const requiredField = fieldValidation()
        setErrors(requiredField)
        if (Object.keys(requiredField).length > 0) { console.log('perro') }
    }
    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100 m-2">
            <div className="border p-2">
                <form onSubmit={handleSubmit}>
                    <div className="mb-3 text-center">
                        <h3>Crear Tour</h3>
                    </div>
                    <div className="d-flex flex-column mb-3">
                        <label>Nombre del tour</label>
                        <input
                            className={`form-control ${errors.tourName ? 'is-invalid' : ""}`}
                            placeholder="Ej. Tour a zona arqueológica"
                            name="tourName"
                            type="text"
                            value={inputValue.tourName}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="d-flex flex-column mb-3">
                        <label>Destino</label>
                        <input
                            className={`form-control ${errors.destination ? 'is-invalid' : ""}`}
                            type="text"
                            name="destination"
                            onChange={handleChange}
                            value={inputValue.destination}
                            placeholder="Zona arqueologica de Tulum"
                        />
                    </div>
                    <div className="d-flex flex-column mb-3">
                        <label>Descripcion</label>
                        <textarea className={`form-control ${errors.description ? 'is-invalid' : ""}`}
                            type="text"
                            name="description"
                            onChange={handleChange}
                            value={inputValue.description}
                            placeholder="Paseo por las ruinas y playa ..."
                            rows={5} cols={50} />
                    </div>
                    <div className="d-flex flex-column mb-3">
                        <label>Fecha</label>
                        <input className={`form-control ${errors.date ? 'is-invalid' : ""}`} type="date"
                            name="date"
                            onChange={handleChange}
                            value={inputValue.date}
                        />
                    </div>
                    <div className="d-flex flex-column mb-3">
                        <label>Imagen de portada</label>
                        <input className={`form-control ${errors.coverPhoto ? 'is-invalid' : ""}`} type="file" accept="image/*"
                            name="coverPhoto"
                            onChange={handleChange}
                            value={inputValue.coverPhoto}
                            placeholder="" />
                        {/* sig linea muestra la img antes de enviar form */}
                        {inputValue.coverPhoto && (
                            <img
                                src={URL.createObjectURL(inputValue.coverPhoto)}
                                alt="preview"
                                style={{ width: "200px", marginTop: "10px" }}
                            />
                        )}
                    </div>
                    <div className="d-flex flex-column mb-3">
                        <label>Imagen</label>
                        <input className="form-control" type="file" accept="image/*"
                            name="image"
                            onChange={handleChange}
                            value={inputValue.image}
                        />
                    </div>
                    <div className="d-flex flex-column mb-3">
                        <label>Imagen 2</label>
                        <input className="form-control" type="file" accept="image/*"
                            name="imageTwo"
                            onChange={handleChange}
                            value={inputValue.imageTwo}
                        />
                    </div>
                    <div className="d-flex flex-column mb-3">
                        <label>Imagen 3</label>
                        <input className="form-control" type="file" accept="image/*"
                            name="imageThree"
                            onChange={handleChange}
                            value={inputValue.imageThree}
                        />
                    </div>
                    <div className="d-flex flex-column mb-3">
                        <label>Imagen 4</label>
                        <input className="form-control" type="file" accept="image/*"
                            name="imageFour"
                            onChange={handleChange}
                            value={inputValue.imageFour}
                        />
                    </div>

                    <button className="btn convierte-experto text-white col-12" type="submit">Crear Tour</button>

                </form>
            </div>
        </div>
    )
}