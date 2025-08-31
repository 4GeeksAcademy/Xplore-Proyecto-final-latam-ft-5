import { useState } from "react"
import { createTour } from "../../utils/api";

export default function CreateTour() {
    const [inputValue, setInputValue] = useState({
        title: "",
        description: "",
        city: "",
        base_price: '',
        country: "",
        date: "",
        // coverPhoto: null,
        // image: null,
        // imageTwo: null,
        // imageThree: null,
        // imageFour: null

    });

    const [errors, setErrors] = useState({})


    const onDeleteImg = (field) => {
        setInputValue((prev) => ({
            ...prev,
            [field]: null,
        }))
    }

    const fieldValidation = () => {
        const required = {}
        if (inputValue.title.trim() == '') { required.title = 'Asigna un nombre al tour' }
        if (inputValue.country.trim() == '') { required.country = 'Indica el país' }
        if (inputValue.city.trim() == '') { required.city = 'Destino del tour requerido' }
        if (inputValue.base_price.trim() == '') { required.base_price = 'Por favor ingresa el precio' }
        if (inputValue.description.trim() == '') { required.description = 'Por favor agrega una descripción' }
        if (!inputValue.date.trim()) { required.date = "Asigna fecha del tour" }
        //if (!inputValue.coverPhoto) { required.coverPhoto = 'Agrega una foto de portada al tour ' }
        return required
    }

    const handleChange = (e) => {
        const { name, value, files } = e.target

        if (files && files.length > 0) {
            setInputValue((prevValue) => ({
                ...prevValue,
                [name]: files[0]
            }))
            setErrors((prevErr) => ({ ...prevErr, [name]: "" }))
        } else {
            setInputValue((prevValue) => ({ ...prevValue, [name]: value, }))//<-primero valida si es un file y lo guarda, si no, guarda el value

        }


        if ((value && value.trim() !== '') && files?.length > 0) {
            setErrors((prevErr) => ({ ...prevErr, [name]: "" }))
        }
    }


    const handleSubmit = async (e) => {
        try {
            const { name, value, files } = e.target
            e.preventDefault()
            const requiredField = fieldValidation()
            setErrors(requiredField)
            if (Object.keys(requiredField).length > 0) {
                console.log('faltan required')
                //rompemos funcion para terminar ejecución
                return
            } else {
                const payloadTour = {
                    title: inputValue.title,
                    description: inputValue.description,
                    city: inputValue.city,
                    base_price: inputValue.base_price,
                    country: inputValue.country,
                    date: inputValue.date,
                }
                const response = await createTour(payloadTour)
                alert('tour creado correctamente')
            }

        } catch (error) {
            console.log("Error CreateTour=====>", error)
            alert("Error al crear Tour")
        } finally {
            setInputValue({
                title: "",
                country: "",
                city: "",
                description: "",
                base_price: '',
                date: "",
                // coverPhoto: null,
                // image: null,
                // imageTwo: null,
                // imageThree: null,
                // imageFour: null
            })
        }
    }

    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100 m-2">
            <div className="border p-2">
                <form onSubmit={handleSubmit}>
                    <div className="mb-3 text-center">
                        <h3>Crear Tour</h3>
                    </div>
                    <div className="d-md-flex">
                        <div className="col-12 p-2">
                            <div className="d-flex flex-column mb-3">
                                <label>Titulo del tour</label>
                                <input
                                    className={`form-control ${errors.title ? 'is-invalid' : ""}`}
                                    placeholder="Ej. Tour a zona arqueológica"
                                    name="title"
                                    type="text"
                                    value={inputValue.title}
                                    onChange={handleChange}
                                />
                                {errors.title && (
                                    <div className="invalid-feedback" >{errors.title}</div>
                                )}
                            </div>
                            <div className="d-flex flex-column mb-3">
                                <label>País</label>
                                <input
                                    className={`form-control ${errors.country ? 'is-invalid' : ""}`}
                                    type="text"
                                    name="country"
                                    onChange={handleChange}
                                    value={inputValue.country}
                                    placeholder="Ej.Mexico"
                                />
                                {errors.country && (
                                    <div className="invalid-feedback" >{errors.country}</div>
                                )}
                            </div>
                            <div className="d-flex flex-column mb-3">
                                <label>Ciudad o estado</label>
                                <input
                                    className={`form-control ${errors.city ? 'is-invalid' : ""}`}
                                    type="text"
                                    name="city"
                                    onChange={handleChange}
                                    value={inputValue.city}
                                    placeholder="Ej. Tulum"
                                />
                                {errors.city && (
                                    <div className="invalid-feedback" >{errors.city}</div>
                                )}
                            </div>
                            <div className="d-flex flex-column mb-3">
                                <label>Precio</label>
                                <input
                                    className={`form-control ${errors.base_price ? 'is-invalid' : ""}`}
                                    type="number"
                                    name="base_price"
                                    onChange={handleChange}
                                    value={inputValue.base_price}
                                    placeholder='$0'
                                />
                                {errors.base_price && (
                                    <div className="invalid-feedback" >{errors.base_price}</div>
                                )}

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
                                {errors.description && (
                                    <div className="invalid-feedback" >{errors.description}</div>
                                )}
                            </div>
                            <div className="d-flex flex-column mb-3">
                                <label>Fecha</label>
                                <input className={`form-control ${errors.date ? 'is-invalid' : ""}`} type="date"
                                    name="date"
                                    onChange={handleChange}
                                    value={inputValue.date}
                                />
                                {errors.date && (
                                    <div className="invalid-feedback" >{errors.date}</div>
                                )}
                            </div>
                        </div>
                        {/* comienza seccion de imagenes 
                        <div className="col-md-6 col-12 p-2">
                            <div className="d-flex flex-column mb-3">
                                <label>Imagen de portada</label>
                                <input className={`form-control ${errors.coverPhoto ? 'is-invalid' : ""}`} type="file" accept="image/*"
                                    name="coverPhoto"
                                    onChange={handleChange}
                                />
                               
                                {inputValue.coverPhoto && (
                                    <>
                                        <img
                                            src={URL.createObjectURL(inputValue.coverPhoto)}
                                            alt="preview"
                                            style={{ width: "200px", marginTop: "10px" }}
                                        />
                                        <button className="btn btn-danger" onClick={() => onDeleteImg('coverPhoto')}>Cancelar</button>
                                    </>

                                )}
                                {errors.coverPhoto && (
                                    <div className="invalid-feedback" >{errors.coverPhoto}</div>
                                )}
                            </div>
                            <div className="d-flex flex-column mb-3">
                                <label>Imagen</label>
                                <input className="form-control" type="file" accept="image/*"
                                    name="image"
                                    onChange={handleChange}

                                />
                                {inputValue.image && (
                                    <>
                                        <img
                                            src={URL.createObjectURL(inputValue.image)}
                                            alt="preview"
                                            style={{ width: "200px", marginTop: "10px" }}
                                        />
                                        <button className="btn btn-danger" onClick={() => onDeleteImg('image')}>Cancelar</button>
                                    </>

                                )}
                            </div>
                            <div className="d-flex flex-column mb-3">
                                <label>Imagen 2</label>
                                <input className="form-control" type="file" accept="image/*"
                                    name="imageTwo"
                                    onChange={handleChange}

                                />
                                {inputValue.imageTwo && (
                                    <>
                                        <img
                                            src={URL.createObjectURL(inputValue.imageTwo)}
                                            alt="preview"
                                            style={{ width: "200px", marginTop: "10px" }}
                                        />
                                        <button className="btn btn-danger" onClick={() => onDeleteImg('imageTwo')}>Cancelar</button>
                                    </>

                                )}
                            </div>
                            <div className="d-flex flex-column mb-3">
                                <label>Imagen 3</label>
                                <input className="form-control" type="file" accept="image/*"
                                    name="imageThree"
                                    onChange={handleChange}

                                />
                                {inputValue.imageThree && (
                                    <>
                                        <img
                                            src={URL.createObjectURL(inputValue.imageThree)}
                                            alt="preview"
                                            style={{ width: "200px", marginTop: "10px" }}
                                        />
                                        <button className="btn btn-danger" onClick={() => onDeleteImg('imageThree')}>Cancelar</button>
                                    </>

                                )}
                            </div>
                            <div className="d-flex flex-column mb-3">
                                <label>Imagen 4</label>
                                <input className="form-control" type="file" accept="image/*"
                                    name="imageFour"
                                    onChange={handleChange}

                                />
                                {inputValue.imageFour && (
                                    <>
                                        <img
                                            src={URL.createObjectURL(inputValue.imageFour)}
                                            alt="preview"
                                            style={{ width: "200px", marginTop: "10px" }}
                                        />
                                        <button className="btn btn-danger" onClick={() => onDeleteImg('imageFour')}>Cancelar</button>
                                    </>

                                )}
                            </div>
                        </div> */}

                    </div>


                    <button className="btn convierte-experto text-white col-12 rounded-pill" type="submit">Crear Tour</button>

                </form>
            </div>
        </div>
    )
}