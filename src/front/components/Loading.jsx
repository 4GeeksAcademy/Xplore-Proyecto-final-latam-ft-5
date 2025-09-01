

const Loading = ({ message = "Cargando...", size = 40 }) => {
    return (
        <div
            className="loading-container"
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "2rem",
            }}
        >
            <div
                className="spinner"
                style={{
                    width: size,
                    height: size,
                    border: "4px solid #ccc",
                    borderTop: "4px solid #007bff",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                }}
            />
            <p style={{ marginTop: "1rem", fontSize: "1rem", color: "#555" }}>{message}</p>

            {/* CSS del spinner */}
            <style>
                {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
            </style>
        </div>
    );
};

export default Loading;
