import { type FormEvent, useState } from "react";
import { envoyerAnnonce, type CibleAnnonce } from "../../api/Notificationservice";
import "./envoyerAnnoncePage.css";

export function EnvoyerAnnoncePage() {
    const [cible, setCible] = useState<CibleAnnonce>("TOUS_LES_CANDIDATS");
    const [destinataireUserId, setDestinataireUserId] = useState("");
    const [titre, setTitre] = useState("");
    const [message, setMessage] = useState("");
    const [lien, setLien] = useState("");
    const [libelleAction, setLibelleAction] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [succes, setSucces] = useState<number | null>(null);

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();
        setError(null);
        setSucces(null);

        if (cible === "CANDIDAT_UNIQUE" && !destinataireUserId.trim()) {
            setError("Précisez l'identifiant du candidat destinataire.");
            return;
        }

        setLoading(true);
        try {
            const nombreEnvoyees = await envoyerAnnonce({
                cible,
                destinataireUserId: cible === "CANDIDAT_UNIQUE" ? destinataireUserId.trim() : undefined,
                titre: titre.trim(),
                message: message.trim(),
                lien: lien.trim() || undefined,
                libelleAction: libelleAction.trim() || undefined,
            });
            setSucces(nombreEnvoyees);
            setTitre("");
            setMessage("");
            setLien("");
            setLibelleAction("");
            setDestinataireUserId("");
        } catch {
            setError("Échec de l'envoi. Vérifiez les informations et réessayez.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="annonce-page">
            <div className="annonce-page__header">
                <h1>Envoyer une annonce</h1>
                <p>Événement, nouvelle fonctionnalité, opportunité ou communication importante — envoyée directement dans les notifications des candidats ciblés.</p>
            </div>

            {error && <div className="annonce-page__error">{error}</div>}
            {succes !== null && (
                <div className="annonce-page__success">
                    Annonce envoyée à {succes} candidat{succes > 1 ? "s" : ""}.
                </div>
            )}

            <form onSubmit={handleSubmit} className="annonce-page__form">
                <div className="annonce-field">
                    <label>Destinataires</label>
                    <div className="annonce-cible-toggle">
                        <button
                            type="button"
                            className={cible === "TOUS_LES_CANDIDATS" ? "active" : ""}
                            onClick={() => setCible("TOUS_LES_CANDIDATS")}
                        >
                            Tous les candidats
                        </button>
                        <button
                            type="button"
                            className={cible === "CANDIDAT_UNIQUE" ? "active" : ""}
                            onClick={() => setCible("CANDIDAT_UNIQUE")}
                        >
                            Un candidat précis
                        </button>
                    </div>
                </div>

                {cible === "CANDIDAT_UNIQUE" && (
                    <div className="annonce-field">
                        <label htmlFor="destinataireUserId">Identifiant du candidat (Keycloak)</label>
                        <input
                            id="destinataireUserId"
                            value={destinataireUserId}
                            onChange={(e) => setDestinataireUserId(e.target.value)}
                            placeholder="ex : 3f2a1c9e-..."
                        />
                        <p className="annonce-field__hint">
                            Trouvable dans la fiche du candidat depuis la gestion des utilisateurs.
                        </p>
                    </div>
                )}

                <div className="annonce-field">
                    <label htmlFor="titre">Titre</label>
                    <input
                        id="titre"
                        required
                        maxLength={150}
                        value={titre}
                        onChange={(e) => setTitre(e.target.value)}
                        placeholder="ex : Nouvelle fonctionnalité disponible"
                    />
                </div>

                <div className="annonce-field">
                    <label htmlFor="message">Message</label>
                    <textarea
                        id="message"
                        required
                        maxLength={500}
                        rows={4}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Décrivez l'annonce en quelques phrases..."
                    />
                    <p className="annonce-field__hint">{message.length}/500</p>
                </div>

                <div className="annonce-field-row">
                    <div className="annonce-field">
                        <label htmlFor="lien">Lien (optionnel)</label>
                        <input
                            id="lien"
                            value={lien}
                            onChange={(e) => setLien(e.target.value)}
                            placeholder="/formations ou https://..."
                        />
                    </div>
                    <div className="annonce-field">
                        <label htmlFor="libelleAction">Libellé du bouton</label>
                        <input
                            id="libelleAction"
                            maxLength={50}
                            value={libelleAction}
                            onChange={(e) => setLibelleAction(e.target.value)}
                            placeholder="ex : Découvrir"
                            disabled={!lien}
                        />
                    </div>
                </div>

                <button type="submit" className="annonce-submit" disabled={loading}>
                    {loading ? "Envoi en cours..." : "Envoyer l'annonce"}
                </button>
            </form>
        </div>
    );
}