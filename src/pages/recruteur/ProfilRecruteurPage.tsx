import { useEffect, useRef, useState } from "react";
import {
    getMonProfilRecruteur,
    updateMonProfilRecruteur,
    uploaderLogoRecruteur,
    obtenirLogoRecruteurUrl,
    type ProfilRecruteurDTO,
} from "../../api/profileService";
import { useAutoSave } from "../../hooks/useAutoSave";
import { SaveStatusBadge } from "../../components/common/SaveStatusBadge";
import "./profilRecruteurPage.css";

function formatDate(iso: string | null): string {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

export function ProfilRecruteurPage() {
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);

    const [nomEntreprise, setNomEntreprise] = useState("");
    const [secteurActivite, setSecteurActivite] = useState("");
    const [description, setDescription] = useState("");
    const [telephoneEntreprise, setTelephoneEntreprise] = useState("");

    const [logoPresent, setLogoPresent] = useState(false);
    const [logoUrl, setLogoUrl] = useState<string | null>(null);
    const [logoUploading, setLogoUploading] = useState(false);
    const [logoError, setLogoError] = useState<string | null>(null);

    const [dateCreation, setDateCreation] = useState<string | null>(null);
    const [dateMaj, setDateMaj] = useState<string | null>(null);

    const logoInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        async function charger() {
            try {
                const data: ProfilRecruteurDTO = await getMonProfilRecruteur();
                setNomEntreprise(data.nomEntreprise ?? "");
                setSecteurActivite(data.secteurActivite ?? "");
                setDescription(data.description ?? "");
                setTelephoneEntreprise(data.telephoneEntreprise ?? "");
                setLogoPresent(data.logoPresent);
                setDateCreation(data.dateCreation);
                setDateMaj(data.dateMaj);

                if (data.logoPresent) {
                    const url = await obtenirLogoRecruteurUrl();
                    setLogoUrl(url);
                }
            } catch {
                setLoadError("Impossible de charger le profil de votre entreprise pour le moment.");
            } finally {
                setLoading(false);
            }
        }
        charger();
    }, []);

    // Libère l'URL blob du logo quand il change ou que le composant se démonte.
    useEffect(() => {
        return () => {
            if (logoUrl) {
                URL.revokeObjectURL(logoUrl);
            }
        };
    }, [logoUrl]);

    const saveStatus = useAutoSave(
        { nomEntreprise, secteurActivite, description, telephoneEntreprise },
        async (value) => {
            const updated = await updateMonProfilRecruteur(value);
            setDateMaj(updated.dateMaj);
        }
    );

    async function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        setLogoError(null);
        setLogoUploading(true);
        try {
            const updated = await uploaderLogoRecruteur(file);
            setLogoPresent(updated.logoPresent);
            setDateMaj(updated.dateMaj);

            if (logoUrl) {
                URL.revokeObjectURL(logoUrl);
            }
            const url = await obtenirLogoRecruteurUrl();
            setLogoUrl(url);
        } catch {
            setLogoError("Échec de l'envoi du logo. Vérifiez le format (JPEG, PNG, WebP) et la taille (2 Mo max).");
        } finally {
            setLogoUploading(false);
            if (logoInputRef.current) logoInputRef.current.value = "";
        }
    }

    if (loading) {
        return <div className="profil-page__loading">Chargement du profil de votre entreprise...</div>;
    }

    return (
        <div className="profil-page">
            <div className="profil-page__header">
                <div>
                    <h1 className="profil-page__title">Mon entreprise</h1>
                    <p className="profil-page__subtitle">Vos modifications sont enregistrées automatiquement.</p>
                </div>
                <SaveStatusBadge status={saveStatus} />
            </div>

            {loadError && <div className="profil-message profil-message--error">{loadError}</div>}

            <div className="profil-card">
                <p className="profil-card__section-title">Logo</p>
                <div className="profil-photo-row">
                    {logoUrl ? (
                        <img src={logoUrl} alt="Logo de l'entreprise" className="profil-photo-preview" />
                    ) : (
                        <div className="profil-photo-placeholder">?</div>
                    )}
                    <div className="profil-photo-field">
                        <input
                            ref={logoInputRef}
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={handleLogoChange}
                            disabled={logoUploading}
                        />
                        <p className="profil-field__hint">
                            {logoUploading
                                ? "Envoi en cours..."
                                : logoPresent
                                    ? "Sélectionnez un fichier pour remplacer le logo (JPEG, PNG, WebP, 2 Mo max)."
                                    : "Sélectionnez le logo de votre entreprise (JPEG, PNG, WebP, 2 Mo max)."}
                        </p>
                        {logoError && <p className="profil-message profil-message--error">{logoError}</p>}
                    </div>
                </div>

                <p className="profil-card__section-title">Informations générales</p>
                <div className="profil-field">
                    <label htmlFor="nomEntreprise">Nom de l'entreprise</label>
                    <input id="nomEntreprise" value={nomEntreprise} onChange={(e) => setNomEntreprise(e.target.value)} />
                </div>

                <div className="profil-field-row">
                    <div className="profil-field">
                        <label htmlFor="secteurActivite">Secteur d'activité</label>
                        <input
                            id="secteurActivite"
                            value={secteurActivite}
                            onChange={(e) => setSecteurActivite(e.target.value)}
                            placeholder="Télécommunications, BTP, Finance..."
                        />
                    </div>
                    <div className="profil-field">
                        <label htmlFor="telephoneEntreprise">Téléphone de l'entreprise</label>
                        <input
                            id="telephoneEntreprise"
                            value={telephoneEntreprise}
                            onChange={(e) => setTelephoneEntreprise(e.target.value)}
                            placeholder="+221 33 xxx xx xx"
                        />
                    </div>
                </div>

                <p className="profil-card__section-title">Présentation</p>
                <div className="profil-field">
                    <label htmlFor="description">Description de l'entreprise</label>
                    <textarea
                        id="description"
                        rows={5}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Présentez votre entreprise en quelques lignes..."
                    />
                </div>
            </div>

            <div className="profil-card">
                <p className="profil-card__section-title">Informations</p>
                <div className="profil-meta">
                    <div className="profil-meta__item">
                        <div className="profil-meta__label">Compte créé le</div>
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