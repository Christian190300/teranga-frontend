import { useState } from "react";
import { envoyerEmailPersonnaliseAuxCandidats } from "../../api/mailAdminService";
import "./UserAdminPage.css";

export function AdminEmailCandidatsPage() {
    const [sujet, setSujet] = useState("");
    const [message, setMessage] = useState("");
    const [envoiEnCours, setEnvoiEnCours] = useState(false);
    const [resultat, setResultat] = useState<number | null>(null);
    const [erreur, setErreur] = useState<string | null>(null);

    const formulaireValide = sujet.trim() !== "" && message.trim() !== "";

    async function handleEnvoyer(e: React.FormEvent) {
        e.preventDefault();
        if (!formulaireValide || envoiEnCours) return;

        const confirmation = window.confirm(
            "Cet email sera envoyé à tous les candidats actifs disposant d'une adresse email. Confirmer l'envoi ?"
        );
        if (!confirmation) return;

        setEnvoiEnCours(true);
        setErreur(null);
        setResultat(null);

        try {
            const data = await envoyerEmailPersonnaliseAuxCandidats(sujet.trim(), message.trim());
            setResultat(data.mailsEnvoyes);
            setSujet("");
            setMessage("");
        } catch (err) {
            console.error("Erreur lors de l'envoi de l'email personnalisé :", err);
            setErreur("Une erreur est survenue lors de l'envoi. Veuillez réessayer.");
        } finally {
            setEnvoiEnCours(false);
        }
    }

    return (
        <div className="admin-page">
            <div className="admin-page__container" style={{ maxWidth: 640 }}>
                <div className="admin-page__head">
                    <div>
                        <h1 className="admin-page__title">Email aux candidats</h1>
                        <p className="admin-page__subtitle">
                            Ce message sera envoyé à tous les candidats actifs disposant d'une adresse email.
                        </p>
                    </div>
                </div>

                {erreur && <div className="admin-alert">{erreur}</div>}

                {resultat !== null && (
                    <div className="admin-alert" style={{ background: "#eaf7f0", color: "#1e7a4c", borderColor: "rgba(30, 122, 76, 0.25)" }}>
                        Email envoyé avec succès à {resultat} candidat{resultat > 1 ? "s" : ""}.
                    </div>
                )}

                <form onSubmit={handleEnvoyer} className="admin-form">
                    <div className="admin-form__field">
                        <label htmlFor="sujet">Sujet</label>
                        <input
                            id="sujet"
                            type="text"
                            value={sujet}
                            onChange={(e) => setSujet(e.target.value)}
                            placeholder="Objet de l'email"
                            disabled={envoiEnCours}
                        />
                    </div>

                    <div className="admin-form__field">
                        <label htmlFor="message">Message</label>
                        <textarea
                            id="message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Rédigez votre message..."
                            rows={8}
                            disabled={envoiEnCours}
                        />
                    </div>

                    <div className="admin-modal__actions" style={{ justifyContent: "flex-start" }}>
                        <button type="submit" className="admin-btn admin-btn--primary" disabled={!formulaireValide || envoiEnCours}>
                            {envoiEnCours ? "Envoi en cours..." : "Envoyer aux candidats"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AdminEmailCandidatsPage;