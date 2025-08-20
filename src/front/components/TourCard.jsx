export default function ({ img, title, description }) {
    return (
        <div className="bg-white shadow col-3 rounded m-3">
            <img className="img-fluid rounded" src={img} alt="Tour image" />
            <div className="p-2">
                <h4>{title}</h4>
                <div>{description}</div>
            </div>
        </div>
    )
}

//las props se van a recibir del backend al momento de usar el componente