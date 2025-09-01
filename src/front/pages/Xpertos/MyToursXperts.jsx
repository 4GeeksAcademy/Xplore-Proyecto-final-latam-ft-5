import TourCardXpert from "../../components/TourCardXpert";

export default function MyToursXperts() {
    return (
        <div className=" d-flex justify-content-center  min-vh-100 m-2 ">
            <div className=" d-flex align-items-center flex-column">
                <h3>Tours que has agregado a tu catálogo</h3>
                <div className="container d-flex  flex-wrap">
                    <TourCardXpert />
                    <TourCardXpert />
                    <TourCardXpert />
                    <TourCardXpert />
                    <TourCardXpert />
                    <TourCardXpert />
                    <TourCardXpert />
                    <TourCardXpert />
                    <TourCardXpert />
                    <TourCardXpert />

                </div>

            </div>

        </div>
    )
}