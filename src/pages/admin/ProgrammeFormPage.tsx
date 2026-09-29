// pages/programmesAdmin/ProgrammeFormPage.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    creerProgramme,
    modifierProgramme,
    obtenirProgrammeAdmin,
    uploaderImageEtape,
    uploaderImageProgramme,
    urlImageEtapeAdmin,
    urlImageProgrammeAdmin,
    type CreerModifierProgrammeDTO,
    type EtapeProgrammeDTO,
    type PointProgrammeDTO,
} from "../../api/programmeService";
import "./programmesAdmin.css";

interface EtapeAvecFichier extends EtapeProgrammeDTO {
    fichierImage?: File | null;
}

const VIDE: CreerModifierProgrammeDTO = {
    titre: "",
    description: "",
    formateur: "",
    dateDebut: "",
    dateFin: "",
    lien: "",
    constatTitre: "",
    constatTexte: "",
    constatEtapes: [],
    constatPoints: [],
    programmeTitre: "",
    programmeTexte: "",
    programmeEtapes: [],
    programmeApports: [],
};

function EditeurEtapes({
                           etapes,
                           onChange,
                           programmeId,
                           section,
                       }: {
    etapes: EtapeAvecFichier[];
    onChange: (etapes: EtapeAvecFichier[]) => void;
    programmeId?: number;
    section: "constat" | "programme";
}) {
    function ajouter() {
        onChange([...etapes, { titre: "", sousTitre: "", imagePresente: false, fichierImage: null }]);
    }

    function retirer(index: number) {
        onChange(etapes.filter((_, i) => i !== index));
    }

    function modifier(index: number, champ: keyof EtapeAvecFichier, valeur: any) {
        onChange(etapes.map((e, i) => (i === index ? { ...e, [champ]: valeur } : e)));
    }

    return (
        <div className="prog-repetable-liste">
            {etapes.map((etape, index) => (
                <div className="prog-repetable-carte" key={index}>
                    <div className="prog-repetable-carte-head">
                        <span className="prog-etape-badge">Étape {index + 1}</span>
                        <button type="button" className="prog-repetable-retirer" onClick={() => retirer(index)}>
                            ✕
                        </button>
                    </div>

                    <div className="prog-field-grid">
                        <input
                            type="text"
                            placeholder="Titre (ex: ÉCOLE)"
                            value={etape.titre}
                            onChange={(e) => modifier(index, "titre", e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Sous-titre (ex: Identifie les besoins)"
                            value={etape.sousTitre ?? ""}
                            onChange={(e) => modifier(index, "sousTitre", e.target.value)}
                        />
                    </div>

                    <div className="prog-etape-image-box">
                        <label className="prog-field-label">Image de l'étape</label>
                        {programmeId && etape.imagePresente && !etape.fichierImage && (
                            <div className="prog-etape-thumb">
                                <img src={urlImageEtapeAdmin(programmeId, section, index)} alt="" />
                            </div>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => modifier(index, "fichierImage", e.target.files?.[0] ?? null)}
                        />
                    </div>
                </div>
            ))}
            <button type="button" className="prog-repetable-ajouter" onClick={ajouter}>
                + Ajouter une étape
            </button>
        </div>
    );
}

function EditeurPoints({
                           points,
                           onChange,
                           labelAjout,
                       }: {
    points: PointProgrammeDTO[];
    onChange: (points: PointProgrammeDTO[]) => void;
    labelAjout: string;
}) {
    function ajouter() {
        onChange([...points, { titre: "", description: "" }]);
    }
    function retirer(index: number) {
        onChange(points.filter((_, i) => i !== index));
    }
    function modifier(index: number, champ: keyof PointProgrammeDTO, valeur: string) {
        onChange(points.map((p, i) => (i === index ? { ...p, [champ]: valeur } : p)));
    }

    return (
        <div className="prog-repetable-liste">
            {points.map((point, index) => (
                <div className="prog-repetable-carte" key={index}>
                    <div className="prog-repetable-carte-head">
                        <input
                            type="text"
                            placeholder="Titre du point"
                            value={point.titre}
                            onChange={(e) => modifier(index, "titre", e.target.value)}
                        />
                        <button type="button" className="prog-repetable-retirer" onClick={() => retirer(index)}>
                            ✕
                        </button>
                    </div>
                    <textarea
                        placeholder="Description"
                        rows={2}
                        value={point.description ?? ""}
                        onChange={(e) => modifier(index, "description", e.target.value)}
                    />
                </div>
            ))}
            <button type="button" className="prog-repetable-ajouter" onClick={ajouter}>
                + {labelAjout}
            </button>
        </div>
    );
}

export function ProgrammeFormPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const estEdition = Boolean(id);

    const [form, setForm] = useState<CreerModifierProgrammeDTO>(VIDE);
    const [constatEtapes, setConstatEtapes] = useState<EtapeAvecFichier[]>([]);
    const [programmeEtapes, setProgrammeEtapes] = useState<EtapeAvecFichier[]>([]);

    const [imageActuelle, setImageActuelle] = useState<number | null>(null);
    const [fichierImage, setFichierImage] = useState<File | null>(null);
    const [chargement, setChargement] = useState(estEdition);
    const [enregistrement, setEnregistrement] = useState(false);
    const [erreur, setErreur] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        obtenirProgrammeAdmin(Number(id))
            .then((p) => {
                setForm({
                    titre: p.titre,
                    description: p.description ?? "",
                    formateur: p.formateur ?? "",
                    dateDebut: p.dateDebut,
                    dateFin: p.dateFin ?? "",
                    lien: p.lien ?? "",
                    constatTitre: p.constatTitre ?? "",
                    constatTexte: p.constatTexte ?? "",
                    constatEtapes: p.constatEtapes ?? [],
                    constatPoints: p.constatPoints ?? [],
                    programmeTitre: p.programmeTitre ?? "",
                    programmeTexte: p.programmeTexte ?? "",
                    programmeEtapes: p.programmeEtapes ?? [],
                    programmeApports: p.programmeApports ?? [],
                });
                setConstatEtapes((p.constatEtapes ?? []).map((e) => ({ ...e, fichierImage: null })));
                setProgrammeEtapes((p.programmeEtapes ?? []).map((e) => ({ ...e, fichierImage: null })));
                if (p.imagePresente) setImageActuelle(p.id);
            })
            .catch(() => setErreur("Impossible de charger ce programme."))
            .finally(() => setChargement(false));
    }, [id]);

    function handleChange<K extends keyof CreerModifierProgrammeDTO>(champ: K, valeur: CreerModifierProgrammeDTO[K]) {
        setForm((prev) => ({ ...prev, [champ]: valeur }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setEnregistrement(true);
        setErreur(null);
        try {
            const dto: CreerModifierProgrammeDTO = {
                ...form,
                description: form.description || null,
                formateur: form.formateur || null,
                dateFin: form.dateFin || null,
                lien: form.lien || null,
                constatTitre: form.constatTitre || null,
                constatTexte: form.constatTexte || null,
                programmeTitre: form.programmeTitre || null,
                programmeTexte: form.programmeTexte || null,
                constatEtapes: constatEtapes.map(({ titre, sousTitre }) => ({ titre, sousTitre })),
                programmeEtapes: programmeEtapes.map(({ titre, sousTitre }) => ({ titre, sousTitre })),
            };

            const programme = estEdition ? await modifierProgramme(Number(id), dto) : await creerProgramme(dto);

            if (fichierImage) {
                await uploaderImageProgramme(programme.id, fichierImage);
            }

            for (let i = 0; i < constatEtapes.length; i++) {
                if (constatEtapes[i].fichierImage) {
                    await uploaderImageEtape(programme.id, "constat", i, constatEtapes[i].fichierImage!);
                }
            }

            for (let i = 0; i < programmeEtapes.length; i++) {
                if (programmeEtapes[i].fichierImage) {
                    await uploaderImageEtape(programme.id, "programme", i, programmeEtapes[i].fichierImage!);
                }
            }

            navigate("/admin/programmes");
        } catch {
            setErreur("Impossible d'enregistrer ce programme. Vérifie les champs et réessaie.");
        } finally {
            setEnregistrement(false);
        }
    }

    if (chargement) return <div className="prog-empty">Chargement...</div>;

    return (
        <div className="prog-admin-page">
            <h1 className="prog-admin-page__title">{estEdition ? "Modifier le programme" : "Nouveau programme"}</h1>

            {erreur && <div className="prog-modal">{erreur}</div>}

            <form className="prog-admin-row" style={{ flexDirection: "column", alignItems: "stretch" }} onSubmit={handleSubmit}>
                <div className="offre-field">
                    <label className="prog-field-label">Titre</label>
                    <input className="prog-search" value={form.titre} onChange={(e) => handleChange("titre", e.target.value)} required />
                </div>

                <div className="offre-field">
                    <label className="prog-field-label">Description</label>
                    <textarea className="prog-search" rows={3} value={form.description ?? ""} onChange={(e) => handleChange("description", e.target.value)} />
                </div>

                <div className="offre-field">
                    <label className="prog-field-label">Formateur</label>
                    <input className="prog-search" value={form.formateur ?? ""} onChange={(e) => handleChange("formateur", e.target.value)} />
                </div>

                <div className="prog-field-grid">
                    <div>
                        <label className="prog-field-label">Date de début</label>
                        <input
                            type="date"
                            className="prog-search"
                            value={form.dateDebut}
                            onChange={(e) => handleChange("dateDebut", e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="prog-field-label">Date de fin</label>
                        <input type="date" className="prog-search" value={form.dateFin ?? ""} onChange={(e) => handleChange("dateFin", e.target.value)} />
                    </div>
                </div>

                <div>
                    <label className="prog-field-label">Lien de la formation</label>
                    <input className="prog-search" value={form.lien ?? ""} onChange={(e) => handleChange("lien", e.target.value)} placeholder="https://..." />
                </div>

                <div>
                    <label className="prog-field-label">Image de couverture du programme</label>
                    {imageActuelle && !fichierImage && (
                        <div className="prog-admin-row__thumb" style={{ width: 120, height: 80, marginBottom: 8 }}>
                            <img src={urlImageProgrammeAdmin(imageActuelle)} alt="" />
                        </div>
                    )}
                    <input type="file" accept="image/*" onChange={(e) => setFichierImage(e.target.files?.[0] ?? null)} />
                </div>

                <hr style={{ margin: "20px 0", borderColor: "var(--border, #e2e8f0)" }} />
                <h2 className="prog-admin-page__title">LE CONSTAT</h2>

                <div>
                    <label className="prog-field-label">Titre du constat</label>
                    <input className="prog-search" value={form.constatTitre ?? ""} onChange={(e) => handleChange("constatTitre", e.target.value)} />
                </div>
                <div>
                    <label className="prog-field-label">Texte du constat</label>
                    <textarea className="prog-search" rows={3} value={form.constatTexte ?? ""} onChange={(e) => handleChange("constatTexte", e.target.value)} />
                </div>
                <div>
                    <label className="prog-field-label">Étapes du constat</label>
                    <EditeurEtapes
                        etapes={constatEtapes}
                        onChange={setConstatEtapes}
                        programmeId={id ? Number(id) : undefined}
                        section="constat"
                    />
                </div>
                <div>
                    <label className="prog-field-label">Points du constat</label>
                    <EditeurPoints
                        points={form.constatPoints}
                        onChange={(v) => handleChange("constatPoints", v)}
                        labelAjout="Ajouter un point"
                    />
                </div>

                <hr style={{ margin: "20px 0", borderColor: "var(--border, #e2e8f0)" }} />
                <h2 className="prog-admin-page__title">LE PROGRAMME</h2>

                <div>
                    <label className="prog-field-label">Titre du programme</label>
                    <input className="prog-search" value={form.programmeTitre ?? ""} onChange={(e) => handleChange("programmeTitre", e.target.value)} />
                </div>
                <div>
                    <label className="prog-field-label">Texte du programme</label>
                    <textarea className="prog-search" rows={3} value={form.programmeTexte ?? ""} onChange={(e) => handleChange("programmeTexte", e.target.value)} />
                </div>
                <div>
                    <label className="prog-field-label">Étapes du programme</label>
                    <EditeurEtapes
                        etapes={programmeEtapes}
                        onChange={setProgrammeEtapes}
                        programmeId={id ? Number(id) : undefined}
                        section="programme"
                    />
                </div>
                <div>
                    <label className="prog-field-label">Apports du programme</label>
                    <EditeurPoints
                        points={form.programmeApports}
                        onChange={(v) => handleChange("programmeApports", v)}
                        labelAjout="Ajouter un apport"
                    />
                </div>

                <div style={{ marginTop: 20, display: "flex", justifyContent: "flex-end" }}>
                    <button type="submit" className="prog-chip prog-chip--active" disabled={enregistrement}>
                        {enregistrement ? "Enregistrement..." : "Enregistrer le programme"}
                    </button>
                </div>
            </form>
        </div>
    );
}