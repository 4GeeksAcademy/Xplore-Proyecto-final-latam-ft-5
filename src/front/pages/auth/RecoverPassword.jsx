import { useState } from "react"
import { Link } from "react-router-dom"

export default function RecoverPassword() {
    const [inputValue, setInputValue] = useState({
        email: ""
    })

    const handleSubmit = (e) => {
        e.preventDefault()

        //validacion si el correo no esta registrado mandar error (backend)
        console.log("login values", inputValue)

    }

    const handleOnChange = (e) => {
        setInputValue({ ...inputValue, [e.target.name]: e.target.value })

    }

    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100">
            <div className="border col-12 col-md-8 col-lg-6 rounded p-4 shadow">
                <form onSubmit={handleSubmit}>
                    <div className="mb-3 text-center">
                        <h3 >Recuperar contraseña</h3>
                        <div>Te enviaremos un correo para que puedas reestablecer tu contraseña  </div>
                    </div>
                    <div className="mb-3">
                        <input className="form-control" placeholder="E-mail" name="email" type="text" value={inputValue.email} onChange={handleOnChange} />
                    </div>
                    <button className=" p-2 mb-3  col-12 btn bg-success text-white" type="submit">Enviar enlace</button>
                </form>
                <div className="m-2"><Link to="/login" >Regresar a inicio de sesion</Link></div>

            </div>
        </div>
    )
}