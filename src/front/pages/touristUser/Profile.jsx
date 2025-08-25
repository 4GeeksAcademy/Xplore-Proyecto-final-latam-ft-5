import { Link } from 'react-router-dom'
import marImg from '../../assets/img/mar.jpg'
import gearIcon from '../../assets/icons/gear.svg'

export default function Profile({ profilePicture, name, lastName, email, country }) {
    return (
        <div className='vh-100 p-4 '>
            <div className='d-flex m-3 rounded overflow-hidden'>
                <div className='col-md-6 col-12 p-md-3 p-1'>
                    <div className='d-flex justify-content-between align-items-center'>
                        <h1>Profile </h1>
                        <Link><img src={gearIcon} width={30} height={30} /></Link>
                    </div>
                    <img src={profilePicture ? profilePicture : 'https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg'} className='img-fluid rounded-circle border col-md-5 ' />
                    <div>
                        <div className='m-2 d-flex'>
                            <h4 className='pe-2'>Nombre {name}</h4>
                            <h4>Apellido{lastName}</h4>
                        </div>
                        <div className='m-2' >Correo {email}</div>
                        <div className='m-2'>País {country}</div>
                    </div>
                    <div className='d-flex flex-column'>
                        <Link>
                            <div className='btn btn-login m-2 w-100'>
                                Favoritos
                            </div>
                        </Link>
                        <Link>
                            <div className='btn btn-login  m-2 w-100'>
                                Reservados
                            </div>
                        </Link>
                        <Link>
                            <div className='btn btn-login  m-2 w-100'>
                                Tours tomados
                            </div>
                        </Link>
                    </div>
                </div>
                <div className='col-md-6 container'>
                    <img className='img-fluid rounded' src={marImg} />
                </div>

            </div>


        </div>
    )
}