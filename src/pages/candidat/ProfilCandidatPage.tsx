import { useEffect, useRef, useState } from "react";
import {
    getMonProfilCandidat,
    updateMonProfilCandidat,
    uploaderPhotoCandidat,
    uploaderCvCandidat,
    uploaderLettreMotivation,
    obtenirPhotoCandidatUrl,
    telechargerCvCandidat,
    telechargerLettreMotivation,
    type ProfilCandidatDTO,
} from "../../api/profileService";
import { useAuth } from "../../context/AuthContext";
import { useAutoSave } from "../../hooks/useAutoSave";
import { SaveStatusBadge } from "../../components/common/SaveStatusBadge";
import { ProfileProgressBar } from "../../components/common/ProfileProgressBar";
import { TagListEditor } from "../../components/common/TagListEditor";
import { EditableField } from "../../components/common/EditableField";
import { EditableTextarea } from "../../components/common/EditableTextarea";
import { EditableSelect } from "../../components/common/EditableSelect";
import { VideoPresentationManager } from "./VideoPresentationManager";
import "./profilCandidatPage.css";

function formatDate(iso: string | null): string {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

function isValidUrl(url: string): boolean {
    if (!url.trim()) return true;
    try {
        const parsed = new URL(url);
        return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
        return false;
    }
}

function IconCamera() {
    return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path
                d="M4 8.5C4 7.67 4.67 7 5.5 7H8l1-2h6l1 2h2.5c.83 0 1.5.67 1.5 1.5v9c0 .83-.67 1.5-1.5 1.5h-14C4.67 19 4 18.33 4 17.5v-9Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
            />
            <circle cx="12" cy="13" r="3.2" stroke="currentColor" strokeWidth="1.6" />
        </svg>
    );
}

function IconDocument() {
    return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path
                d="M7 3.5h7l4 4v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-15a1 1 0 0 1 1-1Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
            />
            <path d="M14 3.5v4h4" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
    );
}

function IconVideo() {
    return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path
                d="M15 10l4.55-2.27A1 1 0 0 1 21 8.62v6.76a1 1 0 0 1-1.45.89L15 14v-4z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <rect x="3" y="6" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.6" />
        </svg>
    );
}

const NIVEAUX_EXPERIENCE = ["Débutant", "Junior", "Intermédiaire", "Sénior", "Expert"];
const DISPONIBILITES = ["Immédiate", "Sous 1 mois", "Sous 3 mois", "Non disponible"];
const PAYS = ["Sénégal"];

const REGIONS = [
    "Dakar", "Diourbel", "Fatick", "Kaffrine", "Kaolack", "Kédougou", "Kolda",
    "Louga", "Matam", "Saint-Louis", "Sédhiou", "Tambacounda", "Thiès", "Ziguinchor",
];

const VILLES = [
    "Dakar", "Pikine", "Guédiawaye", "Rufisque", "Thiès", "Mbour", "Tivaouane",
    "Saint-Louis", "Richard-Toll", "Kaolack", "Fatick", "Diourbel", "Touba", "Louga",
    "Kolda", "Ziguinchor", "Sédhiou", "Tambacounda", "Kédougou", "Matam", "Kaffrine",
];

const SEXE_OPTIONS = [
    { value: "HOMME", label: "Homme" },
    { value: "FEMME", label: "Femme" },
];

const asOptions = (values: string[]) => values.map((v) => ({ value: v, label: v }));

export function ProfilCandidatPage() {
    const { refreshPhoto } = useAuth();

    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

    const [scoreCompletion, setScoreCompletion] = useState<number>(0);

    const [telephone, setTelephone] = useState("");
    const [adresse, setAdresse] = useState("");
    const [sexe, setSexe] = useState("");
    const [ville, setVille] = useState("");
    const [region, setRegion] = useState("");
    const [pays, setPays] = useState("");
    const [mobilite, setMobilite] = useState(false);
    const [teletravail, setTeletravail] = useState(false);

    const [titreProfessionnel, setTitreProfessionnel] = useState("");
    const [aPropos, setAPropos] = useState("");
    const [niveauExperience, setNiveauExperience] = useState("");
    const [anneesExperience, setAnneesExperience] = useState<number | "">("");
    const [disponibilite, setDisponibilite] = useState("");

    const [formations, setFormations] = useState<string[]>([]);
    const [certifications, setCertifications] = useState<string[]>([]);
    const [langues, setLangues] = useState<string[]>([]);
    const [competences, setCompetences] = useState<string[]>([]);

    const [linkedin, setLinkedin] = useState("");
    const [github, setGithub] = useState("");
    const [portfolio, setPortfolio] = useState("");

    const [photoUrl, setPhotoUrl] = useState<string | null>(null);
    const [photoUploading, setPhotoUploading] = useState(false);
    const [photoError, setPhotoError] = useState<string | null>(null);

    const [cvPresent, setCvPresent] = useState(false);
    const [cvOriginalFilename, setCvOriginalFilename] = useState<string | null>(null);
    const [cvUploading, setCvUploading] = useState(false);
    const [cvError, setCvError] = useState<string | null>(null);

    const [lmPresente, setLmPresente] = useState(false);
    const [lmOriginalFilename, setLmOriginalFilename] = useState<string | null>(null);
    const [lmUploading, setLmUploading] = useState(false);
    const [lmError, setLmError] = useState<string | null>(null);

    const [dateCreation, setDateCreation] = useState<string | null>(null);
    const [dateMaj, setDateMaj] = useState<string | null>(null);

    const photoInputRef = useRef<HTMLInputElement>(null);
    const cvInputRef = useRef<HTMLInputElement>(null);
    const lmInputRef = useRef<HTMLInputElement>(null);

    const applyProfileData = (data: ProfilCandidatDTO) => {
        setTelephone(data.telephone ?? "");
        setAdresse(data.adresse ?? "");
        setSexe(data.sexe ?? "");
        setVille(data.ville ?? "");
        setRegion(data.region ?? "");
        setPays(data.pays ?? "");
        setMobilite(data.mobilite ?? false);
        setTeletravail(data.teletravail ?? false);

        setTitreProfessionnel(data.titreProfessionnel ?? "");
        setAPropos(data.aPropos ?? "");
        setNiveauExperience(data.niveauExperience ?? "");
        setAnneesExperience(data.anneesExperience ?? "");
        setDisponibilite(data.disponibilite ?? "");

        setFormations(data.formations ?? []);
        setCertifications(data.certifications ?? []);
        setLangues(data.langues ?? []);
        setCompetences(data.competences ?? []);

        setLinkedin(data.linkedin ?? "");
        setGithub(data.github ?? "");
        setPortfolio(data.portfolio ?? "");

        setCvPresent(data.cvPresent);
        setCvOriginalFilename(data.cvOriginalFilename);
        setLmPresente(data.lettreMotivationPresente);
        setLmOriginalFilename(data.lettreMotivationOriginalFilename);

        setDateCreation(data.dateCreation);
        setDateMaj(data.dateMaj);

        const scoreVal = data.score?.percentage ?? data.scoreCompletion ?? data.pourcentageCompletion ?? 0;
        setScoreCompletion(scoreVal);
    };

    const rechargerProfil = async () => {
        try {
            const data = await getMonProfilCandidat();
            applyProfileData(data);
        } catch {
            // Silencieux lors du rafraîchissement d'arrière-plan
        }
    };

    useEffect(() => {
        async function charger() {
            try {
                const data = await getMonProfilCandidat();
                applyProfileData(data);

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

    useEffect(() => {
        return () => {
            if (photoUrl) URL.revokeObjectURL(photoUrl);
        };
    }, [photoUrl]);

    const saveStatus = useAutoSave(
        {
            telephone, adresse, sexe, ville, region, pays, mobilite, teletravail,
            titreProfessionnel, aPropos, niveauExperience, anneesExperience, disponibilite,
            formations, certifications, langues, competences,
            linkedin, github, portfolio,
        },
        async (value) => {
            const updated = await updateMonProfilCandidat({
                ...value,
                anneesExperience: value.anneesExperience === "" ? undefined : Number(value.anneesExperience),
            });
            setDateMaj(updated.dateMaj);
            const scoreVal = updated.score?.percentage ?? updated.scoreCompletion ?? updated.pourcentageCompletion;
            if (scoreVal !== undefined) {
                setScoreCompletion(scoreVal);
            }
        },
        900,
        !loading
    );

    async function handleEnregistrerEtRafraichir() {
        setSaveSuccessMsg(null);
        setLoadError(null);

        if (!isValidUrl(linkedin) || !isValidUrl(github) || !isValidUrl(portfolio)) {
            setLoadError("Certaines URLs saisies dans la section Réseaux ne sont pas valides (ex: https://...).");
            return;
        }

        try {
            setSaving(true);
            const updated = await updateMonProfilCandidat({
                telephone, adresse, sexe, ville, region, pays, mobilite, teletravail,
                titreProfessionnel, aPropos, niveauExperience,
                anneesExperience: anneesExperience === "" ? undefined : Number(anneesExperience),
                disponibilite, formations, certifications, langues, competences,
                linkedin, github, portfolio,
            });

            applyProfileData(updated);
            setSaveSuccessMsg("Profil mis à jour avec succès !");
            setTimeout(() => setSaveSuccessMsg(null), 4000);
        } catch {
            setLoadError("Erreur lors de la sauvegarde globale des modifications.");
        } finally {
            setSaving(false);
        }
    }

    async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        setPhotoError(null);
        setPhotoUploading(true);
        try {
            const updated = await uploaderPhotoCandidat(file);
            setDateMaj(updated.dateMaj);
            const scoreVal = updated.score?.percentage ?? updated.scoreCompletion ?? updated.pourcentageCompletion;
            if (scoreVal !== undefined) setScoreCompletion(scoreVal);

            if (photoUrl) URL.revokeObjectURL(photoUrl);
            const url = await obtenirPhotoCandidatUrl();
            setPhotoUrl(url);
            await refreshPhoto();
        } catch {
            setPhotoError("Échec de l'envoi. Format accepté : JPEG, PNG, WebP (5 Mo max).");
        } finally {
            setPhotoUploading(false);
            if (photoInputRef.current) photoInputRef.current.value = "";
        }
    }

    async function handleCvChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.type !== "application/pdf") {
            setCvError("Le fichier CV doit être au format PDF.");
            return;
        }

        setCvError(null);
        setCvUploading(true);
        try {
            const updated = await uploaderCvCandidat(file);
            setCvPresent(updated.cvPresent);
            setCvOriginalFilename(updated.cvOriginalFilename);
            setDateMaj(updated.dateMaj);
            const scoreVal = updated.score?.percentage ?? updated.scoreCompletion ?? updated.pourcentageCompletion;
            if (scoreVal !== undefined) setScoreCompletion(scoreVal);
        } catch {
            setCvError("Échec de l'envoi. Le fichier doit être un PDF (5 Mo max).");
        } finally {
            setCvUploading(false);
            if (cvInputRef.current) cvInputRef.current.value = "";
        }
    }

    async function handleLmChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.type !== "application/pdf") {
            setLmError("La lettre de motivation doit être au format PDF.");
            return;
        }

        setLmError(null);
        setLmUploading(true);
        try {
            const updated = await uploaderLettreMotivation(file);
            setLmPresente(updated.lettreMotivationPresente);
            setLmOriginalFilename(updated.lettreMotivationOriginalFilename);
            setDateMaj(updated.dateMaj);
            const scoreVal = updated.score?.percentage ?? updated.scoreCompletion ?? updated.pourcentageCompletion;
            if (scoreVal !== undefined) setScoreCompletion(scoreVal);
        } catch {
            setLmError("Échec de l'envoi. Le fichier doit être un PDF (5 Mo max).");
        } finally {
            setLmUploading(false);
            if (lmInputRef.current) lmInputRef.current.value = "";
        }
    }

    async function handleCvDownload() {
        try {
            await telechargerCvCandidat(cvOriginalFilename ?? "cv.pdf");
        } catch {
            setCvError("Impossible de télécharger le CV pour le moment.");
        }
    }

    async function handleLmDownload() {
        try {
            await telechargerLettreMotivation(lmOriginalFilename ?? "lettre-motivation.pdf");
        } catch {
            setLmError("Impossible de télécharger la lettre pour le moment.");
        }
    }

    if (loading) {
        return <div className="profil-page__loading">Chargement de votre profil...</div>;
    }

    return (
        <div className="profil-page">
            <div className="profil-page__header">
                <div>
                    <h1 className="profil-page__title">Mon profil candidat</h1>
                    <p className="profil-page__subtitle">Cliquez sur un champ pour le modifier, ✓ pour enregistrer, ✕ pour annuler.</p>
                </div>
                <SaveStatusBadge status={saveStatus} />
            </div>

            <div className="profil-sidebar">
                <div className="profil-sidebar-card">
                    <div className="profil-avatar-wrap profil-sidebar-avatar">
                        {photoUrl ? (
                            <img src={photoUrl} alt="Photo de profil" className="profil-sidebar-avatar__img" />
                        ) : (
                            <div className="profil-sidebar-avatar__placeholder">?</div>
                        )}
                        <label className={`profil-sidebar-avatar-edit${photoUploading ? " profil-upload-btn--disabled" : ""}`}>
                            <input
                                ref={photoInputRef}
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={handlePhotoChange}
                                disabled={photoUploading}
                                className="profil-file-input-hidden"
                            />
                            <IconCamera />
                        </label>
                    </div>

                    <p className="profil-sidebar-name">{titreProfessionnel || "Candidat"}</p>
                    <p className="profil-sidebar-role">
                        {photoUploading ? "Envoi en cours..." : "JPEG, PNG ou WebP — 5 Mo max"}
                    </p>
                    {photoError && <p className="profil-message profil-message--error">{photoError}</p>}
                </div>

                <div className="profil-sidebar-card">
                    <ProfileProgressBar score={scoreCompletion} />
                </div>

                <div className="profil-sidebar-card">
                    <nav className="profil-nav" aria-label="Navigation profil">
                        <a href="#coordonnees">Coordonnées</a>
                        <a href="#pro">Infos pro</a>
                        <a href="#parcours">Parcours</a>
                        <a href="#competences">Compétences</a>
                        <a href="#documents">Documents</a>
                        <a href="#video">Vidéo de présentation</a>
                        <a href="#reseaux">Réseaux</a>
                    </nav>
                </div>
            </div>

            <div className="profil-content">
                {loadError && <div className="profil-message profil-message--error">{loadError}</div>}
                {saveSuccessMsg && <div className="profil-message profil-message--success">{saveSuccessMsg}</div>}

                {/* Coordonnées */}
                <div className="profil-card" id="coordonnees">
                    <div className="profil-card__header">
                        <div className="profil-card__icon profil-card__icon--blue">
                            <IconCamera />
                        </div>
                        <p className="profil-card__section-title">Coordonnées</p>
                    </div>
                    <div className="profil-field-row">
                        <EditableField id="telephone" label="Téléphone" value={telephone} onSave={setTelephone} placeholder="+221 77 123 45 67" />
                        <EditableSelect
                            id="sexe"
                            label="Sexe"
                            value={sexe}
                            onSave={setSexe}
                            options={SEXE_OPTIONS}
                            emptyLabel="Non précisé"
                        />
                    </div>

                    <EditableField id="adresse" label="Adresse" value={adresse} onSave={setAdresse} placeholder="Rue, quartier..." />

                    <div className="profil-field-row profil-field-row--3">
                        <EditableSelect
                            id="ville"
                            label="Ville"
                            value={ville}
                            onSave={setVille}
                            options={asOptions(VILLES)}
                            emptyLabel="Sélectionnez une ville"
                        />
                        <EditableSelect
                            id="region"
                            label="Région"
                            value={region}
                            onSave={setRegion}
                            options={asOptions(REGIONS)}
                            emptyLabel="Sélectionnez une région"
                        />
                        <EditableSelect
                            id="pays"
                            label="Pays"
                            value={pays}
                            onSave={setPays}
                            options={asOptions(PAYS)}
                            emptyLabel="Sélectionnez un pays"
                        />
                    </div>

                    <div className="profil-toggle-row">
                        <label className={`profil-toggle${mobilite ? " profil-toggle--active" : ""}`}>
                            <input type="checkbox" checked={mobilite} onChange={(e) => setMobilite(e.target.checked)} />
                            Mobilité géographique
                        </label>
                        <label className={`profil-toggle${teletravail ? " profil-toggle--active" : ""}`}>
                            <input type="checkbox" checked={teletravail} onChange={(e) => setTeletravail(e.target.checked)} />
                            Ouvert au télétravail
                        </label>
                    </div>
                </div>

                {/* Infos professionnelles */}
                <div className="profil-card" id="pro">
                    <div className="profil-card__header">
                        <div className="profil-card__icon profil-card__icon--violet">
                            <IconDocument />
                        </div>
                        <p className="profil-card__section-title">Informations professionnelles</p>
                    </div>
                    <EditableField
                        id="titreProfessionnel"
                        label="Titre professionnel"
                        value={titreProfessionnel}
                        onSave={setTitreProfessionnel}
                        placeholder="Développeur Front-End & UX/UI Designer"
                    />
                    <EditableTextarea
                        id="aPropos"
                        label="À propos"
                        value={aPropos}
                        onSave={setAPropos}
                        placeholder="Présentez-vous en quelques lignes..."
                        rows={5}
                    />
                    <div className="profil-field-row profil-field-row--3">
                        <EditableSelect
                            id="niveauExperience"
                            label="Niveau d'expérience"
                            value={niveauExperience}
                            onSave={setNiveauExperience}
                            options={asOptions(NIVEAUX_EXPERIENCE)}
                            emptyLabel="Non précisé"
                        />
                        <EditableField
                            id="anneesExperience"
                            label="Années d'expérience"
                            type="number"
                            value={anneesExperience === "" ? "" : String(anneesExperience)}
                            onSave={(v) => setAnneesExperience(v === "" ? "" : Number(v))}
                        />
                        <EditableSelect
                            id="disponibilite"
                            label="Disponibilité"
                            value={disponibilite}
                            onSave={setDisponibilite}
                            options={asOptions(DISPONIBILITES)}
                            emptyLabel="Non précisé"
                        />
                    </div>
                </div>

                {/* Parcours */}
                <div className="profil-card" id="parcours">
                    <div className="profil-card__header">
                        <div className="profil-card__icon profil-card__icon--green">
                            <IconDocument />
                        </div>
                        <p className="profil-card__section-title">Parcours</p>
                    </div>
                    <p className="profil-card__subtitle">Formations</p>
                    <TagListEditor
                        values={formations}
                        onChange={setFormations}
                        placeholder="Ex : Licence Informatique - UCAD (2024), puis Entrée"
                        emptyLabel="Aucune formation ajoutée pour l'instant."
                    />
                    <p className="profil-card__subtitle">Certifications</p>
                    <TagListEditor
                        values={certifications}
                        onChange={setCertifications}
                        placeholder="Ex : AWS Certified Cloud Practitioner (2025), puis Entrée"
                        emptyLabel="Aucune certification ajoutée pour l'instant."
                    />
                </div>

                {/* Compétences / Langues */}
                <div className="profil-card" id="competences">
                    <div className="profil-card__header">
                        <div className="profil-card__icon profil-card__icon--orange">
                            <IconDocument />
                        </div>
                        <p className="profil-card__section-title">Compétences & langues</p>
                    </div>
                    <p className="profil-card__subtitle">Compétences</p>
                    <TagListEditor
                        values={competences}
                        onChange={setCompetences}
                        placeholder="Tapez une compétence puis Entrée (ex : React, TypeScript, Figma)"
                        emptyLabel="Aucune compétence ajoutée pour l'instant."
                    />
                    <p className="profil-card__subtitle">Langues</p>
                    <TagListEditor
                        values={langues}
                        onChange={setLangues}
                        placeholder="Ex : Français - Courant, puis Entrée"
                        emptyLabel="Aucune langue ajoutée pour l'instant."
                    />
                </div>

                {/* Documents */}
                <div className="profil-card" id="documents">
                    <div className="profil-card__header">
                        <div className="profil-card__icon profil-card__icon--gold">
                            <IconDocument />
                        </div>
                        <p className="profil-card__section-title">Documents</p>
                    </div>

                    <p className="profil-card__subtitle">CV</p>
                    <div className="profil-field">
                        {cvPresent && !cvUploading ? (
                            <div className="profil-file-card">
                                <div className="profil-file-card__icon"><IconDocument /></div>
                                <div className="profil-file-card__info">
                                    <div className="profil-file-card__name">{cvOriginalFilename ?? "cv.pdf"}</div>
                                    <div className="profil-file-card__meta">PDF</div>
                                </div>
                                <div className="profil-file-card__actions">
                                    <button type="button" className="profil-file-card__link" onClick={handleCvDownload}>Voir</button>
                                    <label className="profil-file-card__link">
                                        <input ref={cvInputRef} type="file" accept="application/pdf" onChange={handleCvChange} className="profil-file-input-hidden" />
                                        Remplacer
                                    </label>
                                </div>
                            </div>
                        ) : (
                            <label className={`profil-empty-upload${cvUploading ? " profil-upload-btn--disabled" : ""}`} style={{ display: "flex", cursor: "pointer" }}>
                                <input ref={cvInputRef} type="file" accept="application/pdf" onChange={handleCvChange} disabled={cvUploading} className="profil-file-input-hidden" />
                                <IconDocument />
                                <span className="profil-empty-upload__text">
                                    {cvUploading ? "Envoi en cours..." : "Cliquez pour ajouter votre CV (PDF, 5 Mo max)"}
                                </span>
                            </label>
                        )}
                        {cvError && <p className="profil-message profil-message--error">{cvError}</p>}
                    </div>

                    <p className="profil-card__subtitle">Lettre de motivation</p>
                    <div className="profil-field">
                        {lmPresente && !lmUploading ? (
                            <div className="profil-file-card">
                                <div className="profil-file-card__icon"><IconDocument /></div>
                                <div className="profil-file-card__info">
                                    <div className="profil-file-card__name">{lmOriginalFilename ?? "lettre-motivation.pdf"}</div>
                                    <div className="profil-file-card__meta">PDF</div>
                                </div>
                                <div className="profil-file-card__actions">
                                    <button type="button" className="profil-file-card__link" onClick={handleLmDownload}>Voir</button>
                                    <label className="profil-file-card__link">
                                        <input ref={lmInputRef} type="file" accept="application/pdf" onChange={handleLmChange} className="profil-file-input-hidden" />
                                        Remplacer
                                    </label>
                                </div>
                            </div>
                        ) : (
                            <label className={`profil-empty-upload${lmUploading ? " profil-upload-btn--disabled" : ""}`} style={{ display: "flex", cursor: "pointer" }}>
                                <input ref={lmInputRef} type="file" accept="application/pdf" onChange={handleLmChange} disabled={lmUploading} className="profil-file-input-hidden" />
                                <IconDocument />
                                <span className="profil-empty-upload__text">
                                    {lmUploading ? "Envoi en cours..." : "Cliquez pour ajouter votre lettre (PDF, 5 Mo max)"}
                                </span>
                            </label>
                        )}
                        {lmError && <p className="profil-message profil-message--error">{lmError}</p>}
                    </div>
                </div>

                {/* Vidéo de Présentation */}
                <div className="profil-card" id="video">
                    <div className="profil-card__header">
                        <div className="profil-card__icon profil-card__icon--violet">
                            <IconVideo />
                        </div>
                        <p className="profil-card__section-title">Vidéo de présentation</p>
                    </div>
                    <VideoPresentationManager onVideoUpdated={rechargerProfil} />
                </div>

                {/* Réseaux */}
                <div className="profil-card" id="reseaux">
                    <div className="profil-card__header">
                        <div className="profil-card__icon profil-card__icon--pink">
                            <IconDocument />
                        </div>
                        <p className="profil-card__section-title">Réseaux</p>
                    </div>
                    <div className="profil-field-row profil-field-row--3">
                        <EditableField id="linkedin" label="LinkedIn" value={linkedin} onSave={setLinkedin} placeholder="https://linkedin.com/in/..." />
                        <EditableField id="github" label="GitHub" value={github} onSave={setGithub} placeholder="https://github.com/..." />
                        <EditableField id="portfolio" label="Portfolio" value={portfolio} onSave={setPortfolio} placeholder="https://..." />
                    </div>
                </div>

                {/* Métadonnées */}
                <div className="profil-card">
                    <div className="profil-card__header">
                        <div className="profil-card__icon profil-card__icon--blue">
                            <IconDocument />
                        </div>
                        <p className="profil-card__section-title">Informations du compte</p>
                    </div>
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

                {/* Bouton global de sauvegarde */}
                <div className="profil-actions-footer">
                    <button
                        type="button"
                        className="profil-save-btn"
                        onClick={handleEnregistrerEtRafraichir}
                        disabled={saving}
                    >
                        {saving ? "Enregistrement en cours..." : "Enregistrer toutes les modifications"}
                    </button>
                </div>

            </div>
        </div>
    );
}