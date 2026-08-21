import { useEffect, useState } from "react";
import type { EvenementDTO, EvenementFormPayload, TypeEvenement } from "../../api/evenementService";
import { LABELS_TYPE_EVENEMENT } from "../../api/evenementService";
import "./EvenementFormModal.css";

interface Props {
    evenement: EvenementDTO | null; // null = création
    onFermer: () => void;
    onEnregistrer: (payload: EvenementFormPayload) => Promise<void>;
}

const VIDE: EvenementFormPayload = {
    titre: "",
    imageUrl: "",
    dateEvenement: "",
    heure: "",
    lieu: "",
    description: "",
    organisateur: "",
    lien: "",
    type: "AUTRE",
};

export function EvenementFormModal({ evenement, onFermer, onEnregistrer }: Props) {
    const [form, setForm] = useState<EvenementFormPayload>(VIDE);
    const [enregistrement, setEnregistrement] = useState(false);
    const [erreur, setErreur] = useState<string | null>(null);

    useEffect(() => {
        if (evenement) {
            setForm({
                titre: evenement.titre,
                imageUrl: evenement.imageUrl ?? "",
                dateEvenement: evenement.dateEvenement,
                heure: evenement.heure ?? "",
                lieu: evenement.lieu ?? "",
                description: evenement.description ?? "",
                organisateur: evenement.organisateur ?? "",
                lien: evenement.lien ?? "",
                type: evenement.type ?? "AUTRE",
            });
        } else {
            setForm(VIDE);
        }
    }, [evenement]);

    function champ<K extends keyof EvenementFormPayload>(cle: K, valeur: EvenementFormPayload[K]) {
        setForm((f) => ({ ...f, [cle]: valeur }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!form.titre.trim() || !form.dateEvenement) {
            setErreur("Le titre et la date sont obligatoires.");
            return;
        }
        setErreur(null);
        setEnregistrement(true);
        try {
            await onEnregistrer(form);
        } catch {
            setErreur("Impossible d'enregistrer l'événement. Réessaie dans un instant.");
        } finally {
            setEnregistrement(false);
        }
    }

    return (
        <div className="evenement-modal__overlay" onClick={onFermer}>
            <div className="evenement-modal" onClick={(e) => e.stopPropagation()}>
                <div className="evenement-modal__header">
                    <h2>{evenement ? "Modifier l'événement" : "Créer un événement"}</h2>
                    <button type="button" className="evenement-modal__close" onClick={onFermer}>
                        ✕
                    </button>
                </div>

                <form className="evenement-modal__form" onSubmit={handleSubmit}>
                    {erreur && <div className="evenement-modal__erreur">{erreur}</div>}

                    <label className="evenement-modal__field">
                        <span>Titre *</span>
                        <input value={form.titre} onChange={(e) => champ("titre", e.target.value)} required />
                    </label>

                    <label className="evenement-modal__field">
                        <span>Type</span>
                        <select value={form.type} onChange={(e) => champ("type", e.target.value as TypeEvenement)}>
                            {(Object.keys(LABELS_TYPE_EVENEMENT) as TypeEvenement[]).map((t) => (
                                <option key={t} value={t}>
                                    {LABELS_TYPE_EVENEMENT[t]}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="evenement-modal__field">
                        <span>Image (URL)</span>
                        <input value={form.imageUrl} onChange={(e) => champ("imageUrl", e.target.value)} placeholder="https://..." />
                    </label>

                    <div className="evenement-modal__row">
                        <label className="evenement-modal__field">
                            <span>Date *</span>
                            <input
                                type="date"
                                value={form.dateEvenement}
                                onChange={(e) => champ("dateEvenement", e.target.value)}
                                required
                            />
                        </label>
                        <label className="evenement-modal__field">
                            <span>Heure</span>
                            <input type="time" value={form.heure} onChange={(e) => champ("heure", e.target.value)} />
                        </label>
                    </div>

                    <label className="evenement-modal__field">
                        <span>Lieu</span>
                        <input value={form.lieu} onChange={(e) => champ("lieu", e.target.value)} />
                    </label>

                    <label className="evenement-modal__field">
                        <span>Organisateur</span>
                        <input value={form.organisateur} onChange={(e) => champ("organisateur", e.target.value)} />
                    </label>

                    <label className="evenement-modal__field">
                        <span>Lien (inscription, page externe...)</span>
                        <input value={form.lien} onChange={(e) => champ("lien", e.target.value)} placeholder="https://..." />
                    </label>

                    <label className="evenement-modal__field">
                        <span>Description</span>
                        <textarea rows={4} value={form.description} onChange={(e) => champ("description", e.target.value)} />
                    </label>

                    <div className="evenement-modal__actions">
                        <button type="button" className="evenement-modal__btn evenement-modal__btn--ghost" onClick={onFermer}>
                            Annuler
                        </button>
                        <button type="submit" className="evenement-modal__btn evenement-modal__btn--primary" disabled={enregistrement}>
                            {enregistrement ? "Enregistrement..." : "Enregistrer"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}