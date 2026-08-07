import { useState } from "react";
import { importerOffresSenjob, importerOffresEmploiDakar } from "../../api/offreImport.service";
import "./importSenjob.css";

type EtatImport = "idle" | "en-cours" | "succes" | "erreur";

interface SourceImport {
    id: string;
    nom: string;
    urlAffichee: string;
    lancer: () => Promise<string>;
}

const SOURCES: SourceImport[] = [
    {
        id: "senjob",
        nom: "SENJOB",
        urlAffichee: "senjob.com/sn/offres-d-emploi.php",
        lancer: importerOffresSenjob,
    },
    {
        id: "emploidakar",
        nom: "Emploi Dakar",
        urlAffichee: "emploidakar.com/offre-demploi",
        lancer: importerOffresEmploiDakar,
    },
];

export function ImportOffresPage() {
    const [etats, setEtats] = useState<Record<string, EtatImport>>({});
    const [messages, setMessages] = useState<Record<string, string | null>>({});

    async function lancerImport(source: SourceImport) {
        setEtats((prev) => ({ ...prev, [source.id]: "en-cours" }));
        setMessages((prev) => ({ ...prev, [source.id]: null }));
        try {
            const resultat = await source.lancer();
            setMessages((prev) => ({ ...prev, [source.id]: resultat }));
            setEtats((prev) => ({ ...prev, [source.id]: "succes" }));
        } catch {
            setMessages((prev) => ({
                ...prev,
                [source.id]: "Impossible de lancer l'import. Vérifiez votre connexion ou réessayez plus tard.",
            }));
            setEtats((prev) => ({ ...prev, [source.id]: "erreur" }));
        }
    }

    return (
        <div className="import-senjob-page">
            <div className="import-senjob-page__header">
                <h1 className="import-senjob-page__title">Import des offres</h1>
                <p className="import-senjob-page__subtitle">
                    Récupère les dernières offres publiées sur les sites partenaires et les ajoute à la plateforme.
                </p>
            </div>

            {SOURCES.map((source) => {
                const etat = etats[source.id] ?? "idle";
                const message = messages[source.id] ?? null;

                return (
                    <div key={source.id} className="import-senjob-card">
                        <div className="import-senjob-card__icon">↓</div>

                        <div className="import-senjob-card__body">
                            <p className="import-senjob-card__label">Source</p>
                            <p className="import-senjob-card__value">{source.urlAffichee}</p>
                        </div>

                        <button
                            className="btn-gold"
                            onClick={() => lancerImport(source)}
                            disabled={etat === "en-cours"}
                        >
                            {etat === "en-cours" ? "Import en cours..." : `Lancer l'import ${source.nom}`}
                        </button>

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
            })}
        </div>
    );
}