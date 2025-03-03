import {useContext, useEffect, useState} from "react";
import {AuthContext} from "../../context/AuthContext";
import {getAbonnement, getAbonnements} from "../../services/AbonnementService";
import JaugeAbonnement from "./JaugeAbonnement";


const MyAbonnement = () => {
    const [abonnements, setAbonnements] = useState([]);
    const { userInfo } = useContext(AuthContext);
    const userType = userInfo?.typeUtilisateur;
    console.log(userType);
    const abonnementID = userInfo?.abonnementId;
    console.log(abonnementID);

    useEffect(() => {
        const fetchAbonnements = async () => {
            try {
                let data;
                if (userType === "ADMIN") {
                    data = await getAbonnement(abonnementID);
                } else {
                    data = await getAbonnements();
                }
                setAbonnements(data);
            } catch (error) {
                console.error("Erreur lors du chargement des abonnements :", error);
            }
        };
        fetchAbonnements();
    }, [abonnementID, userType]);



    if (!abonnements) return <div>Chargement...</div>;

    return (
        <div>
            <h1>My Abonnement</h1>
            <JaugeAbonnement dateDebut={abonnements.dateDebut} dateFin={abonnements.dateFin} />
            {/* Vous pouvez ajouter d'autres composants et informations ici */}
        </div>
    );
};

export default MyAbonnement