import { useEffect, useState } from "react";
import {
    getMonProfilCandidat,
    updateMonProfilCandidat,
    uploaderCvCandidat,
    uploaderLettreMotivation,
    type ProfilCandidatDTO,
    type UpdateProfilCandidatPayload,
} from "../../api/profileService";
import { postulerOffre } from "../../api/candidatureService";
import { LABELS_NIVEAU_EXPERIENCE } from "../../api/offreService";

interface Props {
    offreId: number;
    onSucces: () => void;
    onAnnuler: () => void;
}

interface FieldErrors {
    telephone?: string;
    ville?: string;
    titreProfessionnel?: string;
    cv?: string;
}

function champVide(valeur: string): boolean {
    return valeur.trim().length === 0;
}

function messageErreurPostulation(err: unknown): string {
    const response = (err as any)?.response;
    const messageKey = response?.data?.message as string | undefined;

    switch (messageKey) {
        case "error.cvManquant":
            return "Vous devez ajouter un CV au format PDF avant de pouvoir postuler.";
        case "error.dejaPostule":
            return "Vous avez déjà postulé à cette offre d'emploi.";
        case "error.offreNonPubliee":
            return "Cette offre n'accepte plus de nouvelles candidatures.";
        default:
            if (response?.status === 413) {
                return "Le fichier envoyé est trop lourd. Veuillez choisir un PDF plus léger.";
            }
            return "Impossible d'envoyer votre candidature pour le moment. Veuillez vérifier votre connexion internet.";
    }
}

export function CandidatureFormulaire({ offreId, onSucces, onAnnuler }: Props) {
    const [profil, setProfil] = useState<ProfilCandidatDTO | null>(null);
    const [loadingProfil, setLoadingProfil] = useState(true);

    const [telephone, setTelephone] = useState("");
    const [ville, setVille] = useState("");
    const [pays, setPays] = useState("");
    const [titreProfessionnel, setTitreProfessionnel] = useState("");
    const [niveauExperience, setNiveauExperience] = useState("");
    const [anneesExperience, setAnneesExperience] = useState("");
    const [competences, setCompetences] = useState("");
    const [langues, setLangues] = useState("");
    const [message, setMessage] = useState("");

    const [cvFile, setCvFile] = useState<File | null>(null);
    const [lettreFile, setLettreFile] = useState<File | null>(null);

    const [envoi, setEnvoi] = useState(false);
    const [erreur, setErreur] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

    useEffect(() => {
        (async () => {
            setLoadingProfil(true);
            try {
                const data = await getMonProfilCandidat();
                setProfil(data);
                setTelephone(data.telephone ?? "");
                setVille(data.ville ?? "");
                setPays(data.pays ?? "");
                setTitreProfessionnel(data.titreProfessionnel ?? "");
                setNiveauExperience(data.niveauExperience ?? "");
                setAnneesExperience(data.anneesExperience != null ? String(data.anneesExperience) : "");
                setCompetences((data.competences ?? []).join(", "));
                setLangues((data.langues ?? []).join(", "));
            } catch {
                setErreur("Impossible de charger les données de votre profil pour le moment.");
            } finally {
                setLoadingProfil(false);
            }
        })();
    }, []);

    const cvPresentApres = profil?.cvPresent || cvFile !== null;

    const validateForm = (): boolean => {
        const errors: FieldErrors = {};

        if (champVide(telephone)) {
            errors.telephone = "Le numéro de téléphone est nécessaire pour vous contacter.";
        }
        if (champVide(ville)) {
            errors.ville = "La ville de résidence est requise.";
        }
        if (champVide(titreProfessionnel)) {
            errors.titreProfessionnel = "Le titre professionnel est requis (ex: Développeur Front-End).";
        }
        if (!cvPresentApres) {
            errors.cv = "Un CV (PDF) est obligatoire pour postuler.";
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    async function handleSubmit() {
        setErreur(null);

        if (!validateForm()) {
            setErreur("Veuillez remplir les informations obligatoires ci-dessus avant de valider.");
            return;
        }

        setEnvoi(true);
        try {
            // 1. Envoi des fichiers s'ils viennent d'être sélectionnés
            if (cvFile) {
                if (cvFile.type !== "application/pdf") {
                    setErreur("Le fichier CV doit être au format PDF.");
                    setEnvoi(false);
                    return;
                }
                await uploaderCvCandidat(cvFile);
            }

            if (lettreFile) {
                if (lettreFile.type !== "application/pdf") {
                    setErreur("La lettre de motivation doit être au format PDF.");
                    setEnvoi(false);
                    return;
                }
                await uploaderLettreMotivation(lettreFile);
            }

            // 2. Mise à jour des informations de profil
            const payload: UpdateProfilCandidatPayload = {
                telephone: telephone.trim() || undefined,
                ville: ville.trim() || undefined,
                pays: pays.trim() || undefined,
                titreProfessionnel: titreProfessionnel.trim() || undefined,
                niveauExperience: niveauExperience.trim() || undefined,
                anneesExperience: anneesExperience.trim() ? Number(anneesExperience) : undefined,
                competences: competences.trim()
                    ? competences.split(",").map((c) => c.trim()).filter(Boolean)
                    : undefined,
                langues: langues.trim() ? langues.split(",").map((l) => l.trim()).filter(Boolean) : undefined,
            };
            await updateMonProfilCandidat(payload);

            // 3. Soumission de la candidature
            await postulerOffre(offreId, message.trim() || undefined);
            onSucces();
        } catch (err) {
            setErreur(messageErreurPostulation(err));
        } finally {
            setEnvoi(false);
        }
    }

    if (loadingProfil) {
        return <div className="offre-modal__loading">Chargement de votre profil...</div>;
    }

    return (
        <div className="candidature-form">
            <p className="candidature-form__hint">
                Vérifiez et complétez vos informations avant d'envoyer votre candidature — elles seront directement enregistrées sur votre profil.
            </p>

            <div className="candidature-form__champs">
                <div className="offre-field-row">
                    <div className="offre-field">
                        <label>
                            Téléphone * {champVide(telephone) && <span className="offre-field__requis">à compléter</span>}
                        </label>
                        <input
                            value={telephone}
                            onChange={(e) => {
                                setTelephone(e.target.value);
                                setFieldErrors((prev) => ({ ...prev, telephone: undefined }));
                            }}
                            placeholder="+221 77 000 00 00"
                            disabled={envoi}
                        />
                        {fieldErrors.telephone && <span className="offre-field-hint--error">{fieldErrors.telephone}</span>}
                    </div>

                    <div className="offre-field">
                        <label>
                            Ville * {champVide(ville) && <span className="offre-field__requis">à compléter</span>}
                        </label>
                        <input
                            value={ville}
                            onChange={(e) => {
                                setVille(e.target.value);
                                setFieldErrors((prev) => ({ ...prev, ville: undefined }));
                            }}
                            placeholder="Dakar, Thiès..."
                            disabled={envoi}
                        />
                        {fieldErrors.ville && <span className="offre-field-hint--error">{fieldErrors.ville}</span>}
                    </div>
                </div>

                <div className="offre-field-row">
                    <div className="offre-field">
                        <label>Pays {champVide(pays) && <span className="offre-field__requis">à compléter</span>}</label>
                        <input value={pays} onChange={(e) => setPays(e.target.value)} placeholder="Sénégal" disabled={envoi} />
                    </div>

                    <div className="offre-field">
                        <label>
                            Titre professionnel * {champVide(titreProfessionnel) && <span className="offre-field__requis">à compléter</span>}
                        </label>
                        <input
                            value={titreProfessionnel}
                            onChange={(e) => {
                                setTitreProfessionnel(e.target.value);
                                setFieldErrors((prev) => ({ ...prev, titreProfessionnel: undefined }));
                            }}
                            placeholder="Développeur Front-End / Designer UX/UI"
                            disabled={envoi}
                        />
                        {fieldErrors.titreProfessionnel && <span className="offre-field-hint--error">{fieldErrors.titreProfessionnel}</span>}
                    </div>
                </div>

                <div className="offre-field-row">
                    <div className="offre-field">
                        <label>Niveau d'expérience</label>
                        <select value={niveauExperience} onChange={(e) => setNiveauExperience(e.target.value)} disabled={envoi}>
                            <option value="">— Sélectionner —</option>
                            {Object.entries(LABELS_NIVEAU_EXPERIENCE).map(([valeur, libelle]) => (
                                <option key={valeur} value={valeur}>
                                    {libelle}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="offre-field">
                        <label>Années d'expérience</label>
                        <input
                            type="number"
                            min={0}
                            value={anneesExperience}
                            onChange={(e) => setAnneesExperience(e.target.value)}
                            placeholder="0"
                            disabled={envoi}
                        />
                    </div>
                </div>

                <div className="offre-field">
                    <label>Compétences clés</label>
                    <input
                        value={competences}
                        onChange={(e) => setCompetences(e.target.value)}
                        placeholder="React, TypeScript, Figma (séparées par des virgules)"
                        disabled={envoi}
                    />
                </div>

                <div className="offre-field">
                    <label>Langues parlées</label>
                    <input
                        value={langues}
                        onChange={(e) => setLangues(e.target.value)}
                        placeholder="Français, Wolof, Anglais (séparées par des virgules)"
                        disabled={envoi}
                    />
                </div>
            </div>

            <div className="candidature-form__fichiers">
                <p className="candidature-form__fichiers-titre">Documents joints</p>
                <div className="offre-field-row">
                    <div className="offre-field">
                        <label>
                            CV (PDF) *
                            {profil?.cvPresent && !cvFile && (
                                <span className="offre-field__ok">
                                    ✓ déjà enregistré{profil.cvOriginalFilename ? ` (${profil.cvOriginalFilename})` : ""}
                                </span>
                            )}
                        </label>
                        <div className={`candidature-form__file ${!cvPresentApres ? "candidature-form__file--obligatoire" : ""}`}>
                            <input
                                type="file"
                                accept="application/pdf"
                                onChange={(e) => {
                                    const file = e.target.files?.[0] ?? null;
                                    setCvFile(file);
                                    if (file) setFieldErrors((prev) => ({ ...prev, cv: undefined }));
                                }}
                                disabled={envoi}
                            />
                        </div>
                        {fieldErrors.cv && <span className="offre-field-hint--error">{fieldErrors.cv}</span>}
                    </div>

                    <div className="offre-field">
                        <label>
                            Lettre de motivation (PDF) — facultative
                            {profil?.lettreMotivationPresente && !lettreFile && <span className="offre-field__ok"> ✓ déjà enregistrée</span>}
                        </label>
                        <div className="candidature-form__file">
                            <input
                                type="file"
                                accept="application/pdf"
                                onChange={(e) => setLettreFile(e.target.files?.[0] ?? null)}
                                disabled={envoi}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="candidature-form__message">
                <div className="offre-field">
                    <label>Message adressé au recruteur (optionnel)</label>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        maxLength={2000}
                        placeholder="Présentez brièvement votre motivation pour ce poste..."
                        disabled={envoi}
                    />
                </div>
            </div>

            {erreur && <div className="offre-message--error">{erreur}</div>}

            <div className="candidature-form__actions">
                <button type="button" className="btn-secondary" onClick={onAnnuler} disabled={envoi}>
                    Annuler
                </button>
                <button type="button" className="btn-gold" onClick={handleSubmit} disabled={envoi}>
                    {envoi ? "Envoi de la candidature..." : "Confirmer ma candidature"}
                </button>
            </div>
        </div>
    );
}