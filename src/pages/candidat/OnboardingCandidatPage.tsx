import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    getMonProfilCandidat,
    updateMonProfilCandidat,
    uploaderPhotoCandidat,
    uploaderCvCandidat,
    obtenirPhotoCandidatUrl,
    type ProfilCandidatDTO,
    type UpdateProfilCandidatPayload,
} from "../../api/profileService";
import "./onboardingCandidatPage.css";

// ---------------------------------------------------------------------------
// Données de référence (reprises de la page profil existante)
// ---------------------------------------------------------------------------

const NIVEAUX_EXPERIENCE = ["Débutant", "Junior", "Intermédiaire", "Sénior", "Expert"];
const DISPONIBILITES = ["Immédiate", "Sous 1 mois", "Sous 3 mois", "Non disponible"];
const REGIONS = [
    "Dakar", "Diourbel", "Fatick", "Kaffrine", "Kaolack", "Kédougou", "Kolda",
    "Louga", "Matam", "Saint-Louis", "Sédhiou", "Tambacounda", "Thiès", "Ziguinchor",
];
const VILLES = [
    "Dakar", "Pikine", "Guédiawaye", "Rufisque", "Thiès", "Mbour", "Tivaouane",
    "Saint-Louis", "Richard-Toll", "Kaolack", "Fatick", "Diourbel", "Touba", "Louga",
    "Kolda", "Ziguinchor", "Sédhiou", "Tambacounda", "Kédougou", "Matam", "Kaffrine",
];

type StepId = "coordonnees" | "professionnel" | "parcours" | "documents" | "reseaux" | "termine";

interface StepDef {
    id: StepId;
    label: string;
    eyebrow: string;
    description: string;
}

const STEPS: StepDef[] = [
    { id: "coordonnees", label: "Coordonnées", eyebrow: "Dossier 01", description: "Où et comment vous joindre." },
    { id: "professionnel", label: "Profil pro", eyebrow: "Dossier 02", description: "Ce que vous faites, votre niveau." },
    { id: "parcours", label: "Parcours", eyebrow: "Dossier 03", description: "Formations, compétences, langues." },
    { id: "documents", label: "Documents", eyebrow: "Dossier 04", description: "Photo et CV — le visa de votre profil." },
    { id: "reseaux", label: "Réseaux", eyebrow: "Dossier 05", description: "Vos vitrines en ligne (facultatif)." },
    { id: "termine", label: "Terminé", eyebrow: "Dossier 06", description: "Votre dossier est prêt." },
];

function StampIcon({ validated }: { validated: boolean }) {
    return (
        <span className={`ob-stamp${validated ? " ob-stamp--validated" : ""}`}>
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="17" strokeDasharray="3 3" />
                {validated && <path d="M12 20.5 17 25.5 28 14" strokeLinecap="round" strokeLinejoin="round" />}
            </svg>
        </span>
    );
}

export function OnboardingCandidatPage() {
    const navigate = useNavigate();
    const [stepIndex, setStepIndex] = useState(0);
    const [validatedSteps, setValidatedSteps] = useState<Set<StepId>>(new Set());
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [justStamped, setJustStamped] = useState(false);

    // Champs — étape 1
    const [telephone, setTelephone] = useState("");
    const [ville, setVille] = useState("");
    const [region, setRegion] = useState("");
    const [adresse, setAdresse] = useState("");
    const [mobilite, setMobilite] = useState(false);
    const [teletravail, setTeletravail] = useState(false);

    // Champs — étape 2
    const [titreProfessionnel, setTitreProfessionnel] = useState("");
    const [aPropos, setAPropos] = useState("");
    const [niveauExperience, setNiveauExperience] = useState("");
    const [anneesExperience, setAnneesExperience] = useState<number | "">("");
    const [disponibilite, setDisponibilite] = useState("");

    // Champs — étape 3
    const [formationInput, setFormationInput] = useState("");
    const [formations, setFormations] = useState<string[]>([]);
    const [competenceInput, setCompetenceInput] = useState("");
    const [competences, setCompetences] = useState<string[]>([]);
    const [langueInput, setLangueInput] = useState("");
    const [langues, setLangues] = useState<string[]>([]);

    // Champs — étape 4 (documents)
    const [photoUrl, setPhotoUrl] = useState<string | null>(null);
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [cvPresent, setCvPresent] = useState(false);
    const [cvFile, setCvFile] = useState<File | null>(null);
    const photoInputRef = useRef<HTMLInputElement>(null);
    const cvInputRef = useRef<HTMLInputElement>(null);

    // Champs — étape 5
    const [linkedin, setLinkedin] = useState("");
    const [github, setGithub] = useState("");
    const [portfolio, setPortfolio] = useState("");

    useEffect(() => {
        async function charger() {
            try {
                const data = await getMonProfilCandidat();
                appliquerDonnees(data);
                if (data.photoPresente) {
                    const url = await obtenirPhotoCandidatUrl();
                    setPhotoUrl(url);
                }
            } catch {
                setErrorMsg("Impossible de charger votre profil. Réessayez dans un instant.");
            } finally {
                setLoading(false);
            }
        }
        charger();
    }, []);

    function appliquerDonnees(data: ProfilCandidatDTO) {
        setTelephone(data.telephone ?? "");
        setVille(data.ville ?? "");
        setRegion(data.region ?? "");
        setAdresse(data.adresse ?? "");
        setMobilite(data.mobilite ?? false);
        setTeletravail(data.teletravail ?? false);
        setTitreProfessionnel(data.titreProfessionnel ?? "");
        setAPropos(data.aPropos ?? "");
        setNiveauExperience(data.niveauExperience ?? "");
        setAnneesExperience(data.anneesExperience ?? "");
        setDisponibilite(data.disponibilite ?? "");
        setFormations(data.formations ?? []);
        setCompetences(data.competences ?? []);
        setLangues(data.langues ?? []);
        setCvPresent(data.cvPresent);
        setLinkedin(data.linkedin ?? "");
        setGithub(data.github ?? "");
        setPortfolio(data.portfolio ?? "");
    }

    const currentStep = STEPS[stepIndex];
    const isLastContentStep = stepIndex === STEPS.length - 2; // avant "termine"
    const isFinalStep = currentStep.id === "termine";

    const progressPercent = useMemo(
        () => Math.round((validatedSteps.size / (STEPS.length - 1)) * 100),
        [validatedSteps]
    );

    function ajouterTag(valeur: string, liste: string[], setter: (v: string[]) => void, reset: () => void) {
        const v = valeur.trim();
        if (v && !liste.includes(v)) {
            setter([...liste, v]);
        }
        reset();
    }

    function retirerTag(index: number, liste: string[], setter: (v: string[]) => void) {
        setter(liste.filter((_, i) => i !== index));
    }

    async function sauvegarderEtapeCourante(): Promise<boolean> {
        setErrorMsg(null);
        setSaving(true);
        try {
            let payload: UpdateProfilCandidatPayload = {};

            if (currentStep.id === "coordonnees") {
                payload = { telephone, ville, region, adresse, mobilite, teletravail };
            } else if (currentStep.id === "professionnel") {
                payload = {
                    titreProfessionnel,
                    aPropos,
                    niveauExperience,
                    anneesExperience: anneesExperience === "" ? undefined : Number(anneesExperience),
                    disponibilite,
                };
            } else if (currentStep.id === "parcours") {
                payload = { formations, competences, langues };
            } else if (currentStep.id === "reseaux") {
                payload = { linkedin, github, portfolio };
            }

            if (Object.keys(payload).length > 0) {
                await updateMonProfilCandidat(payload);
            }

            if (currentStep.id === "documents") {
                if (photoFile) await uploaderPhotoCandidat(photoFile);
                if (cvFile) await uploaderCvCandidat(cvFile);
            }

            return true;
        } catch {
            setErrorMsg("La sauvegarde de cette étape a échoué. Vérifiez votre connexion et réessayez.");
            return false;
        } finally {
            setSaving(false);
        }
    }

    async function allerSuivant() {
        const ok = await sauvegarderEtapeCourante();
        if (!ok) return;

        setValidatedSteps(prev => new Set(prev).add(currentStep.id));
        setJustStamped(true);
        setTimeout(() => setJustStamped(false), 500);

        setTimeout(() => {
            setStepIndex(i => Math.min(i + 1, STEPS.length - 1));
        }, 280);
    }

    function allerPrecedent() {
        setErrorMsg(null);
        setStepIndex(i => Math.max(i - 1, 0));
    }

    function passerEtape() {
        setStepIndex(i => Math.min(i + 1, STEPS.length - 1));
    }

    function terminer() {
        navigate("/candidat/profil");
    }

    if (loading) {
        return <div className="ob-loading">Préparation de votre dossier...</div>;
    }

    return (
        <div className="ob-shell">
            {/* Panneau navy — progression façon dossier */}
            <aside className="ob-rail">
                <div className="ob-rail__brand">
                    <span className="ob-rail__brand-mark">TS</span>
                    <span className="ob-rail__brand-name">Talent Sénégal</span>
                </div>

                <div className="ob-rail__intro">
                    <p className="ob-rail__eyebrow">Constitution du dossier</p>
                    <h1 className="ob-rail__title">Bienvenue dans votre espace candidat</h1>
                    <p className="ob-rail__sub">
                        Quelques minutes suffisent pour bâtir un profil qui retient l'attention des recruteurs.
                    </p>
                </div>

                <ol className="ob-rail__steps">
                    {STEPS.slice(0, -1).map((step, idx) => {
                        const validated = validatedSteps.has(step.id);
                        const active = idx === stepIndex;
                        return (
                            <li
                                key={step.id}
                                className={`ob-rail__step${active ? " ob-rail__step--active" : ""}${validated ? " ob-rail__step--done" : ""}`}
                            >
                                <StampIcon validated={validated} />
                                <div className="ob-rail__step-text">
                                    <span className="ob-rail__step-eyebrow">{step.eyebrow}</span>
                                    <span className="ob-rail__step-label">{step.label}</span>
                                </div>
                            </li>
                        );
                    })}
                </ol>

                <div className="ob-rail__progress">
                    <div className="ob-rail__progress-track">
                        <div className="ob-rail__progress-fill" style={{ width: `${progressPercent}%` }} />
                    </div>
                    <span className="ob-rail__progress-label">{progressPercent}% du dossier constitué</span>
                </div>
            </aside>

            {/* Panneau clair — contenu de l'étape */}
            <main className="ob-content">
                <div className={`ob-card${justStamped ? " ob-card--stamping" : ""}`} key={currentStep.id}>
                    {!isFinalStep && (
                        <header className="ob-card__header">
                            <span className="ob-card__eyebrow">{currentStep.eyebrow}</span>
                            <h2 className="ob-card__title">{currentStep.label}</h2>
                            <p className="ob-card__desc">{currentStep.description}</p>
                        </header>
                    )}

                    {errorMsg && <div className="ob-alert">{errorMsg}</div>}

                    {currentStep.id === "coordonnees" && (
                        <div className="ob-form">
                            <div className="ob-field">
                                <label>Téléphone</label>
                                <input value={telephone} onChange={e => setTelephone(e.target.value)} placeholder="+221 77 123 45 67" />
                            </div>
                            <div className="ob-field-row">
                                <div className="ob-field">
                                    <label>Ville</label>
                                    <select value={ville} onChange={e => setVille(e.target.value)}>
                                        <option value="">Sélectionnez</option>
                                        {VILLES.map(v => <option key={v} value={v}>{v}</option>)}
                                    </select>
                                </div>
                                <div className="ob-field">
                                    <label>Région</label>
                                    <select value={region} onChange={e => setRegion(e.target.value)}>
                                        <option value="">Sélectionnez</option>
                                        {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="ob-field">
                                <label>Adresse</label>
                                <input value={adresse} onChange={e => setAdresse(e.target.value)} placeholder="Rue, quartier..." />
                            </div>
                            <div className="ob-toggle-row">
                                <label className={`ob-toggle${mobilite ? " ob-toggle--active" : ""}`}>
                                    <input type="checkbox" checked={mobilite} onChange={e => setMobilite(e.target.checked)} />
                                    Mobilité géographique
                                </label>
                                <label className={`ob-toggle${teletravail ? " ob-toggle--active" : ""}`}>
                                    <input type="checkbox" checked={teletravail} onChange={e => setTeletravail(e.target.checked)} />
                                    Ouvert au télétravail
                                </label>
                            </div>
                        </div>
                    )}

                    {currentStep.id === "professionnel" && (
                        <div className="ob-form">
                            <div className="ob-field">
                                <label>Titre professionnel</label>
                                <input
                                    value={titreProfessionnel}
                                    onChange={e => setTitreProfessionnel(e.target.value)}
                                    placeholder="Développeur Front-End & UX/UI Designer"
                                />
                            </div>
                            <div className="ob-field">
                                <label>À propos</label>
                                <textarea rows={5} value={aPropos} onChange={e => setAPropos(e.target.value)} placeholder="Présentez-vous en quelques lignes..." />
                            </div>
                            <div className="ob-field-row">
                                <div className="ob-field">
                                    <label>Niveau d'expérience</label>
                                    <select value={niveauExperience} onChange={e => setNiveauExperience(e.target.value)}>
                                        <option value="">Non précisé</option>
                                        {NIVEAUX_EXPERIENCE.map(n => <option key={n} value={n}>{n}</option>)}
                                    </select>
                                </div>
                                <div className="ob-field">
                                    <label>Années d'expérience</label>
                                    <input
                                        type="number"
                                        min={0}
                                        value={anneesExperience}
                                        onChange={e => setAnneesExperience(e.target.value === "" ? "" : Number(e.target.value))}
                                    />
                                </div>
                                <div className="ob-field">
                                    <label>Disponibilité</label>
                                    <select value={disponibilite} onChange={e => setDisponibilite(e.target.value)}>
                                        <option value="">Non précisé</option>
                                        {DISPONIBILITES.map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep.id === "parcours" && (
                        <div className="ob-form">
                            {/* Formations */}
                            <div className="ob-field">
                                <label>Formations</label>
                                <div className="ob-tag-input" style={{ display: "flex", gap: "8px" }}>
                                    <input
                                        style={{ flex: 1 }}
                                        value={formationInput}
                                        onChange={e => setFormationInput(e.target.value)}
                                        onKeyDown={e => e.key === "Enter" && (e.preventDefault(), ajouterTag(formationInput, formations, setFormations, () => setFormationInput("")))}
                                        placeholder="Ex : Licence Informatique - UCAD, 2024"
                                    />
                                    <button
                                        type="button"
                                        className="ob-btn ob-btn--ghost"
                                        onClick={() => ajouterTag(formationInput, formations, setFormations, () => setFormationInput(""))}
                                    >
                                        Ajouter
                                    </button>
                                </div>
                                <div className="ob-tags">
                                    {formations.map((f, i) => (
                                        <span className="ob-tag" key={i}>{f}<button type="button" onClick={() => retirerTag(i, formations, setFormations)}>×</button></span>
                                    ))}
                                </div>
                            </div>

                            {/* Compétences */}
                            <div className="ob-field">
                                <label>Compétences</label>
                                <div className="ob-tag-input" style={{ display: "flex", gap: "8px" }}>
                                    <input
                                        style={{ flex: 1 }}
                                        value={competenceInput}
                                        onChange={e => setCompetenceInput(e.target.value)}
                                        onKeyDown={e => e.key === "Enter" && (e.preventDefault(), ajouterTag(competenceInput, competences, setCompetences, () => setCompetenceInput("")))}
                                        placeholder="Ex : React"
                                    />
                                    <button
                                        type="button"
                                        className="ob-btn ob-btn--ghost"
                                        onClick={() => ajouterTag(competenceInput, competences, setCompetences, () => setCompetenceInput(""))}
                                    >
                                        Ajouter
                                    </button>
                                </div>
                                <div className="ob-tags">
                                    {competences.map((c, i) => (
                                        <span className="ob-tag" key={i}>{c}<button type="button" onClick={() => retirerTag(i, competences, setCompetences)}>×</button></span>
                                    ))}
                                </div>
                            </div>

                            {/* Langues */}
                            <div className="ob-field">
                                <label>Langues</label>
                                <div className="ob-tag-input" style={{ display: "flex", gap: "8px" }}>
                                    <input
                                        style={{ flex: 1 }}
                                        value={langueInput}
                                        onChange={e => setLangueInput(e.target.value)}
                                        onKeyDown={e => e.key === "Enter" && (e.preventDefault(), ajouterTag(langueInput, langues, setLangues, () => setLangueInput("")))}
                                        placeholder="Ex : Français - Courant"
                                    />
                                    <button
                                        type="button"
                                        className="ob-btn ob-btn--ghost"
                                        onClick={() => ajouterTag(langueInput, langues, setLangues, () => setLangueInput(""))}
                                    >
                                        Ajouter
                                    </button>
                                </div>
                                <div className="ob-tags">
                                    {langues.map((l, i) => (
                                        <span className="ob-tag" key={i}>{l}<button type="button" onClick={() => retirerTag(i, langues, setLangues)}>×</button></span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep.id === "documents" && (
                        <div className="ob-form">
                            <div className="ob-field">
                                <label>Photo de profil</label>
                                <label className="ob-dropzone">
                                    <input
                                        ref={photoInputRef}
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        className="ob-hidden-input"
                                        onChange={e => {
                                            const f = e.target.files?.[0];
                                            if (f) {
                                                setPhotoFile(f);
                                                setPhotoUrl(URL.createObjectURL(f));
                                            }
                                        }}
                                    />
                                    {photoUrl ? (
                                        <img src={photoUrl} alt="Aperçu" className="ob-dropzone__preview" />
                                    ) : (
                                        <span className="ob-dropzone__text">Cliquez pour ajouter une photo (JPEG, PNG, WebP)</span>
                                    )}
                                </label>
                            </div>
                            <div className="ob-field">
                                <label>CV (PDF)</label>
                                <label className="ob-dropzone ob-dropzone--doc">
                                    <input
                                        ref={cvInputRef}
                                        type="file"
                                        accept="application/pdf"
                                        className="ob-hidden-input"
                                        onChange={e => {
                                            const f = e.target.files?.[0];
                                            if (f) setCvFile(f);
                                        }}
                                    />
                                    <span className="ob-dropzone__text">
                                        {cvFile ? cvFile.name : cvPresent ? "CV déjà en ligne — cliquez pour remplacer" : "Cliquez pour ajouter votre CV (PDF, 5 Mo max)"}
                                    </span>
                                </label>
                            </div>
                        </div>
                    )}

                    {currentStep.id === "reseaux" && (
                        <div className="ob-form">
                            <div className="ob-field">
                                <label>LinkedIn</label>
                                <input value={linkedin} onChange={e => setLinkedin(e.target.value)} placeholder="https://linkedin.com/in/..." />
                            </div>
                            <div className="ob-field">
                                <label>GitHub</label>
                                <input value={github} onChange={e => setGithub(e.target.value)} placeholder="https://github.com/..." />
                            </div>
                            <div className="ob-field">
                                <label>Portfolio</label>
                                <input value={portfolio} onChange={e => setPortfolio(e.target.value)} placeholder="https://..." />
                            </div>
                        </div>
                    )}

                    {isFinalStep && (
                        <div className="ob-final">
                            <div className="ob-final__stamp">
                                <StampIcon validated={true} />
                            </div>
                            <h2 className="ob-final__title">Dossier constitué</h2>
                            <p className="ob-final__text">
                                Votre profil est prêt à être découvert par les recruteurs sénégalais. Vous pourrez
                                l'enrichir à tout moment depuis votre espace.
                            </p>
                            <button className="ob-btn ob-btn--primary" onClick={terminer}>
                                Découvrir mon espace
                            </button>
                        </div>
                    )}

                    {!isFinalStep && (
                        <footer className="ob-card__footer">
                            <button
                                type="button"
                                className="ob-btn ob-btn--ghost"
                                onClick={allerPrecedent}
                                disabled={stepIndex === 0 || saving}
                            >
                                Précédent
                            </button>

                            <div className="ob-card__footer-right">
                                {currentStep.id !== "coordonnees" && (
                                    <button type="button" className="ob-btn ob-btn--text" onClick={passerEtape} disabled={saving}>
                                        Passer cette étape
                                    </button>
                                )}
                                <button type="button" className="ob-btn ob-btn--primary" onClick={allerSuivant} disabled={saving}>
                                    {saving ? "Enregistrement..." : isLastContentStep ? "Terminer le dossier" : "Étape suivante"}
                                </button>
                            </div>
                        </footer>
                    )}
                </div>
            </main>
        </div>
    );
}