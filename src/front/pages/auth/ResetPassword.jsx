import { useState } from "react"

export default function ResetPassword() {
    const [inputValue, setInputValue] = useState({
        newPassword: "",
        confirmPassword: ""
    })
    const [errors, setErrors] = useState({});

    const handleOnChange = (e) => {
        setInputValue({ ...inputValue, [e.target.name]: e.target.value })
        if (e.target.value.trim() !== "") {
            setErrors({ errors, [e.target.name]: "" })
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        let newErrors = {}

        Object.keys(inputValue).forEach((field) => {
            if (!inputValue[field].trim()) {
                newErrors[field] = "Por favor ingresa los datos"
            }
        })

        if (inputValue.newPassword.length <= 5) {
            newErrors.newPassword = "La contraseña debe tener al menos 6 caracteres"
        }

        if (
            inputValue.newPassword &&
            inputValue.confirmPassword &&
            inputValue.newPassword !== inputValue.confirmPassword
        ) {
            newErrors.confirmPassword = "Las contraseñas deben coincidir";
        }

        setErrors(newErrors)

        if (Object.keys(newErrors).length === 0) {
            console.log("valores del input ok", inputValue);
        }

    }



    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100">
            <div className="border col-12 col-md-8 col-lg-6 rounded p-4 shadow">
                <div className="mb-3 text-center">
                    <h3>
                        Reestablecer contraseña
                    </h3>

                </div>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <input className={`form-control ${errors.newPassword ? "is-invalid" : ""}`} placeholder="Nueva contraseña" name="newPassword" type="password" value={inputValue.newPassword} onChange={handleOnChange} />
                        {errors.newPassword && (
                            <div className="invalid-feedback">{errors.newPassword}</div>
                        )}
                    </div>
                    <div className="mb-3">
                        <input className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`} placeholder="Confirmar contraseña" name="confirmPassword" type="password" value={inputValue.confirmPassword} onChange={handleOnChange} />
                        {errors.confirmPassword && (
                            <div className="invalid-feedback">{errors.confirmPassword}</div>
                        )}
                    </div>
                    <button type="submit" className="btn btn-login col-12">
                        Cambiar contraseña
                    </button>
                </form>

            </div>

        </div>
    )
}