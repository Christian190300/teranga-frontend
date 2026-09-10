import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    creerProgramme,
    modifierProgramme,
    obtenirProgrammeAdmin,
    uploaderImageProgramme,
    urlImageProgrammeAdmin,
    type CreerModifierProgrammeDTO,
    type EtapeProgrammeDTO,
    type PointProgrammeDTO,
} from "../../api/programmeService";
import "./programmesAdmin.css";

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

/** Éditeur répétable pour une liste d'étapes (titre + sous-titre). */
function EditeurEtapes({
                           etapes,
                           onChange,
                       }: {
    etapes: EtapeProgrammeDTO[];
    onChange: (etapes: EtapeProgrammeDTO[]) => void;
}) {
    function ajouter() {
        onChange([...etapes, { titre: "", sousTitre: "" }]);
    }
    function retirer(index: number) {
        onChange(etapes.filter((_, i) => i !== index));
    }
    function modifier(index: number, champ: keyof EtapeProgrammeDTO, valeur: string) {
        onChange(etapes.map((e, i) => (i === index ? { ...e, [champ]: valeur } : e)));
    }

    return (
        <div className="prog-repetable-liste">
            {etapes.map((etape, index) => (
                <div className="prog-repetable-ligne" key={index}>
                    <input
                        type="text"
                        placeholder="Titre (ex: ÉCOLE)"
                        value={etape.titre}
                        onChange={(e) => modifier(index, "titre", e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Sous-titre (ex: Identifie)"
                        value={etape.sousTitre ?? ""}
                        onChange={(e) => modifier(index, "sousTitre", e.target.value)}
                    />
                    <button type="button" className="prog-repetable-retirer" onClick={() => retirer(index)}>
                        ✕
                    </button>
                </div>
            ))}
            <button type="button" className="prog-repetable-ajouter" onClick={ajouter}>
                + Ajouter une étape
            </button>
        </div>
    );
}

/** Éditeur répétable pour une liste de points (titre + description). */
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
            };

            const programme = estEdition ? await modifierProgramme(Number(id), dto) : await creerProgramme(dto);

            if (fichierImage) {
                await uploaderImageProgramme(programme.id, fichierImage);
            }

            navigate("/admin/programmes");
        } catch {
            setErreur("Impossible d'enregistrer ce programme. Vérifie les champs et réessaie.");
        } finally {
            setEnregistrement(false);
        }
    }

    if (chargement) return <div className="mod-state">Chargement...</div>;

    return (
        <div className="prog-admin-page">
            <h1 className="prog-admin-page__title">{estEdition ? "Modifier le programme" : "Nouveau programme"}</h1>

            {erreur && <div className="mod-alert">{erreur}</div>}

            <form className="offre-form-card" onSubmit={handleSubmit}>
                <div className="offre-field">
                    <label>Titre</label>
                    <input value={form.titre} onChange={(e) => handleChange("titre", e.target.value)} required />
                </div>

                <div className="offre-field">
                    <label>Description</label>
                    <textarea value={form.description ?? ""} onChange={(e) => handleChange("description", e.target.value)} />
                </div>

                <div className="offre-field">
                    <label>Formateur</label>
                    <input value={form.formateur ?? ""} onChange={(e) => handleChange("formateur", e.target.value)} />
                </div>

                <div className="offre-field-row">
                    <div className="offre-field">
                        <label>Date de début</label>
                        <input
                            type="date"
                            value={form.dateDebut}
                            onChange={(e) => handleChange("dateDebut", e.target.value)}
                            required
                        />
                    </div>
                    <div className="offre-field">
                        <label>Date de fin</label>
                        <input type="date" value={form.dateFin ?? ""} onChange={(e) => handleChange("dateFin", e.target.value)} />
                    </div>
                </div>

                <div className="offre-field">
                    <label>Lien (candidature / en savoir plus)</label>
                    <input value={form.lien ?? ""} onChange={(e) => handleChange("lien", e.target.value)} placeholder="https://..." />
                </div>

                <div className="offre-field">
                    <label>Image de couverture</label>
                    {imageActuelle && !fichierImage && (
                        <img src={urlImageProgrammeAdmin(imageActuelle)} alt="" className="prog-admin-form__preview" />
                    )}
                    <input type="file" accept="image/*" onChange={(e) => setFichierImage(e.target.files?.[0] ?? null)} />
                </div>

                <hr className="prog-form-separateur" />
                <h2 className="prog-form-section-titre">LE CONSTAT</h2>

                <div className="offre-field">
                    <label>Titre du constat</label>
                    <input value={form.constatTitre ?? ""} onChange={(e) => handleChange("constatTitre", e.target.value)} />
                </div>
                <div className="offre-field">
                    <label>Texte du constat</label>
                    <textarea value={form.constatTexte ?? ""} onChange={(e) => handleChange("constatTexte", e.target.value)} />
                </div>
                <div className="offre-field">
                    <label>Étapes du constat</label>
                    <EditeurEtapes etapes={form.constatEtapes} onChange={(v) => handleChange("constatEtapes", v)} />
                </div>
                <div className="offre-field">
                    <label>Points du constat</label>
                    <EditeurPoints
                        points={form.constatPoints}
                        onChange={(v) => handleChange("constatPoints", v)}
                        labelAjout="Ajouter un point"
                    />
                </div>

                <hr className="prog-form-separateur" />
                <h2 className="prog-form-section-titre">LE PROGRAMME</h2>

                <div className="offre-field">
                    <label>Titre du programme</label>
                    <input value={form.programmeTitre ?? ""} onChange={(e) => handleChange("programmeTitre", e.target.value)} />
                </div>
                <div className="offre-field">
                    <label>Texte du programme</label>
                    <textarea value={form.programmeTexte ?? ""} onChange={(e) => handleChange("programmeTexte", e.target.value)} />
                </div>
                <div className="offre-field">
                    <label>Étapes du programme</label>
                    <EditeurEtapes etapes={form.programmeEtapes} onChange={(v) => handleChange("programmeEtapes", v)} />
                </div>
                <div className="offre-field">
                    <label>Apports du programme</label>
                    <EditeurPoints
                        points={form.programmeApports}
                        onChange={(v) => handleChange("programmeApports", v)}
                        labelAjout="Ajouter un apport"
                    />
                </div>

                <div className="offre-form-actions">
                    <button type="submit" className="btn-gold" disabled={enregistrement}>
                        {enregistrement ? "Enregistrement..." : "Enregistrer"}
                    </button>
                </div>
            </form>
        </div>
    );
}