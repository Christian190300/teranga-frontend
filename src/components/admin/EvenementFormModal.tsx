import { useEffect, useState } from "react";
import type { EvenementDTO, EvenementFormPayload, TypeEvenement } from "../../api/evenementService";
import { LABELS_TYPE_EVENEMENT, obtenirImageEvenementAdminUrl, uploaderImageEvenement } from "../../api/evenementService";
import "./EvenementFormModal.css";

interface Props {
    evenement: EvenementDTO | null; // null = création
    onFermer: () => void;
    onEnregistrer: (payload: EvenementFormPayload) => Promise<number>; // renvoie l'id (créé ou existant)
}

const VIDE: EvenementFormPayload = {
    titre: "",
    dateEvenement: "",
    heure: "",
    lieu: "",
    description: "",
    organisateur: "",
    lien: "",
    type: "AUTRE",
};

function IconClose() {
    return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
    );
}

function IconUpload() {
    return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 15V4M12 4l-4 4M12 4l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M4 15v3a2 2 0 002 2h12a2 2 0 002-2v-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
    );
}

export function EvenementFormModal({ evenement, onFermer, onEnregistrer }: Props) {
    const [form, setForm] = useState<EvenementFormPayload>(VIDE);
    const [fichierImage, setFichierImage] = useState<File | null>(null);
    const [apercuUrl, setApercuUrl] = useState<string | null>(null);
    const [enregistrement, setEnregistrement] = useState(false);
    const [erreur, setErreur] = useState<string | null>(null);

    useEffect(() => {
        if (evenement) {
            setForm({
                titre: evenement.titre,
                dateEvenement: evenement.dateEvenement,
                heure: evenement.heure ?? "",
                lieu: evenement.lieu ?? "",
                description: evenement.description ?? "",
                organisateur: evenement.organisateur ?? "",
                lien: evenement.lien ?? "",
                type: evenement.type ?? "AUTRE",
            });

            let urlCree: string | null = null;
            let isMounted = true;
            if (evenement.imagePresente) {
                obtenirImageEvenementAdminUrl(evenement.id).then((url) => {
                    if (isMounted && url) {
                        urlCree = url;
                        setApercuUrl(url);
                    }
                });
            }
            return () => {
                isMounted = false;
                if (urlCree) URL.revokeObjectURL(urlCree);
            };
        }

        setForm(VIDE);
        setApercuUrl(null);
        setFichierImage(null);
    }, [evenement]);

    function champ<K extends keyof EvenementFormPayload>(cle: K, valeur: EvenementFormPayload[K]) {
        setForm((f) => ({ ...f, [cle]: valeur }));
    }

    function handleFichierChange(e: React.ChangeEvent<HTMLInputElement>) {
        const fichier = e.target.files?.[0];
        if (!fichier) return;
        setFichierImage(fichier);
        setApercuUrl(URL.createObjectURL(fichier));
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
            const id = await onEnregistrer(form);
            if (fichierImage) {
                await uploaderImageEvenement(id, fichierImage);
            }
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
                    <div>
                        <span className="evenement-modal__eyebrow">{evenement ? "Édition" : "Nouvel événement"}</span>
                        <h2>{evenement ? "Modifier l'événement" : "Créer un événement"}</h2>
                    </div>
                    <button type="button" className="evenement-modal__close" onClick={onFermer} aria-label="Fermer">
                        <IconClose />
                    </button>
                </div>

                <form className="evenement-modal__form" onSubmit={handleSubmit}>
                    {erreur && <div className="evenement-modal__erreur">{erreur}</div>}

                    <label className="evenement-modal__field">
                        <span>Titre *</span>
                        <input value={form.titre} onChange={(e) => champ("titre", e.target.value)} required placeholder="Ex. Forum emploi 2026" />
                    </label>

                    <label className="evenement-modal__field">
                        <span>Type</span>
                        <div className="evenement-modal__select-wrap">
                            <select value={form.type} onChange={(e) => champ("type", e.target.value as TypeEvenement)}>
                                {(Object.keys(LABELS_TYPE_EVENEMENT) as TypeEvenement[]).map((t) => (
                                    <option key={t} value={t}>
                                        {LABELS_TYPE_EVENEMENT[t]}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </label>

                    <label className="evenement-modal__field">
                        <span>Image</span>
                        <label className="evenement-modal__dropzone">
                            {apercuUrl ? (
                                <img src={apercuUrl} alt="Aperçu" className="evenement-modal__apercu" />
                            ) : (
                                <span className="evenement-modal__dropzone-content">
                                    <IconUpload />
                                    <span className="evenement-modal__dropzone-text">
                                        Choisir une image
                                        <small>PNG, JPG — 5 Mo max</small>
                                    </span>
                                </span>
                            )}
                            <input type="file" accept="image/*" onChange={handleFichierChange} className="evenement-modal__file-input" />
                        </label>
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
                        <input value={form.lieu} onChange={(e) => champ("lieu", e.target.value)} placeholder="Ex. Dakar, King Fahd Palace" />
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