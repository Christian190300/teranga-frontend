import { useState } from "react";
import { importerOffresSenjob } from "../../api/offreImport.service";
import "../offres/offres.css";

export function ImportOffresPage() {
    const [loading, setLoading] = useState(false);
    const [resultat, setResultat] = useState<string | null>(null);
    const [erreur, setErreur] = useState<string | null>(null);

    async function handleImporter() {
        setLoading(true);
        setErreur(null);
        setResultat(null);
        try {
            const message = await importerOffresSenjob();
            setResultat(message);
        } catch {
            setErreur("Échec de l'import. Vérifie les logs backend.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="offres-page">
            <div className="offres-page__header">
                <div>
                    <h1 className="offres-page__title">Import d'offres — SENJOB</h1>
                    <p className="offres-page__subtitle">Déclenche le scraping et l'import automatique des offres SENJOB.</p>
                </div>
            </div>

            {erreur && <div className="offre-message--error">{erreur}</div>}

            <button className="btn-gold" disabled={loading} onClick={handleImporter} style={{ marginTop: 16 }}>
                {loading ? "Import en cours..." : "Importer depuis SENJOB"}
            </button>

            {resultat && (
                <div className="offre-message--error" style={{ background: "#e6f4ea", color: "#1e7e34", marginTop: 16 }}>
                    {resultat}
                </div>
            )}
        </div>
    );
}