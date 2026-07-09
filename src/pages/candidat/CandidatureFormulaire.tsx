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

function champVide(valeur: string): boolean {
    return valeur.trim().length === 0;
}

function messageErreurPostulation(err: unknown): string {
    const messageKey = (err as any)?.response?.data?.message as string | undefined;
    switch (messageKey) {
        case "error.cvManquant":
            return "Vous devez ajouter un CV avant de postuler.";
        case "error.dejaPostule":
            return "Vous avez déjà postulé à cette offre.";
        case "error.offreNonPubliee":
            return "Cette offre n'accepte plus de candidatures.";
        default:
            return "Impossible d'envoyer votre candidature pour le moment.";
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
                setErreur("Impossible de charger votre profil pour le moment.");
            } finally {
                setLoadingProfil(false);
            }
        })();
    }, []);

    const cvPresentApres = profil?.cvPresent || cvFile !== null;

    async function handleSubmit() {
        if (!cvPresentApres) {
            setErreur("Un CV (PDF) est obligatoire pour postuler. Ajoutez-le ci-dessous.");
            return;
        }

        setEnvoi(true);
        setErreur(null);
        try {
            // 1. Fichiers (uniquement s'ils viennent d'être choisis)
            if (cvFile) await uploaderCvCandidat(cvFile);
            if (lettreFile) await uploaderLettreMotivation(lettreFile);

            // 2. Complète/maj le profil avec les champs du formulaire
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

            // 3. Envoie la candidature
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
                Complétez les informations manquantes avant d'envoyer votre candidature — elles seront aussi
                enregistrées dans votre profil.
            </p>

            <div className="candidature-form__champs">
                <div className="offre-field-row">
                    <div className="offre-field">
                        <label>
                            Téléphone {champVide(telephone) && <span className="offre-field__requis">à compléter</span>}
                        </label>
                        <input
                            value={telephone}
                            onChange={(e) => setTelephone(e.target.value)}
                            placeholder="+221 7X XXX XX XX"
                            disabled={envoi}
                        />
                    </div>
                    <div className="offre-field">
                        <label>Ville {champVide(ville) && <span className="offre-field__requis">à compléter</span>}</label>
                        <input value={ville} onChange={(e) => setVille(e.target.value)} placeholder="Dakar" disabled={envoi} />
                    </div>
                </div>

                <div className="offre-field-row">
                    <div className="offre-field">
                        <label>Pays {champVide(pays) && <span className="offre-field__requis">à compléter</span>}</label>
                        <input value={pays} onChange={(e) => setPays(e.target.value)} placeholder="Sénégal" disabled={envoi} />
                    </div>
                    <div className="offre-field">
                        <label>
                            Titre professionnel{" "}
                            {champVide(titreProfessionnel) && <span className="offre-field__requis">à compléter</span>}
                        </label>
                        <input
                            value={titreProfessionnel}
                            onChange={(e) => setTitreProfessionnel(e.target.value)}
                            placeholder="Développeur Full-Stack"
                            disabled={envoi}
                        />
                    </div>
                </div>

                <div className="offre-field-row">
                    <div className="offre-field">
                        <label>
                            Niveau d'expérience{" "}
                            {champVide(niveauExperience) && <span className="offre-field__requis">à compléter</span>}
                        </label>
                        <select value={niveauExperience} onChange={(e) => setNiveauExperience(e.target.value)} disabled={envoi}>
                            <option value="">— Choisir —</option>
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
                            disabled={envoi}
                        />
                    </div>
                </div>

                <div className="offre-field">
                    <label>
                        Compétences {champVide(competences) && <span className="offre-field__requis">à compléter</span>}
                    </label>
                    <input
                        value={competences}
                        onChange={(e) => setCompetences(e.target.value)}
                        placeholder="React, Java, SQL (séparées par des virgules)"
                        disabled={envoi}
                    />
                </div>

                <div className="offre-field">
                    <label>Langues</label>
                    <input
                        value={langues}
                        onChange={(e) => setLangues(e.target.value)}
                        placeholder="Français, Anglais (séparées par des virgules)"
                        disabled={envoi}
                    />
                </div>
            </div>

            <div className="candidature-form__fichiers">
                <p className="candidature-form__fichiers-titre">Documents</p>
                <div className="offre-field-row">
                    <div className="offre-field">
                        <label>
                            CV (PDF) — obligatoire
                            {profil?.cvPresent && !cvFile && (
                                <span className="offre-field__ok">
                                    ✓ déjà fourni{profil.cvOriginalFilename ? ` (${profil.cvOriginalFilename})` : ""}
                                </span>
                            )}
                        </label>
                        <div className={`candidature-form__file ${!cvPresentApres ? "candidature-form__file--obligatoire" : ""}`}>
                            <input
                                type="file"
                                accept="application/pdf"
                                onChange={(e) => setCvFile(e.target.files?.[0] ?? null)}
                                disabled={envoi}
                            />
                        </div>
                    </div>
                    <div className="offre-field">
                        <label>
                            Lettre de motivation (PDF) — facultatif
                            {profil?.lettreMotivationPresente && !lettreFile && <span className="offre-field__ok"> ✓ déjà fournie</span>}
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
                    <label>Message pour le recruteur (facultatif)</label>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        maxLength={2000}
                        placeholder="Quelques mots sur votre motivation..."
                        disabled={envoi}
                    />
                </div>
            </div>

            {erreur && <div className="offre-message--error">{erreur}</div>}

            <div className="candidature-form__actions">
                <button className="btn-secondary" onClick={onAnnuler} disabled={envoi}>
                    Annuler
                </button>
                <button className="btn-gold" onClick={handleSubmit} disabled={envoi}>
                    {envoi ? "Envoi..." : "Confirmer ma candidature"}
                </button>
            </div>
        </div>
    );
}