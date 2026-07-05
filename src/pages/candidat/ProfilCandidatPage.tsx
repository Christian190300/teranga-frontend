import { useEffect, useRef, useState } from "react";
import {
    getMonProfilCandidat,
    updateMonProfilCandidat,
    uploaderPhotoCandidat,
    uploaderCvCandidat,
    obtenirPhotoCandidatUrl,
    telechargerCvCandidat,
    type ProfilCandidatDTO,
} from "../../api/profileService";
import { useAuth } from "../../context/AuthContext";
import { useAutoSave } from "../../hooks/useAutoSave";
import { SaveStatusBadge } from "../../components/common/SaveStatusBadge";
import "./profilCandidatPage.css";

function formatDate(iso: string | null): string {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

export function ProfilCandidatPage() {
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);
    const { refreshPhoto } = useAuth();

    const [telephone, setTelephone] = useState("");
    const [adresse, setAdresse] = useState("");
    const [competences, setCompetences] = useState<string[]>([]);
    const [newCompetence, setNewCompetence] = useState("");

    const [photoPresente, setPhotoPresente] = useState(false);
    const [photoUrl, setPhotoUrl] = useState<string | null>(null);
    const [photoUploading, setPhotoUploading] = useState(false);
    const [photoError, setPhotoError] = useState<string | null>(null);

    const [cvPresent, setCvPresent] = useState(false);
    const [cvOriginalFilename, setCvOriginalFilename] = useState<string | null>(null);
    const [cvUploading, setCvUploading] = useState(false);
    const [cvError, setCvError] = useState<string | null>(null);

    const [dateCreation, setDateCreation] = useState<string | null>(null);
    const [dateMaj, setDateMaj] = useState<string | null>(null);

    const photoInputRef = useRef<HTMLInputElement>(null);
    const cvInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        async function charger() {
            try {
                const data: ProfilCandidatDTO = await getMonProfilCandidat();
                setTelephone(data.telephone ?? "");
                setAdresse(data.adresse ?? "");
                setCompetences(data.competences ?? []);
                setPhotoPresente(data.photoPresente);
                setCvPresent(data.cvPresent);
                setCvOriginalFilename(data.cvOriginalFilename);
                setDateCreation(data.dateCreation);
                setDateMaj(data.dateMaj);

                if (data.photoPresente) {
                    const url = await obtenirPhotoCandidatUrl();
                    setPhotoUrl(url);
                }
            } catch {
                setLoadError("Impossible de charger votre profil pour le moment.");
            } finally {
                setLoading(false);
            }
        }
        charger();
    }, []);

    // Libère l'URL blob de la photo quand elle change ou que le composant se démonte.
    useEffect(() => {
        return () => {
            if (photoUrl) {
                URL.revokeObjectURL(photoUrl);
            }
        };
    }, [photoUrl]);

    // Sauvegarde automatique : uniquement pour les champs texte.
    const saveStatus = useAutoSave(
        { telephone, adresse, competences },
        async (value) => {
            const updated = await updateMonProfilCandidat(value);
            setDateMaj(updated.dateMaj);
        },
        900,
        !loading
    );

    async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        setPhotoError(null);
        setPhotoUploading(true);
        try {
            const updated = await uploaderPhotoCandidat(file);
            setPhotoPresente(updated.photoPresente);
            setDateMaj(updated.dateMaj);

            if (photoUrl) {
                URL.revokeObjectURL(photoUrl);
            }
            const url = await obtenirPhotoCandidatUrl();
            setPhotoUrl(url);

            await refreshPhoto(); // met à jour la navbar
        } catch {
            setPhotoError("Échec de l'envoi de la photo. Vérifiez le format (JPEG, PNG, WebP) et la taille (2 Mo max).");
        } finally {
            setPhotoUploading(false);
            if (photoInputRef.current) photoInputRef.current.value = "";
        }
    }

    async function handleCvChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        setCvError(null);
        setCvUploading(true);
        try {
            const updated = await uploaderCvCandidat(file);
            setCvPresent(updated.cvPresent);
            setCvOriginalFilename(updated.cvOriginalFilename);
            setDateMaj(updated.dateMaj);
        } catch {
            setCvError("Échec de l'envoi du CV. Vérifiez qu'il s'agit bien d'un PDF (5 Mo max).");
        } finally {
            setCvUploading(false);
            if (cvInputRef.current) cvInputRef.current.value = "";
        }
    }

    async function handleCvDownload() {
        try {
            await telechargerCvCandidat(cvOriginalFilename ?? "cv.pdf");
        } catch {
            setCvError("Impossible de télécharger le CV pour le moment.");
        }
    }

    function ajouterCompetence() {
        const value = newCompetence.trim();
        if (value && !competences.includes(value)) {
            setCompetences([...competences, value]);
        }
        setNewCompetence("");
    }

    function retirerCompetence(competence: string) {
        setCompetences(competences.filter((c) => c !== competence));
    }

    if (loading) {
        return <div className="profil-page__loading">Chargement de votre profil...</div>;
    }

    return (
        <div className="profil-page">
            <div className="profil-page__header">
                <div>
                    <h1 className="profil-page__title">Mon profil candidat</h1>
                    <p className="profil-page__subtitle">
                        Vos modifications sont enregistrées automatiquement.
                    </p>
                </div>
                <SaveStatusBadge status={saveStatus} />
            </div>

            {loadError && <div className="profil-message profil-message--error">{loadError}</div>}

            <div className="profil-card">
                <p className="profil-card__section-title">Photo</p>
                <div className="profil-photo-row">
                    {photoUrl ? (
                        <img src={photoUrl} alt="Photo de profil" className="profil-photo-preview" />
                    ) : (
                        <div className="profil-photo-placeholder">?</div>
                    )}
                    <div className="profil-photo-field">
                        <input
                            ref={photoInputRef}
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={handlePhotoChange}
                            disabled={photoUploading}
                        />
                        <p className="profil-field__hint">
                            {photoUploading
                                ? "Envoi en cours..."
                                : photoPresente
                                    ? "Sélectionnez un fichier pour remplacer votre photo (JPEG, PNG, WebP, 2 Mo max)."
                                    : "Sélectionnez une photo depuis votre appareil (JPEG, PNG, WebP, 2 Mo max)."}
                        </p>
                        {photoError && <p className="profil-message profil-message--error">{photoError}</p>}
                    </div>
                </div>

                <p className="profil-card__section-title">Coordonnées</p>
                <div className="profil-field-row">
                    <div className="profil-field">
                        <label htmlFor="telephone">Téléphone</label>
                        <input
                            id="telephone"
                            value={telephone}
                            onChange={(e) => setTelephone(e.target.value)}
                            placeholder="+221 77 123 45 67"
                        />
                    </div>
                    <div className="profil-field">
                        <label htmlFor="adresse">Adresse</label>
                        <input
                            id="adresse"
                            value={adresse}
                            onChange={(e) => setAdresse(e.target.value)}
                            placeholder="Thiès, Sénégal"
                        />
                    </div>
                </div>

                <p className="profil-card__section-title">CV</p>
                <div className="profil-field">
                    <label htmlFor="cv">Votre CV (PDF)</label>
                    <div className="profil-cv-row">
                        <input
                            ref={cvInputRef}
                            id="cv"
                            type="file"
                            accept="application/pdf"
                            onChange={handleCvChange}
                            disabled={cvUploading}
                        />
                        {cvPresent && !cvUploading && (
                            <button type="button" className="profil-cv-link" onClick={handleCvDownload}>
                                Voir le CV{cvOriginalFilename ? ` (${cvOriginalFilename})` : ""}
                            </button>
                        )}
                    </div>
                    {cvUploading && <p className="profil-field__hint">Envoi en cours...</p>}
                    {cvError && <p className="profil-message profil-message--error">{cvError}</p>}
                </div>

                <p className="profil-card__section-title">Compétences</p>
                <div className="profil-field">
                    {competences.length > 0 ? (
                        <div className="profil-tags">
                            {competences.map((competence) => (
                                <span className="profil-tag" key={competence}>
                                    {competence}
                                    <button
                                        type="button"
                                        className="profil-tag__remove"
                                        onClick={() => retirerCompetence(competence)}
                                        aria-label={`Retirer ${competence}`}
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    ) : (
                        <p className="profil-tags-empty">Aucune compétence ajoutée pour l'instant.</p>
                    )}

                    <input
                        value={newCompetence}
                        onChange={(e) => setNewCompetence(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                ajouterCompetence();
                            }
                        }}
                        placeholder="Tapez une compétence puis Entrée (ex: Java, Spring Boot)"
                    />
                </div>
            </div>

            <div className="profil-card">
                <p className="profil-card__section-title">Informations</p>
                <div className="profil-meta">
                    <div className="profil-meta__item">
                        <div className="profil-meta__label">Membre depuis</div>
                        <div className="profil-meta__value">{formatDate(dateCreation)}</div>
                    </div>
                    <div className="profil-meta__item">
                        <div className="profil-meta__label">Dernière mise à jour</div>
                        <div className="profil-meta__value">{formatDate(dateMaj)}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}