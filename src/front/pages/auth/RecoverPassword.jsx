import { useState } from "react"
import { Link } from "react-router-dom"

export default function RecoverPassword() {
    const [inputValue, setInputValue] = useState({
        email: ""
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log("login values", inputValue)

    }

    const handleOnChange = (e) => {
        setInputValue({ ...inputValue, [e.target.name]: e.target.value })

    }

    return (
        <div className="d-flex justify-content-center align-items-center">
            <div className="border col-7 rounded p-4">
                <form onSubmit={handleSubmit}>
                    <div className="m-2">
                        <h3 >Recuperar contraseña</h3>
                        <div>Te enviaremos un correo para que puedas reestablecer tu contraseña  </div>
                    </div>
                    <input className="rounded p-2 m-2 col-12" placeholder="E-mail" name="email" type="text" value={inputValue.email} onChange={handleOnChange} />
                    <button className=" p-2 m-2 col-12 btn bg-success text-white" type="submit">Enviar enlace</button>
                </form>
                <div className="m-2"><Link to="/login" >Regresar a inicio de sesion</Link></div>

            </div>
        </div>
    )
}