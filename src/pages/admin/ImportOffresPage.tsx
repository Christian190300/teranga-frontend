import { useState } from "react";
import { importerOffresSenjob } from "../../api/offreImport.service";
import "./importSenjob.css";

type EtatImport = "idle" | "en-cours" | "succes" | "erreur";

export function ImportOffresPage() {
    const [etat, setEtat] = useState<EtatImport>("idle");
    const [message, setMessage] = useState<string | null>(null);

    async function lancerImport() {
        setEtat("en-cours");
        setMessage(null);
        try {
            const resultat = await importerOffresSenjob();
            setMessage(resultat);
            setEtat("succes");
        } catch {
            setMessage("Impossible de lancer l'import. Vérifiez votre connexion ou réessayez plus tard.");
            setEtat("erreur");
        }
    }

    return (
        <div className="import-senjob-page">
            <div className="import-senjob-page__header">
                <h1 className="import-senjob-page__title">Import SENJOB</h1>
                <p className="import-senjob-page__subtitle">
                    Récupère les dernières offres publiées sur SENJOB et les ajoute à la plateforme.
                </p>
            </div>

            <div className="import-senjob-card">
                <div className="import-senjob-card__icon">↓</div>

                <div className="import-senjob-card__body">
                    <p className="import-senjob-card__label">Source</p>
                    <p className="import-senjob-card__value">senjob.com/sn/offres-d-emploi.php</p>
                </div>

                <button
                    className="btn-gold"
                    onClick={lancerImport}
                    disabled={etat === "en-cours"}
                >
                    {etat === "en-cours" ? "Import en cours..." : "Lancer l'import"}
                </button>
            </div>

            {etat === "succes" && message && (
                <div className="import-senjob-message import-senjob-message--succes">
                    ✓ {message}
                </div>
            )}

            {etat === "erreur" && message && (
                <div className="offre-message--error">{message}</div>
            )}
        </div>
    );
}