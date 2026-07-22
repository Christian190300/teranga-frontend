import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    creerOffre,
    mettreAJourOffre,
    obtenirOffre,
    type TypeContrat,
    type NiveauExperience,
    type NiveauEtude,
    type UpsertOffrePayload,
} from "../../api/offreService";
import { TagListEditor } from "../../components/common/TagListEditor";
import "../offres/offres.css";
import {SECTEURS_ACTIVITE } from "../../constants/secteursActivite";
import { REGIONS_SENEGAL } from "../../constants/regions";
import { PAYS } from "../../constants/pays";
import { DISPONIBILITES } from "../../constants/disponibilites";

const TYPES_CONTRAT: TypeContrat[] = ["CDI", "CDD", "STAGE", "FREELANCE", "INTERIM", "ALTERNANCE", "SERVICE_CIVIQUE", "TEMPS_PARTIEL"];
const NIVEAUX_EXPERIENCE: NiveauExperience[] = ["DEBUTANT", "JUNIOR", "INTERMEDIAIRE", "SENIOR", "EXPERT"];
const NIVEAUX_ETUDE: NiveauEtude[] = ["AUCUN", "BAC", "BAC_2", "BAC_3", "BAC_5", "DOCTORAT"];


export function OffreFormPage() {
    const { id } = useParams<{ id?: string }>();
    const navigate = useNavigate();
    const modeEdition = Boolean(id);

    const [loading, setLoading] = useState(modeEdition);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [titre, setTitre] = useState("");
    const [secteurActivite, setSecteurActivite] = useState("");
    const [typeContrat, setTypeContrat] = useState<TypeContrat>("CDI");
    const [pays, setPays] = useState("Sénégal");
    const [region, setRegion] = useState("");
    const [ville, setVille] = useState("");
    const [adresse, setAdresse] = useState("");
    const [teletravail, setTeletravail] = useState(false);
    const [hybride, setHybride] = useState(false);
    const [description, setDescription] = useState("");
    const [missions, setMissions] = useState<string[]>([]);
    const [profilRecherche, setProfilRecherche] = useState("");
    const [niveauExperience, setNiveauExperience] = useState<NiveauExperience | "">("");
    const [experienceMinimum, setExperienceMinimum] = useState<number | "">("");
    const [niveauEtude, setNiveauEtude] = useState<NiveauEtude | "">("");
    const [competences, setCompetences] = useState<string[]>([]);
    const [langues, setLangues] = useState<string[]>([]);
    const [certifications, setCertifications] = useState<string[]>([]);
    const [salaireMin, setSalaireMin] = useState<number | "">("");
    const [salaireMax, setSalaireMax] = useState<number | "">("");
    const [salaireVisible, setSalaireVisible] = useState(true);
    const [avantages, setAvantages] = useState<string[]>([]);
    const [nombrePostes, setNombrePostes] = useState<number | "">(1);
    const [disponibiliteSouhaitee, setDisponibiliteSouhaitee] = useState("");
    const [horaires, setHoraires] = useState("");

    useEffect(() => {
        if (!modeEdition) return;
        async function charger() {
            try {
                const offre = await obtenirOffre(Number(id));
                setTitre(offre.titre);
                setSecteurActivite(offre.secteurActivite ?? "");
                setTypeContrat(offre.typeContrat);
                setPays(offre.pays ?? "");
                setRegion(offre.region ?? "");
                setVille(offre.ville ?? "");
                setAdresse(offre.adresse ?? "");
                setTeletravail(offre.teletravail ?? false);
                setHybride(offre.hybride ?? false);
                setDescription(offre.description ?? "");
                setMissions(offre.missions ?? []);
                setProfilRecherche(offre.profilRecherche ?? "");
                setNiveauExperience(offre.niveauExperience ?? "");
                setExperienceMinimum(offre.experienceMinimum ?? "");
                setNiveauEtude(offre.niveauEtude ?? "");
                setCompetences(offre.competences ?? []);
                setLangues(offre.langues ?? []);
                setCertifications(offre.certifications ?? []);
                setSalaireMin(offre.salaireMin ?? "");
                setSalaireMax(offre.salaireMax ?? "");
                setSalaireVisible(offre.salaireVisible ?? true);
                setAvantages(offre.avantages ?? []);
                setNombrePostes(offre.nombrePostes ?? 1);
                setDisponibiliteSouhaitee(offre.disponibiliteSouhaitee ?? "");
                setHoraires(offre.horaires ?? "");
            } catch {
                setError("Impossible de charger cette offre.");
            } finally {
                setLoading(false);
            }
        }
        charger();
    }, [id, modeEdition]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setSaving(true);

        const payload: UpsertOffrePayload = {
            titre,
            secteurActivite: secteurActivite || undefined,
            typeContrat,
            pays: pays || undefined,
            region: region || undefined,
            ville: ville || undefined,
            adresse: adresse || undefined,
            teletravail,
            hybride,
            description: description || undefined,
            missions,
            profilRecherche: profilRecherche || undefined,
            niveauExperience: niveauExperience || undefined,
            experienceMinimum: experienceMinimum === "" ? undefined : Number(experienceMinimum),
            niveauEtude: niveauEtude || undefined,
            competences,
            langues,
            certifications,
            salaireMin: salaireMin === "" ? undefined : Number(salaireMin),
            salaireMax: salaireMax === "" ? undefined : Number(salaireMax),
            salaireVisible,
            avantages,
            nombrePostes: nombrePostes === "" ? undefined : Number(nombrePostes),
            disponibiliteSouhaitee: disponibiliteSouhaitee || undefined,
            horaires: horaires || undefined,
        };

        try {
            if (modeEdition) {
                await mettreAJourOffre(Number(id), payload);
            } else {
                await creerOffre(payload);
            }
            navigate("/recruteur/offres");
        } catch {
            setError("Impossible d'enregistrer l'offre. Vérifiez les champs obligatoires (titre, type de contrat).");
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return <div className="offres-page__loading">Chargement de l'offre...</div>;
    }

    return (
        <div className="offres-page">
            <div className="offres-page__header">
                <div>
                    <h1 className="offres-page__title">{modeEdition ? "Modifier l'offre" : "Nouvelle offre"}</h1>
                    <p className="offres-page__subtitle">
                        {modeEdition ? "Vos changements ne seront visibles qu'après enregistrement." : "L'offre sera créée en brouillon."}
                    </p>
                </div>
            </div>

            {error && <div className="offre-message--error">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="offre-form-card">
                    <p className="offre-form-card__section-title">Informations générales</p>
                    <div className="offre-field">
                        <label htmlFor="titre">Titre du poste *</label>
                        <input id="titre" required value={titre} onChange={(e) => setTitre(e.target.value)} placeholder="Développeur Full Stack" />
                    </div>
                    <div className="offre-field-row">
                        <div className="offre-field">
                            <label htmlFor="secteurActivite">Secteur d'activité</label>

                            <select
                                id="secteurActivite"
                                value={secteurActivite}
                                onChange={(e) => setSecteurActivite(e.target.value)}
                            >
                                <option value="">Sélectionnez un secteur</option>

                                {SECTEURS_ACTIVITE.map((secteur) => (
                                    <option key={secteur} value={secteur}>
                                        {secteur}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="offre-field">
                            <label htmlFor="typeContrat">Type de contrat *</label>
                            <select id="typeContrat" value={typeContrat} onChange={(e) => setTypeContrat(e.target.value as TypeContrat)}>
                                {TYPES_CONTRAT.map((t) => (
                                    <option key={t} value={t}>
                                        {t}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="offre-form-card">
                    <p className="offre-form-card__section-title">Localisation</p>
                    <div className="offre-field-row offre-field-row--3">
                        <div className="offre-field">
                            <label htmlFor="ville">Ville</label>
                            <input id="ville" value={ville} onChange={(e) => setVille(e.target.value)} />
                        </div>
                        <div className="offre-field">
                            <label htmlFor="region">Région</label>
                            <select
                                id="region"
                                value={region}
                                onChange={(e) => setRegion(e.target.value)}
                            >
                                <option value="">Sélectionnez une région</option>

                                {REGIONS_SENEGAL.map((r) => (
                                    <option key={r} value={r}>
                                        {r}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="offre-field">
                            <label htmlFor="pays">Pays</label>
                            <select
                                id="pays"
                                value={pays}
                                onChange={(e) => setPays(e.target.value)}
                            >
                                {PAYS.map((p) => (
                                    <option key={p} value={p}>
                                        {p}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="offre-field">
                        <label htmlFor="adresse">Adresse</label>
                        <input id="adresse" value={adresse} onChange={(e) => setAdresse(e.target.value)} />
                    </div>
                    <div className="offre-field-row">
                        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <input type="checkbox" checked={teletravail} onChange={(e) => setTeletravail(e.target.checked)} />
                            Télétravail possible
                        </label>
                        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <input type="checkbox" checked={hybride} onChange={(e) => setHybride(e.target.checked)} />
                            Mode hybride
                        </label>
                    </div>
                </div>

                <div className="offre-form-card">
                    <p className="offre-form-card__section-title">Description du poste</p>
                    <div className="offre-field">
                        <label htmlFor="description">Description</label>
                        <textarea id="description" rows={5} value={description} onChange={(e) => setDescription(e.target.value)} />
                    </div>
                    <div className="offre-field">
                        <label>Missions</label>
                        <TagListEditor
                            values={missions}
                            onChange={setMissions}
                            placeholder="Ex : Développer de nouvelles fonctionnalités, puis Entrée"
                            emptyLabel="Aucune mission ajoutée."
                        />
                    </div>
                </div>

                <div className="offre-form-card">
                    <p className="offre-form-card__section-title">Profil recherché</p>
                    <div className="offre-field">
                        <label htmlFor="profilRecherche">Profil recherché</label>
                        <textarea id="profilRecherche" rows={4} value={profilRecherche} onChange={(e) => setProfilRecherche(e.target.value)} />
                    </div>
                    <div className="offre-field-row offre-field-row--3">
                        <div className="offre-field">
                            <label htmlFor="niveauExperience">Niveau d'expérience</label>
                            <select
                                id="niveauExperience"
                                value={niveauExperience}
                                onChange={(e) => setNiveauExperience(e.target.value as NiveauExperience)}
                            >
                                <option value="">Non précisé</option>
                                {NIVEAUX_EXPERIENCE.map((n) => (
                                    <option key={n} value={n}>
                                        {n}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="offre-field">
                            <label htmlFor="experienceMinimum">Expérience min. (années)</label>
                            <input
                                id="experienceMinimum"
                                type="number"
                                min={0}
                                value={experienceMinimum}
                                onChange={(e) => setExperienceMinimum(e.target.value === "" ? "" : Number(e.target.value))}
                            />
                        </div>
                        <div className="offre-field">
                            <label htmlFor="niveauEtude">Niveau d'étude</label>
                            <select id="niveauEtude" value={niveauEtude} onChange={(e) => setNiveauEtude(e.target.value as NiveauEtude)}>
                                <option value="">Non précisé</option>
                                {NIVEAUX_ETUDE.map((n) => (
                                    <option key={n} value={n}>
                                        {n}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="offre-field">
                        <label>Compétences requises</label>
                        <TagListEditor
                            values={competences}
                            onChange={setCompetences}
                            placeholder="Ex : Java, puis Entrée"
                            emptyLabel="Aucune compétence ajoutée."
                        />
                    </div>
                    <div className="offre-field">
                        <label>Langues</label>
                        <TagListEditor
                            values={langues}
                            onChange={setLangues}
                            placeholder="Ex : Français, puis Entrée"
                            emptyLabel="Aucune langue ajoutée."
                        />
                    </div>
                    <div className="offre-field">
                        <label>Certifications souhaitées</label>
                        <TagListEditor
                            values={certifications}
                            onChange={setCertifications}
                            placeholder="Ex : AWS Certified, puis Entrée"
                            emptyLabel="Aucune certification ajoutée."
                        />
                    </div>
                </div>

                <div className="offre-form-card">
                    <p className="offre-form-card__section-title">Rémunération & avantages</p>
                    <div className="offre-field-row">
                        <div className="offre-field">
                            <label htmlFor="salaireMin">Salaire minimum</label>
                            <input
                                id="salaireMin"
                                type="number"
                                min={0}
                                value={salaireMin}
                                onChange={(e) => setSalaireMin(e.target.value === "" ? "" : Number(e.target.value))}
                            />
                        </div>
                        <div className="offre-field">
                            <label htmlFor="salaireMax">Salaire maximum</label>
                            <input
                                id="salaireMax"
                                type="number"
                                min={0}
                                value={salaireMax}
                                onChange={(e) => setSalaireMax(e.target.value === "" ? "" : Number(e.target.value))}
                            />
                        </div>
                    </div>
                    <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
                        <input type="checkbox" checked={salaireVisible} onChange={(e) => setSalaireVisible(e.target.checked)} />
                        Afficher le salaire publiquement
                    </label>
                    <div className="offre-field">
                        <label>Avantages</label>
                        <TagListEditor
                            values={avantages}
                            onChange={setAvantages}
                            placeholder="Ex : Assurance santé, puis Entrée"
                            emptyLabel="Aucun avantage ajouté."
                        />
                    </div>
                </div>

                <div className="offre-form-card">
                    <p className="offre-form-card__section-title">Informations complémentaires</p>
                    <div className="offre-field-row">
                        <div className="offre-field">
                            <label htmlFor="nombrePostes">Nombre de postes</label>
                            <input
                                id="nombrePostes"
                                type="number"
                                min={1}
                                value={nombrePostes}
                                onChange={(e) => setNombrePostes(e.target.value === "" ? "" : Number(e.target.value))}
                            />
                        </div>
                        <div className="offre-field">
                            <label htmlFor="disponibiliteSouhaitee">Disponibilité souhaitée</label>
                            <select
                                id="disponibiliteSouhaitee"
                                value={disponibiliteSouhaitee}
                                onChange={(e) => setDisponibiliteSouhaitee(e.target.value)}
                            >
                                <option value="">Sélectionnez une disponibilité</option>

                                {DISPONIBILITES.map((d) => (
                                    <option key={d} value={d}>
                                        {d}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="offre-field">
                        <label htmlFor="horaires">Horaires</label>
                        <input id="horaires" value={horaires} onChange={(e) => setHoraires(e.target.value)} placeholder="Temps plein, 9h-18h" />
                    </div>
                </div>

                <div className="offre-form-actions">
                    <button type="button" className="btn-secondary" onClick={() => navigate("/recruteur/offres")}>
                        Annuler
                    </button>
                    <button type="submit" className="btn-primary" disabled={saving}>
                        {saving ? "Enregistrement..." : modeEdition ? "Enregistrer" : "Créer l'offre"}
                    </button>
                </div>
            </form>
        </div>
    );
}