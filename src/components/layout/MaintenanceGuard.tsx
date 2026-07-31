import { type ReactNode, useEffect, useState } from "react";
import { obtenirParametresPublic } from "../../api/parametrePlateformeService";
import { useAuth } from "../../context/AuthContext";
import "./MaintenanceGuard.css";

export function MaintenanceGuard({ children }: { children: ReactNode }) {
    const { currentUser, isLoadingUser } = useAuth();
    const [enMaintenance, setEnMaintenance] = useState(false);
    const [nomSite, setNomSite] = useState("la plateforme");
    const [verifie, setVerifie] = useState(false);

    useEffect(() => {
        async function verifier() {
            try {
                const data = await obtenirParametresPublic();
                setEnMaintenance(data.modeMaintenance);
                if (data.nomSite) setNomSite(data.nomSite);
            } catch {
                // En cas d'échec de la vérification, on n'affiche pas la maintenance par erreur.
                setEnMaintenance(false);
            } finally {
                setVerifie(true);
            }
        }
        // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch au montage, pattern standard
        verifier();
    }, []);

    const estAdmin = currentUser?.role === "ADMIN";

    if (!verifie || isLoadingUser) {
        return null;
    }

    if (enMaintenance && !estAdmin) {
        return (
            <div className="maintenance-page">
                <div className="maintenance-page__card">
                    <div className="maintenance-page__icon">🛠️</div>
                    <h1 className="maintenance-page__title">{nomSite} est en maintenance</h1>
                    <p className="maintenance-page__text">
                        Nous effectuons actuellement une maintenance pour améliorer votre expérience. Merci de revenir
                        un peu plus tard.
                    </p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}