import { Link } from "react-router-dom";

export default function TourCardXpert() {
    return (

        <div className="col-12 col-md-4 p-2 ">
            <Link to='tour-detail' className="text-decoration-none text-black">
                <div className="border shadow m-2 rounded overflow-hidden">
                    <img className="card-img-top" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDxRrC2CHlBfQZuK5gtIDpLsNb_qjqSn1V_A&s" alt="imagen" />
                    <h4 className="text-center m-2">Titulo</h4>
                    <div className="  p-2 d-flex">
                        <div className="col-6" >
                            <p>Ciudad</p>
                            <p>Activo </p>
                            <p>Reservado</p>
                        </div>
                        <div className="d-flex align-items-end justify-content-end col-6 ">
                            <Link to='edit-tour' className="btn  convierte-experto text-white rounded-pill">Editar</Link>
                        </div>

                    </div>

                </div>
            </Link>
        </div>


    )
}