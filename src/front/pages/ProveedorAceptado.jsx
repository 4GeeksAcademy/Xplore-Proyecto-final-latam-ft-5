export default function ProveedorAceptado() {
    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="card border-success p-4 text-center" style={{ maxWidth: '400px' }}>

                <h2>¡Bienvenido a la comunidad Xplora!</h2>
                <p>Gracias por registrarte como Experto, ya puedes contactarte con turistas de todo el mundo.</p>


                <img
                    src={MANOS}
                    alt="proveedor-ok"
                    className="mx-auto my-3"
                    style={{ width: '120px', height: 'auto' }}
                />

                <bUtton> Crea tu primer Tour</bUtton>
            </div>
        </div>


    );
}