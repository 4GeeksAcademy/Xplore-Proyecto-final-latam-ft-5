import { Link } from "react-router-dom";

export default function TourDetailXpert() {
    return (
        <div className="mx-md-5 mx-2 my-2">
            <div className="d-md-flex">
                <div className="col-md-6 col-12">
                    <img className="img-fluid" src="https://media.cnn.com/api/v1/images/stellar/prod/cnne-1365591-tianguis-1.jpg?q=w_1110,c_fill" alt="tour name" />

                    <div id="carouselExampleInterval" className="carousel slide py-3 my-2 border rounded " data-bs-ride="carousel">
                        <div className="carousel-inner">
                            <div className="carousel-item active" data-bs-interval="10000">
                                <img src="https://www.shutterstock.com/image-vector/icon-set-dogs-puppies-pet-600nw-2505539445.jpg" className="d-block w-100" alt="..." />
                            </div>
                            <div className="carousel-item" data-bs-interval="2000">
                                <img src="https://www.excelsior.com.mx/770x530/filters:format(webp):quality(75)/media/pictures/2025/02/05/3253726.jpg" className="d-block w-100" alt="..." />
                            </div>
                            <div className="carousel-item">
                                <img src="https://cdn.unotv.com/images/2025/02/perrito-reza-y-luego-come-jpg-134917-1024x576.jpg" className="d-block w-100" alt="..." />
                            </div>
                        </div>
                        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleInterval" data-bs-slide="prev">
                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Previous</span>
                        </button>
                        <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleInterval" data-bs-slide="next">
                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Next</span>
                        </button>
                    </div>
                </div>
                <div className="col-md-6 ms-md-4 col-12 ">
                    <h1 className="text-center">Nombre del tour</h1>
                    <p>Categoria</p>
                    <p>precio</p>
                    <p>fechas</p>
                    <p>descripcion</p>
                    <p>pAIS</p>
                    <p>ciudad</p>
                    <p>Capacidad</p>
                    <p>reservado?</p>
                    <Link to='/edit-tour' className="btn col-md-6 rounded-pill convierte-experto text-white"> Editar Tour</Link>
                </div>
            </div>


        </div >
    )
}