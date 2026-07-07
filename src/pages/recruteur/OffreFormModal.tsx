import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
    creerOffre,
    LABELS_NIVEAU_ETUDE,
    LABELS_NIVEAU_EXPERIENCE,
    LABELS_TYPE_CONTRAT,
    mettreAJourOffre,
    NIVEAUX_ETUDE,
    NIVEAUX_EXPERIENCE,
    obtenirOffre,
    TYPES_CONTRAT,
} from "../../api/offreService";
import type { NiveauEtude, NiveauExperience, OffreDTO, TypeContrat, UpsertOffreDTO } from "../../api/offreService";
import "./OffreFormModal.css";

const DTO_VIDE: UpsertOffreDTO = {
    titre: "",
    secteurActivite: "",
    typeContrat: "CDI",
    dateExpiration: undefined,
    pays: "Sénégal",
    region: "",
    ville: "",
    adresse: "",
    teletravail: false,
    hybride: false,
    description: "",
    missions: [],
    profilRecherche: "",
    niveauExperience: undefined,
    experienceMinimum: undefined,
    niveauEtude: undefined,
    competences: [],
    langues: [],
    certifications: [],
    salaireMin: undefined,
    salaireMax: undefined,
    devise: "FCFA",
    salaireVisible: true,
    avantages: [],
    nombrePostes: 1,
    dateDebut: undefined,
    disponibiliteSouhaitee: "",
    horaires: "",
};

function versInputDate(iso?: string): string {
    return iso ? iso.slice(0, 10) : "";
}

function versIso(valeurInput: string): string | undefined {
    return valeurInput ? new Date(`${valeurInput}T00:00:00`).toISOString() : undefined;
}

interface OffreFormModalProps {
    /** Présent = édition d'une offre existante. Absent = création. */
    offreId?: number;
    onFermer: () => void;
    /** Appelé avec l'offre créée/modifiée après un enregistrement réussi. */
    onEnregistre: (offre: OffreDTO) => void;
}

export function OffreFormModal({ offreId, onFermer, onEnregistre }: OffreFormModalProps) {
    const modeEdition = offreId !== undefined;

    const [dto, setDto] = useState<UpsertOffreDTO>(DTO_VIDE);
    const [chargement, setChargement] = useState(modeEdition);
    const [envoi, setEnvoi] = useState(false);
    const [erreur, setErreur] = useState<string | null>(null);

    useEffect(() => {
        if (offreId === undefined) return;
        // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch au montage, pattern standard
        (async () => {
            setChargement(true);
            try {
                const offre = await obtenirOffre(offreId);
                setDto({
                    titre: offre.titre,
                    secteurActivite: offre.secteurActivite ?? "",
                    typeContrat: offre.typeContrat,
                    dateExpiration: offre.dateExpiration ?? undefined,
                    pays: offre.pays ?? "",
                    region: offre.region ?? "",
                    ville: offre.ville ?? "",
                    adresse: offre.adresse ?? "",
                    teletravail: offre.teletravail ?? false,
                    hybride: offre.hybride ?? false,
                    description: offre.description ?? "",
                    missions: offre.missions ?? [],
                    profilRecherche: offre.profilRecherche ?? "",
                    niveauExperience: offre.niveauExperience ?? undefined,
                    experienceMinimum: offre.experienceMinimum ?? undefined,
                    niveauEtude: offre.niveauEtude ?? undefined,
                    competences: offre.competences ?? [],
                    langues: offre.langues ?? [],
                    certifications: offre.certifications ?? [],
                    salaireMin: offre.salaireMin ?? undefined,
                    salaireMax: offre.salaireMax ?? undefined,
                    devise: offre.devise ?? "FCFA",
                    salaireVisible: offre.salaireVisible ?? true,
                    avantages: offre.avantages ?? [],
                    nombrePostes: offre.nombrePostes ?? 1,
                    dateDebut: offre.dateDebut ?? undefined,
                    disponibiliteSouhaitee: offre.disponibiliteSouhaitee ?? "",
                    horaires: offre.horaires ?? "",
                });
            } catch {
                setErreur("Impossible de charger cette offre.");
            } finally {
                setChargement(false);
            }
        })();
    }, [offreId]);

    function champ<K extends keyof UpsertOffreDTO>(cle: K, valeur: UpsertOffreDTO[K]) {
        setDto((prev) => ({ ...prev, [cle]: valeur }));
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setEnvoi(true);
        setErreur(null);
        try {
            const offre = modeEdition ? await mettreAJourOffre(offreId!, dto) : await creerOffre(dto);
            onEnregistre(offre);
        } catch {
            setErreur("L'enregistrement a échoué. Vérifie les champs obligatoires.");
        } finally {
            setEnvoi(false);
        }
    }

    return (
        <div className="offre-modal__backdrop" onClick={onFermer}>
            <div className="offre-modal" onClick={(e) => e.stopPropagation()}>
                <div className="offre-modal__head">
                    <div>
                        <h2 className="offre-modal__title">{modeEdition ? "Modifier l'offre" : "Nouvelle offre"}</h2>
                        <p className="offre-modal__subtitle">
                            {modeEdition
                                ? "Les modifications s'appliquent immédiatement, même si l'offre est déjà publiée."
                                : "L'offre est créée en brouillon — tu pourras la publier ensuite."}
                        </p>
                    </div>
                    <button type="button" className="offre-modal__close" onClick={onFermer} aria-label="Fermer">
                        ×
                    </button>
                </div>

                {chargement ? (
                    <div className="offre-modal__loading">Chargement…</div>
                ) : (
                    <form className="offre-form" onSubmit={handleSubmit}>
                        {erreur && <div className="offre-form-alert">{erreur}</div>}

                        <div className="offre-form__body">
                            {/* ---------- Informations générales ---------- */}
                            <section className="offre-form__section">
                                <h3>Informations générales</h3>
                                <div className="offre-form__grid">
                                    <label className="offre-form__field offre-form__field--wide">
                                        <span>Titre du poste *</span>
                                        <input
                                            required
                                            maxLength={200}
                                            value={dto.titre}
                                            onChange={(e) => champ("titre", e.target.value)}
                                        />
                                    </label>
                                    <label className="offre-form__field">
                                        <span>Secteur d'activité</span>
                                        <input
                                            maxLength={150}
                                            value={dto.secteurActivite}
                                            onChange={(e) => champ("secteurActivite", e.target.value)}
                                        />
                                    </label>
                                    <label className="offre-form__field">
                                        <span>Type de contrat *</span>
                                        <select
                                            required
                                            value={dto.typeContrat}
                                            onChange={(e) => champ("typeContrat", e.target.value as TypeContrat)}
                                        >
                                            {TYPES_CONTRAT.map((t) => (
                                                <option key={t} value={t}>
                                                    {LABELS_TYPE_CONTRAT[t]}
                                                </option>
                                            ))}
                                        </select>
                                    </label>
                                    <label className="offre-form__field">
                                        <span>Date d'expiration</span>
                                        <input
                                            type="date"
                                            value={versInputDate(dto.dateExpiration)}
                                            onChange={(e) => champ("dateExpiration", versIso(e.target.value))}
                                        />
                                    </label>
                                    <label className="offre-form__field">
                                        <span>Nombre de postes</span>
                                        <input
                                            type="number"
                                            min={1}
                                            value={dto.nombrePostes ?? ""}
                                            onChange={(e) =>
                                                champ("nombrePostes", e.target.value ? Number(e.target.value) : undefined)
                                            }
                                        />
                                    </label>
                                </div>
                            </section>

                            {/* ---------- Localisation ---------- */}
                            <section className="offre-form__section">
                                <h3>Localisation</h3>
                                <div className="offre-form__grid">
                                    <label className="offre-form__field">
                                        <span>Pays</span>
                                        <input value={dto.pays} onChange={(e) => champ("pays", e.target.value)} />
                                    </label>
                                    <label className="offre-form__field">
                                        <span>Région</span>
                                        <input value={dto.region} onChange={(e) => champ("region", e.target.value)} />
                                    </label>
                                    <label className="offre-form__field">
                                        <span>Ville</span>
                                        <input value={dto.ville} onChange={(e) => champ("ville", e.target.value)} />
                                    </label>
                                    <label className="offre-form__field offre-form__field--wide">
                                        <span>Adresse</span>
                                        <input value={dto.adresse} onChange={(e) => champ("adresse", e.target.value)} />
                                    </label>
                                    <label className="offre-form__checkbox">
                                        <input
                                            type="checkbox"
                                            checked={dto.teletravail ?? false}
                                            onChange={(e) => champ("teletravail", e.target.checked)}
                                        />
                                        <span>Télétravail possible</span>
                                    </label>
                                    <label className="offre-form__checkbox">
                                        <input
                                            type="checkbox"
                                            checked={dto.hybride ?? false}
                                            onChange={(e) => champ("hybride", e.target.checked)}
                                        />
                                        <span>Poste hybride</span>
                                    </label>
                                </div>
                            </section>

                            {/* ---------- Description du poste ---------- */}
                            <section className="offre-form__section">
                                <h3>Description du poste</h3>
                                <label className="offre-form__field offre-form__field--wide">
                                    <span>Description</span>
                                    <textarea
                                        rows={4}
                                        maxLength={4000}
                                        value={dto.description}
                                        onChange={(e) => champ("description", e.target.value)}
                                    />
                                </label>
                                <TagListField
                                    label="Missions"
                                    valeurs={dto.missions ?? []}
                                    onChange={(v) => champ("missions", v)}
                                    placeholder="Ajouter une mission et valider"
                                />
                            </section>

                            {/* ---------- Profil recherché ---------- */}
                            <section className="offre-form__section">
                                <h3>Profil recherché</h3>
                                <label className="offre-form__field offre-form__field--wide">
                                    <span>Profil recherché</span>
                                    <textarea
                                        rows={3}
                                        maxLength={2000}
                                        value={dto.profilRecherche}
                                        onChange={(e) => champ("profilRecherche", e.target.value)}
                                    />
                                </label>
                                <div className="offre-form__grid">
                                    <label className="offre-form__field">
                                        <span>Niveau d'expérience</span>
                                        <select
                                            value={dto.niveauExperience ?? ""}
                                            onChange={(e) =>
                                                champ(
                                                    "niveauExperience",
                                                    (e.target.value || undefined) as NiveauExperience | undefined
                                                )
                                            }
                                        >
                                            <option value="">—</option>
                                            {NIVEAUX_EXPERIENCE.map((n) => (
                                                <option key={n} value={n}>
                                                    {LABELS_NIVEAU_EXPERIENCE[n]}
                                                </option>
                                            ))}
                                        </select>
                                    </label>
                                    <label className="offre-form__field">
                                        <span>Années d'expérience minimum</span>
                                        <input
                                            type="number"
                                            min={0}
                                            value={dto.experienceMinimum ?? ""}
                                            onChange={(e) =>
                                                champ(
                                                    "experienceMinimum",
                                                    e.target.value ? Number(e.target.value) : undefined
                                                )
                                            }
                                        />
                                    </label>
                                    <label className="offre-form__field">
                                        <span>Niveau d'étude</span>
                                        <select
                                            value={dto.niveauEtude ?? ""}
                                            onChange={(e) =>
                                                champ("niveauEtude", (e.target.value || undefined) as NiveauEtude | undefined)
                                            }
                                        >
                                            <option value="">—</option>
                                            {NIVEAUX_ETUDE.map((n) => (
                                                <option key={n} value={n}>
                                                    {LABELS_NIVEAU_ETUDE[n]}
                                                </option>
                                            ))}
                                        </select>
                                    </label>
                                </div>
                                <TagListField
                                    label="Compétences"
                                    valeurs={dto.competences ?? []}
                                    onChange={(v) => champ("competences", v)}
                                    placeholder="Ajouter une compétence et valider"
                                />
                                <TagListField
                                    label="Langues"
                                    valeurs={dto.langues ?? []}
                                    onChange={(v) => champ("langues", v)}
                                    placeholder="Ajouter une langue et valider"
                                />
                                <TagListField
                                    label="Certifications"
                                    valeurs={dto.certifications ?? []}
                                    onChange={(v) => champ("certifications", v)}
                                    placeholder="Ajouter une certification et valider"
                                />
                            </section>

                            {/* ---------- Salaire ---------- */}
                            <section className="offre-form__section">
                                <h3>Salaire</h3>
                                <div className="offre-form__grid">
                                    <label className="offre-form__field">
                                        <span>Salaire minimum</span>
                                        <input
                                            type="number"
                                            min={0}
                                            value={dto.salaireMin ?? ""}
                                            onChange={(e) =>
                                                champ("salaireMin", e.target.value ? Number(e.target.value) : undefined)
                                            }
                                        />
                                    </label>
                                    <label className="offre-form__field">
                                        <span>Salaire maximum</span>
                                        <input
                                            type="number"
                                            min={0}
                                            value={dto.salaireMax ?? ""}
                                            onChange={(e) =>
                                                champ("salaireMax", e.target.value ? Number(e.target.value) : undefined)
                                            }
                                        />
                                    </label>
                                    <label className="offre-form__field">
                                        <span>Devise</span>
                                        <input value={dto.devise} onChange={(e) => champ("devise", e.target.value)} />
                                    </label>
                                    <label className="offre-form__checkbox">
                                        <input
                                            type="checkbox"
                                            checked={dto.salaireVisible ?? true}
                                            onChange={(e) => champ("salaireVisible", e.target.checked)}
                                        />
                                        <span>Afficher le salaire publiquement</span>
                                    </label>
                                </div>
                                <TagListField
                                    label="Avantages"
                                    valeurs={dto.avantages ?? []}
                                    onChange={(v) => champ("avantages", v)}
                                    placeholder="Ajouter un avantage et valider"
                                />
                            </section>

                            {/* ---------- Informations complémentaires ---------- */}
                            <section className="offre-form__section">
                                <h3>Informations complémentaires</h3>
                                <div className="offre-form__grid">
                                    <label className="offre-form__field">
                                        <span>Date de début souhaitée</span>
                                        <input
                                            type="date"
                                            value={versInputDate(dto.dateDebut)}
                                            onChange={(e) => champ("dateDebut", versIso(e.target.value))}
                                        />
                                    </label>
                                    <label className="offre-form__field">
                                        <span>Disponibilité souhaitée</span>
                                        <input
                                            maxLength={100}
                                            value={dto.disponibiliteSouhaitee}
                                            onChange={(e) => champ("disponibiliteSouhaitee", e.target.value)}
                                        />
                                    </label>
                                    <label className="offre-form__field">
                                        <span>Horaires</span>
                                        <input
                                            maxLength={150}
                                            value={dto.horaires}
                                            onChange={(e) => champ("horaires", e.target.value)}
                                        />
                                    </label>
                                </div>
                            </section>
                        </div>

                        <div className="offre-modal__actions">
                            <button type="button" className="offres-btn offres-btn--ghost" onClick={onFermer}>
                                Annuler
                            </button>
                            <button type="submit" className="offres-btn offres-btn--primary" disabled={envoi}>
                                {envoi ? "Enregistrement…" : modeEdition ? "Enregistrer les modifications" : "Créer l'offre"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

function TagListField({
                          label,
                          valeurs,
                          onChange,
                          placeholder,
                      }: {
    label: string;
    valeurs: string[];
    onChange: (valeurs: string[]) => void;
    placeholder: string;
}) {
    const [saisie, setSaisie] = useState("");

    function ajouter() {
        const valeur = saisie.trim();
        if (!valeur || valeurs.includes(valeur)) {
            setSaisie("");
            return;
        }
        onChange([...valeurs, valeur]);
        setSaisie("");
    }

    function retirer(valeur: string) {
        onChange(valeurs.filter((v) => v !== valeur));
    }

    return (
        <div className="offre-form__field offre-form__field--wide offre-tags">
            <span>{label}</span>
            <div className="offre-tags__input-row">
                <input
                    value={saisie}
                    placeholder={placeholder}
                    onChange={(e) => setSaisie(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            ajouter();
                        }
                    }}
                />
                <button type="button" className="offres-btn offres-btn--ghost" onClick={ajouter}>
                    Ajouter
                </button>
            </div>
            {valeurs.length > 0 && (
                <div className="offre-tags__list">
                    {valeurs.map((v) => (
                        <button type="button" key={v} className="offre-tag" onClick={() => retirer(v)}>
                            {v} ×
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}