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
import { TagListEditor } from "../../components/common/TagListEditor";
import "./profilCandidatPage.css";

function formatDate(iso: string | null): string {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

function IconCamera() {
    return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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

const NIVEAUX_EXPERIENCE = ["Débutant", "Junior", "Intermédiaire", "Sénior", "Expert"];
const DISPONIBILITES = ["Immédiate", "Sous 1 mois", "Sous 3 mois", "Non disponible"];
const PAYS = ["Sénégal"];

const REGIONS = [
    "Dakar",
    "Diourbel",
    "Fatick",
    "Kaffrine",
    "Kaolack",
    "Kédougou",
    "Kolda",
    "Louga",
    "Matam",
    "Saint-Louis",
    "Sédhiou",
    "Tambacounda",
    "Thiès",
    "Ziguinchor"
];

const VILLES = [
    "Dakar",
    "Pikine",
    "Guédiawaye",
    "Rufisque",
    "Thiès",
    "Mbour",
    "Tivaouane",
    "Saint-Louis",
    "Richard-Toll",
    "Kaolack",
    "Fatick",
    "Diourbel",
    "Touba",
    "Louga",
    "Kolda",
    "Ziguinchor",
    "Sédhiou",
    "Tambacounda",
    "Kédougou",
    "Matam",
    "Kaffrine"
];

export function ProfilCandidatPage() {
    const { refreshPhoto } = useAuth();

    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);

    // Coordonnées personnelles
    const [telephone, setTelephone] = useState("");
    const [adresse, setAdresse] = useState("");
    const [sexe, setSexe] = useState("");
    const [ville, setVille] = useState("");
    const [region, setRegion] = useState("");
    const [pays, setPays] = useState("");
    const [mobilite, setMobilite] = useState(false);
    const [teletravail, setTeletravail] = useState(false);

    // Informations professionnelles
    const [titreProfessionnel, setTitreProfessionnel] = useState("");
    const [aPropos, setAPropos] = useState("");
    const [niveauExperience, setNiveauExperience] = useState("");
    const [anneesExperience, setAnneesExperience] = useState<number | "">("");
    const [disponibilite, setDisponibilite] = useState("");

    // Listes
    const [formations, setFormations] = useState<string[]>([]);
    const [certifications, setCertifications] = useState<string[]>([]);
    const [langues, setLangues] = useState<string[]>([]);
    const [competences, setCompetences] = useState<string[]>([]);

    // Réseaux
    const [linkedin, setLinkedin] = useState("");
    const [github, setGithub] = useState("");
    const [portfolio, setPortfolio] = useState("");

    // Photo
    const [photoUrl, setPhotoUrl] = useState<string | null>(null);
    const [photoUploading, setPhotoUploading] = useState(false);
    const [photoError, setPhotoError] = useState<string | null>(null);

    // CV
    const [cvPresent, setCvPresent] = useState(false);
    const [cvOriginalFilename, setCvOriginalFilename] = useState<string | null>(null);
    const [cvUploading, setCvUploading] = useState(false);
    const [cvError, setCvError] = useState<string | null>(null);

    // Lettre de motivation
    const [lmPresente, setLmPresente] = useState(false);
    const [lmOriginalFilename, setLmOriginalFilename] = useState<string | null>(null);
    const [lmUploading, setLmUploading] = useState(false);
    const [lmError, setLmError] = useState<string | null>(null);

    const [dateCreation, setDateCreation] = useState<string | null>(null);
    const [dateMaj, setDateMaj] = useState<string | null>(null);

    const photoInputRef = useRef<HTMLInputElement>(null);
    const cvInputRef = useRef<HTMLInputElement>(null);
    const lmInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        async function charger() {
            try {
                const data: ProfilCandidatDTO = await getMonProfilCandidat();
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
            telephone,
            adresse,
            sexe,
            ville,
            region,
            pays,
            mobilite,
            teletravail,
            titreProfessionnel,
            aPropos,
            niveauExperience,
            anneesExperience,
            disponibilite,
            formations,
            certifications,
            langues,
            competences,
            linkedin,
            github,
            portfolio,
        },
        async (value) => {
            const updated = await updateMonProfilCandidat({
                ...value,
                anneesExperience: value.anneesExperience === "" ? undefined : Number(value.anneesExperience),
            });
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
            setDateMaj(updated.dateMaj);

            if (photoUrl) URL.revokeObjectURL(photoUrl);
            const url = await obtenirPhotoCandidatUrl();
            setPhotoUrl(url);

            await refreshPhoto();
        } catch {
            setPhotoError("Échec de l'envoi. Format accepté : JPEG, PNG, WebP (2 Mo max).");
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
            setCvError("Échec de l'envoi. Le fichier doit être un PDF (5 Mo max).");
        } finally {
            setCvUploading(false);
            if (cvInputRef.current) cvInputRef.current.value = "";
        }
    }

    async function handleLmChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        setLmError(null);
        setLmUploading(true);
        try {
            const updated = await uploaderLettreMotivation(file);
            setLmPresente(updated.lettreMotivationPresente);
            setLmOriginalFilename(updated.lettreMotivationOriginalFilename);
            setDateMaj(updated.dateMaj);
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
                    <p className="profil-page__subtitle">Vos modifications sont enregistrées automatiquement.</p>
                </div>
                <SaveStatusBadge status={saveStatus} />
            </div>

            {loadError && <div className="profil-message profil-message--error">{loadError}</div>}

            {/* Photo */}
            <div className="profil-card">
                <p className="profil-card__section-title">Photo de profil</p>
                <div className="profil-avatar-row">
                    <div className="profil-avatar-wrap">
                        {photoUrl ? (
                            <img src={photoUrl} alt="Photo de profil" className="profil-photo-preview" />
                        ) : (
                            <div className="profil-photo-placeholder">?</div>
                        )}
                        <label className={`profil-avatar-edit${photoUploading ? " profil-upload-btn--disabled" : ""}`}>
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
                    <div className="profil-avatar-info">
                        <p className="profil-avatar-info__title">
                            {photoUploading ? "Envoi en cours..." : "Cliquez sur l'icône pour changer votre photo"}
                        </p>
                        <p className="profil-field__hint" style={{ margin: 0 }}>
                            JPEG, PNG ou WebP — 2 Mo maximum.
                        </p>
                        {photoError && <p className="profil-message profil-message--error">{photoError}</p>}
                    </div>
                </div>
            </div>

            {/* Coordonnées personnelles */}
            <div className="profil-card">
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
                        <label htmlFor="sexe">Sexe</label>
                        <select id="sexe" value={sexe} onChange={(e) => setSexe(e.target.value)}>
                            <option value="">Non précisé</option>
                            <option value="HOMME">Homme</option>
                            <option value="FEMME">Femme</option>
                        </select>
                    </div>
                </div>

                <div className="profil-field">
                    <label htmlFor="adresse">Adresse</label>
                    <input id="adresse" value={adresse} onChange={(e) => setAdresse(e.target.value)} placeholder="Rue, quartier..." />
                </div>

                <div className="profil-field-row profil-field-row--3">
                    <div className="profil-field">
                        <label htmlFor="ville">Ville</label>
                        <select
                            id="ville"
                            value={ville}
                            onChange={(e) => setVille(e.target.value)}
                        >
                            <option value="">Sélectionnez une ville</option>
                            {VILLES.map((v) => (
                                <option key={v} value={v}>
                                    {v}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="profil-field">
                        <label htmlFor="region">Région</label>
                        <select
                            id="region"
                            value={region}
                            onChange={(e) => setRegion(e.target.value)}
                        >
                            <option value="">Sélectionnez une région</option>
                            {REGIONS.map((r) => (
                                <option key={r} value={r}>
                                    {r}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="profil-field">
                        <label htmlFor="pays">Pays</label>
                        <select
                            id="pays"
                            value={pays}
                            onChange={(e) => setPays(e.target.value)}
                        >
                            <option value="">Sélectionnez un pays</option>
                            {PAYS.map((p) => (
                                <option key={p} value={p}>
                                    {p}
                                </option>
                            ))}
                        </select>
                    </div>
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

            {/* Informations professionnelles */}
            <div className="profil-card">
                <p className="profil-card__section-title">Informations professionnelles</p>
                <div className="profil-field">
                    <label htmlFor="titreProfessionnel">Titre professionnel</label>
                    <input
                        id="titreProfessionnel"
                        value={titreProfessionnel}
                        onChange={(e) => setTitreProfessionnel(e.target.value)}
                        placeholder="Développeur Full Stack Java/Angular"
                    />
                </div>
                <div className="profil-field">
                    <label htmlFor="aPropos">À propos</label>
                    <textarea
                        id="aPropos"
                        rows={5}
                        value={aPropos}
                        onChange={(e) => setAPropos(e.target.value)}
                        placeholder="Présentez-vous en quelques lignes..."
                    />
                </div>
                <div className="profil-field-row profil-field-row--3">
                    <div className="profil-field">
                        <label htmlFor="niveauExperience">Niveau d'expérience</label>
                        <select id="niveauExperience" value={niveauExperience} onChange={(e) => setNiveauExperience(e.target.value)}>
                            <option value="">Non précisé</option>
                            {NIVEAUX_EXPERIENCE.map((n) => (
                                <option key={n} value={n}>
                                    {n}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="profil-field">
                        <label htmlFor="anneesExperience">Années d'expérience</label>
                        <input
                            id="anneesExperience"
                            type="number"
                            min={0}
                            value={anneesExperience}
                            onChange={(e) => setAnneesExperience(e.target.value === "" ? "" : Number(e.target.value))}
                        />
                    </div>
                    <div className="profil-field">
                        <label htmlFor="disponibilite">Disponibilité</label>
                        <select id="disponibilite" value={disponibilite} onChange={(e) => setDisponibilite(e.target.value)}>
                            <option value="">Non précisé</option>
                            {DISPONIBILITES.map((d) => (
                                <option key={d} value={d}>
                                    {d}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Formation / Certifications */}
            <div className="profil-card">
                <p className="profil-card__section-title">Parcours</p>
                <p className="profil-card__subtitle">Formations</p>
                <TagListEditor
                    values={formations}
                    onChange={setFormations}
                    placeholder="Ex : Licence Informatique - UCAD (2022), puis Entrée"
                    emptyLabel="Aucune formation ajoutée pour l'instant."
                />

                <p className="profil-card__subtitle">Certifications</p>
                <TagListEditor
                    values={certifications}
                    onChange={setCertifications}
                    placeholder="Ex : AWS Certified Cloud Practitioner (2024), puis Entrée"
                    emptyLabel="Aucune certification ajoutée pour l'instant."
                />
            </div>

            {/* Compétences / Langues */}
            <div className="profil-card">
                <p className="profil-card__section-title">Compétences & langues</p>
                <p className="profil-card__subtitle">Compétences</p>
                <TagListEditor
                    values={competences}
                    onChange={setCompetences}
                    placeholder="Tapez une compétence puis Entrée (ex : Java, Spring Boot)"
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

            {/* CV / Lettre de motivation */}
            <div className="profil-card">
                <p className="profil-card__section-title">Documents</p>

                <p className="profil-card__subtitle">CV</p>
                <div className="profil-field">
                    {cvPresent && !cvUploading ? (
                        <div className="profil-file-card">
                            <div className="profil-file-card__icon">
                                <IconDocument />
                            </div>
                            <div className="profil-file-card__info">
                                <div className="profil-file-card__name">{cvOriginalFilename ?? "cv.pdf"}</div>
                                <div className="profil-file-card__meta">PDF</div>
                            </div>
                            <div className="profil-file-card__actions">
                                <button type="button" className="profil-file-card__link" onClick={handleCvDownload}>
                                    Voir
                                </button>
                                <label className="profil-file-card__link">
                                    <input
                                        ref={cvInputRef}
                                        type="file"
                                        accept="application/pdf"
                                        onChange={handleCvChange}
                                        className="profil-file-input-hidden"
                                    />
                                    Remplacer
                                </label>
                            </div>
                        </div>
                    ) : (
                        <label className={`profil-empty-upload${cvUploading ? " profil-upload-btn--disabled" : ""}`} style={{ display: "flex", cursor: "pointer" }}>
                            <input
                                ref={cvInputRef}
                                type="file"
                                accept="application/pdf"
                                onChange={handleCvChange}
                                disabled={cvUploading}
                                className="profil-file-input-hidden"
                            />
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
                            <div className="profil-file-card__icon">
                                <IconDocument />
                            </div>
                            <div className="profil-file-card__info">
                                <div className="profil-file-card__name">{lmOriginalFilename ?? "lettre-motivation.pdf"}</div>
                                <div className="profil-file-card__meta">PDF</div>
                            </div>
                            <div className="profil-file-card__actions">
                                <button type="button" className="profil-file-card__link" onClick={handleLmDownload}>
                                    Voir
                                </button>
                                <label className="profil-file-card__link">
                                    <input
                                        ref={lmInputRef}
                                        type="file"
                                        accept="application/pdf"
                                        onChange={handleLmChange}
                                        className="profil-file-input-hidden"
                                    />
                                    Remplacer
                                </label>
                            </div>
                        </div>
                    ) : (
                        <label className={`profil-empty-upload${lmUploading ? " profil-upload-btn--disabled" : ""}`} style={{ display: "flex", cursor: "pointer" }}>
                            <input
                                ref={lmInputRef}
                                type="file"
                                accept="application/pdf"
                                onChange={handleLmChange}
                                disabled={lmUploading}
                                className="profil-file-input-hidden"
                            />
                            <IconDocument />
                            <span className="profil-empty-upload__text">
                                {lmUploading ? "Envoi en cours..." : "Cliquez pour ajouter votre lettre (PDF, 5 Mo max)"}
                            </span>
                        </label>
                    )}
                    {lmError && <p className="profil-message profil-message--error">{lmError}</p>}
                </div>
            </div>

            {/* Réseaux */}
            <div className="profil-card">
                <p className="profil-card__section-title">Réseaux</p>
                <div className="profil-field-row profil-field-row--3">
                    <div className="profil-field">
                        <label htmlFor="linkedin">LinkedIn</label>
                        <input
                            id="linkedin"
                            value={linkedin}
                            onChange={(e) => setLinkedin(e.target.value)}
                            placeholder="https://linkedin.com/in/..."
                        />
                    </div>
                    <div className="profil-field">
                        <label htmlFor="github">GitHub</label>
                        <input id="github" value={github} onChange={(e) => setGithub(e.target.value)} placeholder="https://github.com/..." />
                    </div>
                    <div className="profil-field">
                        <label htmlFor="portfolio">Portfolio</label>
                        <input id="portfolio" value={portfolio} onChange={(e) => setPortfolio(e.target.value)} placeholder="https://..." />
                    </div>
                </div>
            </div>

            {/* Meta */}
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