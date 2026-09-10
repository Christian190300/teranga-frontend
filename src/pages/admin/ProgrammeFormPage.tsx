import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    creerProgramme,
    modifierProgramme,
    obtenirProgrammeAdmin,
    uploaderImageProgramme,
    urlImageProgrammeAdmin,
    type CreerModifierProgrammeDTO,
} from "../../api/programmeService";
import "./programmesAdmin.css";

const VIDE: CreerModifierProgrammeDTO = {
    titre: "",
    description: "",
    formateur: "",
    dateDebut: "",
    dateFin: "",
    lien: "",
};

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
                });
                if (p.imagePresente) setImageActuelle(p.id);
            })
            .catch(() => setErreur("Impossible de charger ce programme."))
            .finally(() => setChargement(false));
    }, [id]);

    function handleChange(champ: keyof CreerModifierProgrammeDTO, valeur: string) {
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

                <div className="offre-form-actions">
                    <button type="submit" className="btn-gold" disabled={enregistrement}>
                        {enregistrement ? "Enregistrement..." : "Enregistrer"}
                    </button>
                </div>
            </form>
        </div>
    );
}