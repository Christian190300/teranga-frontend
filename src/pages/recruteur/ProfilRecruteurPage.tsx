import { useEffect, useRef, useState } from "react";
import {
    getMonProfilRecruteur,
    updateMonProfilRecruteur,
    uploaderLogoRecruteur,
    obtenirLogoRecruteurUrl,
    type ProfilRecruteurDTO,
} from "../../api/profileService";
import { useAuth } from "../../context/AuthContext";
import { useAutoSave } from "../../hooks/useAutoSave";
import { SaveStatusBadge } from "../../components/common/SaveStatusBadge";
import "./profilRecruteurPage.css";

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

const TAILLES_ENTREPRISE = ["1-10", "11-50", "51-200", "201-500", "500+"];

export function ProfilRecruteurPage() {
    const { refreshPhoto } = useAuth();

    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);

    // Entreprise
    const [nomEntreprise, setNomEntreprise] = useState("");
    const [secteurActivite, setSecteurActivite] = useState("");
    const [tailleEntreprise, setTailleEntreprise] = useState("");
    const [description, setDescription] = useState("");
    const [siteWeb, setSiteWeb] = useState("");

    // Contact
    const [nomContact, setNomContact] = useState("");
    const [fonctionContact, setFonctionContact] = useState("");
    const [emailProfessionnel, setEmailProfessionnel] = useState("");
    const [telephoneEntreprise, setTelephoneEntreprise] = useState("");

    // Adresse
    const [pays, setPays] = useState("");
    const [region, setRegion] = useState("");
    const [ville, setVille] = useState("");
    const [adresse, setAdresse] = useState("");

    // Réseaux
    const [linkedin, setLinkedin] = useState("");
    const [facebook, setFacebook] = useState("");
    const [twitter, setTwitter] = useState("");

    // Logo
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
                setTailleEntreprise(data.tailleEntreprise ?? "");
                setDescription(data.description ?? "");
                setSiteWeb(data.siteWeb ?? "");

                setNomContact(data.nomContact ?? "");
                setFonctionContact(data.fonctionContact ?? "");
                setEmailProfessionnel(data.emailProfessionnel ?? "");
                setTelephoneEntreprise(data.telephoneEntreprise ?? "");

                setPays(data.pays ?? "");
                setRegion(data.region ?? "");
                setVille(data.ville ?? "");
                setAdresse(data.adresse ?? "");

                setLinkedin(data.linkedin ?? "");
                setFacebook(data.facebook ?? "");
                setTwitter(data.twitter ?? "");

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

    useEffect(() => {
        return () => {
            if (logoUrl) URL.revokeObjectURL(logoUrl);
        };
    }, [logoUrl]);

    const saveStatus = useAutoSave(
        {
            nomEntreprise,
            secteurActivite,
            tailleEntreprise,
            description,
            siteWeb,
            nomContact,
            fonctionContact,
            emailProfessionnel,
            telephoneEntreprise,
            pays,
            region,
            ville,
            adresse,
            linkedin,
            facebook,
            twitter,
        },
        async (value) => {
            const updated = await updateMonProfilRecruteur(value);
            setDateMaj(updated.dateMaj);
        },
        900,
        !loading
    );

    async function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        setLogoError(null);
        setLogoUploading(true);
        try {
            const updated = await uploaderLogoRecruteur(file);
            setDateMaj(updated.dateMaj);

            if (logoUrl) URL.revokeObjectURL(logoUrl);
            const url = await obtenirLogoRecruteurUrl();
            setLogoUrl(url);

            await refreshPhoto();
        } catch {
            setLogoError("Échec de l'envoi. Format accepté : JPEG, PNG, WebP (2 Mo max).");
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

            {/* Logo + informations générales */}
            <div className="profil-card">
                <p className="profil-card__section-title">Logo & informations générales</p>
                <div className="profil-avatar-row">
                    <div className="profil-avatar-wrap">
                        {logoUrl ? (
                            <img src={logoUrl} alt="Logo de l'entreprise" className="profil-photo-preview" />
                        ) : (
                            <div className="profil-photo-placeholder">?</div>
                        )}
                        <label className={`profil-avatar-edit${logoUploading ? " profil-upload-btn--disabled" : ""}`}>
                            <input
                                ref={logoInputRef}
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={handleLogoChange}
                                disabled={logoUploading}
                                className="profil-file-input-hidden"
                            />
                            <IconCamera />
                        </label>
                    </div>
                    <div className="profil-avatar-info">
                        <p className="profil-avatar-info__title">
                            {logoUploading ? "Envoi en cours..." : "Cliquez sur l'icône pour changer le logo"}
                        </p>
                        <p className="profil-field__hint" style={{ margin: 0 }}>
                            JPEG, PNG ou WebP — 2 Mo maximum.
                        </p>
                        {logoError && <p className="profil-message profil-message--error">{logoError}</p>}
                    </div>
                </div>

                <div className="profil-field" style={{ marginTop: 24 }}>
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
                        <label htmlFor="tailleEntreprise">Taille de l'entreprise</label>
                        <select id="tailleEntreprise" value={tailleEntreprise} onChange={(e) => setTailleEntreprise(e.target.value)}>
                            <option value="">Non précisé</option>
                            {TAILLES_ENTREPRISE.map((t) => (
                                <option key={t} value={t}>
                                    {t} employés
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="profil-field">
                    <label htmlFor="siteWeb">Site web</label>
                    <input id="siteWeb" value={siteWeb} onChange={(e) => setSiteWeb(e.target.value)} placeholder="https://..." />
                </div>

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

            {/* Contact */}
            <div className="profil-card">
                <p className="profil-card__section-title">Contact recruteur</p>
                <div className="profil-field-row">
                    <div className="profil-field">
                        <label htmlFor="nomContact">Nom du recruteur</label>
                        <input id="nomContact" value={nomContact} onChange={(e) => setNomContact(e.target.value)} placeholder="Prénom Nom" />
                    </div>
                    <div className="profil-field">
                        <label htmlFor="fonctionContact">Fonction</label>
                        <input
                            id="fonctionContact"
                            value={fonctionContact}
                            onChange={(e) => setFonctionContact(e.target.value)}
                            placeholder="Responsable RH"
                        />
                    </div>
                </div>
                <div className="profil-field-row">
                    <div className="profil-field">
                        <label htmlFor="emailProfessionnel">Email professionnel</label>
                        <input
                            id="emailProfessionnel"
                            type="email"
                            value={emailProfessionnel}
                            onChange={(e) => setEmailProfessionnel(e.target.value)}
                            placeholder="contact@entreprise.sn"
                        />
                    </div>
                    <div className="profil-field">
                        <label htmlFor="telephoneEntreprise">Téléphone</label>
                        <input
                            id="telephoneEntreprise"
                            value={telephoneEntreprise}
                            onChange={(e) => setTelephoneEntreprise(e.target.value)}
                            placeholder="+221 33 xxx xx xx"
                        />
                    </div>
                </div>
            </div>

            {/* Adresse */}
            <div className="profil-card">
                <p className="profil-card__section-title">Adresse</p>
                <div className="profil-field">
                    <label htmlFor="adresse">Adresse</label>
                    <input id="adresse" value={adresse} onChange={(e) => setAdresse(e.target.value)} placeholder="Rue, quartier..." />
                </div>
                <div className="profil-field-row profil-field-row--3">
                    <div className="profil-field">
                        <label htmlFor="ville">Ville</label>
                        <input id="ville" value={ville} onChange={(e) => setVille(e.target.value)} placeholder="Dakar" />
                    </div>
                    <div className="profil-field">
                        <label htmlFor="region">Région</label>
                        <input id="region" value={region} onChange={(e) => setRegion(e.target.value)} placeholder="Dakar" />
                    </div>
                    <div className="profil-field">
                        <label htmlFor="pays">Pays</label>
                        <input id="pays" value={pays} onChange={(e) => setPays(e.target.value)} placeholder="Sénégal" />
                    </div>
                </div>
            </div>

            {/* Réseaux sociaux */}
            <div className="profil-card">
                <p className="profil-card__section-title">Réseaux sociaux</p>
                <div className="profil-field-row profil-field-row--3">
                    <div className="profil-field">
                        <label htmlFor="linkedin">LinkedIn</label>
                        <input
                            id="linkedin"
                            value={linkedin}
                            onChange={(e) => setLinkedin(e.target.value)}
                            placeholder="https://linkedin.com/company/..."
                        />
                    </div>
                    <div className="profil-field">
                        <label htmlFor="facebook">Facebook</label>
                        <input
                            id="facebook"
                            value={facebook}
                            onChange={(e) => setFacebook(e.target.value)}
                            placeholder="https://facebook.com/..."
                        />
                    </div>
                    <div className="profil-field">
                        <label htmlFor="twitter">X (Twitter)</label>
                        <input id="twitter" value={twitter} onChange={(e) => setTwitter(e.target.value)} placeholder="https://x.com/..." />
                    </div>
                </div>
            </div>

            {/* Meta */}
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