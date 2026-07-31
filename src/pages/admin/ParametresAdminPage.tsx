import { useCallback, useEffect, useState } from "react";
import {
    creerSecteur,
    definirActivationSecteur,
    listerSecteursAdmin,
    modifierSecteur,
    supprimerSecteur,
    type SecteurActiviteDTO,
} from "../../api/secteurActiviteService";
import {
    mettreAJourParametres,
    obtenirParametresAdmin,
    type ParametrePlateformeDTO,
} from "../../api/parametrePlateformeService";
import "./UserAdminPage.css";
import "./ParametresAdminPage.css";

export function ParametresAdminPage() {
    return (
        <div className="admin-page">
            <div className="admin-page__container">
                <div className="admin-page__head">
                    <div>
                        <h1 className="admin-page__title">Paramètres</h1>
                        <p className="admin-page__subtitle">Configuration générale de la plateforme.</p>
                    </div>
                </div>

                <SectionInfosGenerales />
                <SectionSecteursActivite />
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Section : Infos générales + Mode maintenance
// ---------------------------------------------------------------------------

function SectionInfosGenerales() {
    const [parametres, setParametres] = useState<ParametrePlateformeDTO | null>(null);
    const [chargement, setChargement] = useState(true);
    const [enregistrement, setEnregistrement] = useState(false);
    const [erreur, setErreur] = useState<string | null>(null);
    const [succes, setSucces] = useState(false);

    const [nomSite, setNomSite] = useState("");
    const [emailContact, setEmailContact] = useState("");
    const [description, setDescription] = useState("");
    const [modeMaintenance, setModeMaintenance] = useState(false);

    const charger = useCallback(async () => {
        setChargement(true);
        setErreur(null);
        try {
            const data = await obtenirParametresAdmin();
            setParametres(data);
            setNomSite(data.nomSite ?? "");
            setEmailContact(data.emailContact ?? "");
            setDescription(data.description ?? "");
            setModeMaintenance(data.modeMaintenance);
        } catch {
            setErreur("Impossible de charger les paramètres.");
        } finally {
            setChargement(false);
        }
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch au montage, pattern standard
        charger();
    }, [charger]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setEnregistrement(true);
        setErreur(null);
        setSucces(false);
        try {
            const maj = await mettreAJourParametres({ nomSite, emailContact, description, modeMaintenance });
            setParametres(maj);
            setSucces(true);
            setTimeout(() => setSucces(false), 3000);
        } catch {
            setErreur("L'enregistrement a échoué. Vérifie les champs et réessaie.");
        } finally {
            setEnregistrement(false);
        }
    }

    if (chargement) {
        return (
            <div className="params-section">
                <p className="params-section__loading">Chargement…</p>
            </div>
        );
    }

    return (
        <div className="params-section">
            <div className="params-section__head">
                <h2 className="params-section__title">Informations générales</h2>
                <p className="params-section__subtitle">Nom, contact et description publique de la plateforme.</p>
            </div>

            {erreur && <div className="admin-alert">{erreur}</div>}
            {succes && <div className="params-success">Paramètres enregistrés avec succès.</div>}

            <form className="params-form" onSubmit={handleSubmit}>
                <div className="params-form__row">
                    <label className="params-form__field">
                        <span>Nom du site</span>
                        <input value={nomSite} onChange={(e) => setNomSite(e.target.value)} maxLength={150} placeholder="Talent Sénégal" />
                    </label>
                    <label className="params-form__field">
                        <span>Email de contact</span>
                        <input
                            type="email"
                            value={emailContact}
                            onChange={(e) => setEmailContact(e.target.value)}
                            maxLength={254}
                            placeholder="contact@talentsenegal.sn"
                        />
                    </label>
                </div>

                <label className="params-form__field">
                    <span>Description</span>
                    <textarea
                        rows={3}
                        maxLength={1000}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Présentation courte de la plateforme..."
                    />
                </label>

                <div className={`params-maintenance${modeMaintenance ? " params-maintenance--active" : ""}`}>
                    <div>
                        <p className="params-maintenance__title">Mode maintenance</p>
                        <p className="params-maintenance__desc">
                            Bloque l'accès à la plateforme pour tous les utilisateurs sauf les administrateurs.
                        </p>
                    </div>
                    <button
                        type="button"
                        className={`params-toggle${modeMaintenance ? " params-toggle--on" : ""}`}
                        onClick={() => setModeMaintenance((v) => !v)}
                        role="switch"
                        aria-checked={modeMaintenance}
                    >
                        <span className="params-toggle__thumb" />
                    </button>
                </div>

                {parametres?.dateMaj && (
                    <p className="params-form__hint">
                        Dernière mise à jour : {new Date(parametres.dateMaj).toLocaleString("fr-FR")}
                    </p>
                )}

                <div className="params-form__actions">
                    <button type="submit" className="admin-btn admin-btn--primary" disabled={enregistrement}>
                        {enregistrement ? "Enregistrement…" : "Enregistrer"}
                    </button>
                </div>
            </form>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Section : Secteurs d'activité
// ---------------------------------------------------------------------------

function SectionSecteursActivite() {
    const [secteurs, setSecteurs] = useState<SecteurActiviteDTO[]>([]);
    const [chargement, setChargement] = useState(true);
    const [erreur, setErreur] = useState<string | null>(null);
    const [nouveauNom, setNouveauNom] = useState("");
    const [ajoutEnCours, setAjoutEnCours] = useState(false);
    const [editionId, setEditionId] = useState<number | null>(null);
    const [editionNom, setEditionNom] = useState("");

    const charger = useCallback(async () => {
        setChargement(true);
        setErreur(null);
        try {
            const data = await listerSecteursAdmin();
            setSecteurs(data);
        } catch {
            setErreur("Impossible de charger les secteurs d'activité.");
        } finally {
            setChargement(false);
        }
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch au montage, pattern standard
        charger();
    }, [charger]);

    async function handleAjouter(e: React.FormEvent) {
        e.preventDefault();
        const nom = nouveauNom.trim();
        if (!nom) return;

        setAjoutEnCours(true);
        setErreur(null);
        try {
            const cree = await creerSecteur({ nom, position: secteurs.length + 1 });
            setSecteurs((prev) => [...prev, cree]);
            setNouveauNom("");
        } catch {
            setErreur("Impossible d'ajouter ce secteur (peut-être déjà existant).");
        } finally {
            setAjoutEnCours(false);
        }
    }

    async function handleToggleActivation(secteur: SecteurActiviteDTO) {
        const nouveauStatut = !secteur.actif;
        setSecteurs((prev) => prev.map((s) => (s.id === secteur.id ? { ...s, actif: nouveauStatut } : s)));
        try {
            await definirActivationSecteur(secteur.id, nouveauStatut);
        } catch {
            setSecteurs((prev) => prev.map((s) => (s.id === secteur.id ? { ...s, actif: !nouveauStatut } : s)));
            setErreur("Le changement de statut a échoué.");
        }
    }

    function commencerEdition(secteur: SecteurActiviteDTO) {
        setEditionId(secteur.id);
        setEditionNom(secteur.nom);
    }

    async function handleEnregistrerEdition(id: number) {
        const nom = editionNom.trim();
        if (!nom) return;

        try {
            const maj = await modifierSecteur(id, { nom });
            setSecteurs((prev) => prev.map((s) => (s.id === id ? maj : s)));
            setEditionId(null);
        } catch {
            setErreur("La modification a échoué.");
        }
    }

    async function handleSupprimer(secteur: SecteurActiviteDTO) {
        if (!window.confirm(`Supprimer le secteur "${secteur.nom}" ? Cette action est irréversible.`)) return;

        try {
            await supprimerSecteur(secteur.id);
            setSecteurs((prev) => prev.filter((s) => s.id !== secteur.id));
        } catch {
            setErreur("La suppression a échoué (le secteur est peut-être déjà utilisé).");
        }
    }

    return (
        <div className="params-section">
            <div className="params-section__head">
                <h2 className="params-section__title">Secteurs d'activité</h2>
                <p className="params-section__subtitle">
                    Liste utilisée dans le formulaire d'inscription recruteur et la création d'offres.
                </p>
            </div>

            {erreur && <div className="admin-alert">{erreur}</div>}

            <form className="params-add-row" onSubmit={handleAjouter}>
                <input
                    value={nouveauNom}
                    onChange={(e) => setNouveauNom(e.target.value)}
                    placeholder="Nouveau secteur (ex : Aquaculture)"
                    maxLength={150}
                />
                <button type="submit" className="admin-btn admin-btn--primary" disabled={ajoutEnCours || !nouveauNom.trim()}>
                    {ajoutEnCours ? "Ajout…" : "+ Ajouter"}
                </button>
            </form>

            {chargement ? (
                <p className="params-section__loading">Chargement…</p>
            ) : secteurs.length === 0 ? (
                <p className="params-section__loading">Aucun secteur enregistré.</p>
            ) : (
                <div className="params-secteur-list">
                    {secteurs.map((secteur) => (
                        <div key={secteur.id} className={`params-secteur-row${secteur.actif ? "" : " params-secteur-row--inactif"}`}>
                            {editionId === secteur.id ? (
                                <input
                                    className="params-secteur-row__input"
                                    value={editionNom}
                                    onChange={(e) => setEditionNom(e.target.value)}
                                    maxLength={150}
                                    autoFocus
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") handleEnregistrerEdition(secteur.id);
                                        if (e.key === "Escape") setEditionId(null);
                                    }}
                                />
                            ) : (
                                <span className="params-secteur-row__nom">{secteur.nom}</span>
                            )}

                            <div className="params-secteur-row__actions">
                                {editionId === secteur.id ? (
                                    <>
                                        <button className="admin-btn admin-btn--ghost" onClick={() => handleEnregistrerEdition(secteur.id)}>
                                            Enregistrer
                                        </button>
                                        <button className="admin-btn admin-btn--ghost" onClick={() => setEditionId(null)}>
                                            Annuler
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            className={`admin-status ${secteur.actif ? "is-active" : "is-inactive"}`}
                                            onClick={() => handleToggleActivation(secteur)}
                                        >
                                            <span className="admin-status__dot" />
                                            {secteur.actif ? "Actif" : "Masqué"}
                                        </button>
                                        <button className="admin-btn admin-btn--ghost" onClick={() => commencerEdition(secteur)}>
                                            Modifier
                                        </button>
                                        <button className="admin-btn admin-btn--ghost params-btn-danger" onClick={() => handleSupprimer(secteur)}>
                                            Supprimer
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}