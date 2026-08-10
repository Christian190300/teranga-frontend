import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    listerOffresPubliques,
    listerSecteursDisponibles,
    obtenirOffre,
    LABELS_TYPE_CONTRAT,
    LABELS_NIVEAU_EXPERIENCE,
    LABELS_NIVEAU_ETUDE,
    type OffreDTO,
} from "../../api/offreService";
import { useAuth } from "../../context/AuthContext";
import { LogoEntreprise } from "../../components/common/LogoEntreprise";
import { CandidatureFormulaire } from "../candidat/CandidatureFormulaire";
import { getCouleurContrat } from "./offreColors";
import "./offres.css";
import { aDejaPostule } from "../../api/candidatureService";

const TAILLE_PAGE = 8;

type EtapeCandidature = "idle" | "formulaire" | "succes";

function formatSalaire(offre: OffreDTO): string | null {
    if (!offre.salaireVisible || (!offre.salaireMin && !offre.salaireMax)) return null;
    const devise = offre.devise ?? "FCFA";
    if (offre.salaireMin && offre.salaireMax) return `${offre.salaireMin.toLocaleString()} - ${offre.salaireMax.toLocaleString()} ${devise}`;
    return `${(offre.salaireMin ?? offre.salaireMax)?.toLocaleString()} ${devise}`;
}

function formatDate(iso: string | null): string {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

export function OffresPubliquesPage() {
    const { currentUser } = useAuth();

    const [offres, setOffres] = useState<OffreDTO[]>([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // --- Filtres ---
    const [rechercheInput, setRechercheInput] = useState("");
    const [rechercheAppliquee, setRechercheAppliquee] = useState("");
    const [secteurs, setSecteurs] = useState<string[]>([]);
    const [secteurSelectionne, setSecteurSelectionne] = useState("");

    const [modalOffreId, setModalOffreId] = useState<number | null>(null);
    const [modalOffre, setModalOffre] = useState<OffreDTO | null>(null);
    const [loadingModal, setLoadingModal] = useState(false);
    const [dejaPostule, setDejaPostule] = useState(false);

    const [etapeCandidature, setEtapeCandidature] = useState<EtapeCandidature>("idle");

    const estCandidat = currentUser?.role === "CANDIDAT";
    const filtresActifs = rechercheAppliquee !== "" || secteurSelectionne !== "";

    useEffect(() => {
        listerSecteursDisponibles()
            .then(setSecteurs)
            .catch(() => setSecteurs([]));
    }, []);

    useEffect(() => {
        async function charger() {
            setLoading(true);
            try {
                const data = await listerOffresPubliques(page, TAILLE_PAGE, {
                    recherche: rechercheAppliquee,
                    secteurActivite: secteurSelectionne,
                });
                setOffres(data.content);
                setTotalPages(data.totalPages);
            } catch {
                setError("Impossible de charger les offres pour le moment.");
            } finally {
                setLoading(false);
            }
        }
        charger();
    }, [page, rechercheAppliquee, secteurSelectionne]);

    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === "Escape") fermerModal();
        }
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    function lancerRecherche(e: React.FormEvent) {
        e.preventDefault();
        setPage(0);
        setRechercheAppliquee(rechercheInput.trim());
    }

    function handleChangerSecteur(e: React.ChangeEvent<HTMLSelectElement>) {
        setSecteurSelectionne(e.target.value);
        setPage(0);
    }

    function reinitialiserFiltres() {
        setRechercheInput("");
        setRechercheAppliquee("");
        setSecteurSelectionne("");
        setPage(0);
    }

    async function ouvrirModal(id: number) {
        setModalOffreId(id);
        setEtapeCandidature("idle");
        setLoadingModal(true);
        try {
            const data = await obtenirOffre(id);
            setModalOffre(data);
            if (estCandidat) {
                const deja = await aDejaPostule(id);
                setDejaPostule(deja);
            }
        } catch {
            setModalOffre(null);
        } finally {
            setLoadingModal(false);
        }
    }

    async function handleClicPostulerDepuisTuile(e: React.MouseEvent, offreId: number) {
        e.stopPropagation();
        await ouvrirModal(offreId);
        setEtapeCandidature("formulaire");
    }

    function ouvrirFormulaire() {
        setEtapeCandidature("formulaire");
    }

    function fermerModal() {
        setModalOffreId(null);
        setModalOffre(null);
        setEtapeCandidature("idle");
    }

    return (
        <div className="offres-page">
            <div className="offres-page__header">
                <div>
                    <h1 className="offres-page__title">Offres d'emploi</h1>
                    <p className="offres-page__subtitle">Découvrez les opportunités disponibles au Sénégal.</p>
                </div>
            </div>

            <form className="offres-filtres" onSubmit={lancerRecherche}>
                <div className="offres-filtres__search">
                    <svg className="offres-filtres__search-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                        <path d="M20 20L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Rechercher un poste, une ville..."
                        value={rechercheInput}
                        onChange={(e) => setRechercheInput(e.target.value)}
                        className="offres-filtres__search-input"
                    />
                </div>

                <div className="offres-filtres__select-wrap">
                    <select
                        value={secteurSelectionne}
                        onChange={handleChangerSecteur}
                        className="offres-filtres__select"
                    >
                        <option value="">Tous les secteurs</option>
                        {secteurs.map((s) => (
                            <option key={s} value={s}>
                                {s}
                            </option>
                        ))}
                    </select>
                    <svg className="offres-filtres__select-arrow" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>

                <div className="offres-filtres__actions">
                    <button type="submit" className="btn-gold">
                        Rechercher
                    </button>
                    {filtresActifs && (
                        <button type="button" className="btn-secondary" onClick={reinitialiserFiltres}>
                            Réinitialiser
                        </button>
                    )}
                </div>
            </form>

            {error && <div className="offre-message--error">{error}</div>}

            {loading ? (
                <div className="offres-skeleton-grid">
                    {Array.from({ length: TAILLE_PAGE }).map((_, i) => (
                        <div key={i} className="offre-skeleton" />
                    ))}
                </div>
            ) : offres.length === 0 ? (
                <div className="offres-page__empty">
                    <div className="offres-page__empty-icon" />
                    <p className="offres-page__empty-title">
                        {filtresActifs ? "Aucune offre ne correspond à votre recherche." : "Aucune offre disponible pour le moment."}
                    </p>
                </div>
            ) : (
                <>
                    <div className="offres-grid">
                        {offres.map((offre) => {
                            const couleur = getCouleurContrat(offre.typeContrat);
                            const lieu = [offre.ville, offre.pays].filter(Boolean).join(", ");
                            const salaire = formatSalaire(offre);
                            return (
                                <div
                                    key={offre.id}
                                    role="button"
                                    tabIndex={0}
                                    className="offre-tile"
                                    style={
                                        {
                                            "--offre-color": couleur.bar,
                                            "--offre-color-soft": couleur.bg,
                                        } as React.CSSProperties
                                    }
                                    onClick={() => ouvrirModal(offre.id)}
                                    onKeyDown={(e) => e.key === "Enter" && ouvrirModal(offre.id)}
                                >
                                    <div className="offre-tile__top">
                                        <LogoEntreprise
                                            recruteurId={offre.recruteurId}
                                            logoPresent={offre.logoPresent}
                                            nomEntreprise={offre.nomEntreprise}
                                            className="offre-tile__logo"
                                        />
                                        <div className="offre-tile__entreprise">
                                            <p className="offre-tile__nom-entreprise">{offre.nomEntreprise ?? "Entreprise inconnue"}</p>
                                        </div>
                                    </div>

                                    <p className="offre-tile__titre">{offre.titre}</p>
                                    <p className="offre-tile__lieu">{lieu || "Lieu non précisé"}</p>

                                    <div className="offre-tile__tags">
                                        <span className="offre-tile__tag">{LABELS_TYPE_CONTRAT[offre.typeContrat]}</span>
                                        {offre.teletravail && <span className="offre-tile__tag offre-tile__tag--gold">Télétravail</span>}
                                        {offre.hybride && <span className="offre-tile__tag offre-tile__tag--gold">Hybride</span>}
                                    </div>

                                    <div className="offre-tile__footer">
                                        {salaire ? (
                                            <span className="offre-tile__salaire">{salaire}</span>
                                        ) : (
                                            <span className="offre-tile__salaire-vide">Salaire non communiqué</span>
                                        )}
                                    </div>

                                    <div className="offre-tile__actions">
                                        <button
                                            className="btn-secondary offre-tile__voir-detail"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                ouvrirModal(offre.id);
                                            }}
                                        >
                                            Voir détail
                                        </button>
                                        {estCandidat && offre.statut === "PUBLIEE" && (
                                            <button className="btn-gold offre-tile__postuler" onClick={(e) => handleClicPostulerDepuisTuile(e, offre.id)}>
                                                Postuler
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {totalPages > 1 && (
                        <div className="offres-pagination">
                            <button className="btn-secondary" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
                                Précédent
                            </button>
                            <span className="offres-pagination__info">
                                Page {page + 1} / {totalPages}
                            </span>
                            <button className="btn-secondary" disabled={page + 1 >= totalPages} onClick={() => setPage((p) => p + 1)}>
                                Suivant
                            </button>
                        </div>
                    )}
                </>
            )}

            {modalOffreId && (
                <div className="offre-modal-overlay" onClick={fermerModal}>
                    <div className="offre-modal" onClick={(e) => e.stopPropagation()}>
                        {loadingModal ? (
                            <div className="offre-modal__loading">Chargement de l'offre...</div>
                        ) : !modalOffre ? (
                            <div className="offre-modal__empty">
                                <p>Cette offre est introuvable ou n'est plus disponible.</p>
                                <button className="btn-secondary" onClick={fermerModal} style={{ marginTop: 16 }}>
                                    Fermer
                                </button>
                            </div>
                        ) : (
                            <>
                                <div
                                    className="offre-modal__header"
                                    style={
                                        {
                                            "--contrat-color": getCouleurContrat(modalOffre.typeContrat).bar,
                                            "--contrat-color-soft": getCouleurContrat(modalOffre.typeContrat).bg,
                                        } as React.CSSProperties
                                    }
                                >
                                    <button className="offre-modal__close" onClick={fermerModal} aria-label="Fermer">
                                        ✕
                                    </button>
                                    <LogoEntreprise
                                        recruteurId={modalOffre.recruteurId}
                                        logoPresent={modalOffre.logoPresent}
                                        nomEntreprise={modalOffre.nomEntreprise}
                                        className="offre-detail__logo"
                                    />
                                    <p className="offre-detail__entreprise">{modalOffre.nomEntreprise ?? "Entreprise inconnue"}</p>
                                    <h1 className="offre-detail__titre">{modalOffre.titre}</h1>
                                    <p className="offre-detail__lieu">
                                        {[modalOffre.ville, modalOffre.region, modalOffre.pays].filter(Boolean).join(", ") || "Lieu non précisé"}
                                    </p>
                                    <div className="offre-detail__tags">
                                        <span
                                            className="offre-detail__tag"
                                            style={{ background: getCouleurContrat(modalOffre.typeContrat).bar, color: "white" }}
                                        >
                                            {LABELS_TYPE_CONTRAT[modalOffre.typeContrat]}
                                        </span>
                                        {modalOffre.teletravail && <span className="offre-detail__tag">Télétravail</span>}
                                        {modalOffre.hybride && <span className="offre-detail__tag">Hybride</span>}
                                        {modalOffre.niveauExperience && (
                                            <span className="offre-detail__tag">{LABELS_NIVEAU_EXPERIENCE[modalOffre.niveauExperience]}</span>
                                        )}
                                    </div>
                                </div>

                                <div className="offre-modal__body">
                                    {estCandidat && etapeCandidature !== "idle" && (
                                        <div className="offre-detail__section">
                                            {etapeCandidature === "formulaire" && (
                                                <>
                                                    <p className="offre-detail__section-title">Votre candidature</p>
                                                    <CandidatureFormulaire
                                                        offreId={modalOffre.id}
                                                        onAnnuler={() => setEtapeCandidature("idle")}
                                                        onSucces={() => {
                                                            setEtapeCandidature("succes");
                                                            setDejaPostule(true);
                                                        }}
                                                    />
                                                </>
                                            )}

                                            {etapeCandidature === "succes" && (
                                                <div className="candidature-form__success">
                                                    ✓ Votre candidature a bien été envoyée. Vous pouvez suivre son statut dans « Mes candidatures ».
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {modalOffre.description && (
                                        <div className="offre-detail__section">
                                            <p className="offre-detail__section-title">Description du poste</p>
                                            <p className="offre-detail__text">{modalOffre.description}</p>
                                        </div>
                                    )}

                                    {modalOffre.missions && modalOffre.missions.length > 0 && (
                                        <div className="offre-detail__section">
                                            <p className="offre-detail__section-title">Missions</p>
                                            <ul className="offre-detail__list">
                                                {modalOffre.missions.map((m) => (
                                                    <li key={m}>{m}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {(modalOffre.profilRecherche || modalOffre.niveauEtude || modalOffre.experienceMinimum) && (
                                        <div className="offre-detail__section">
                                            <p className="offre-detail__section-title">Profil recherché</p>
                                            {modalOffre.profilRecherche && (
                                                <p className="offre-detail__text" style={{ marginBottom: 16 }}>
                                                    {modalOffre.profilRecherche}
                                                </p>
                                            )}
                                            <div className="offre-detail__facts">
                                                {modalOffre.niveauEtude && (
                                                    <div>
                                                        <div className="offre-detail__fact-label">Niveau d'étude</div>
                                                        <div className="offre-detail__fact-value">{LABELS_NIVEAU_ETUDE[modalOffre.niveauEtude]}</div>
                                                    </div>
                                                )}
                                                {modalOffre.experienceMinimum !== null && modalOffre.experienceMinimum !== undefined && (
                                                    <div>
                                                        <div className="offre-detail__fact-label">Expérience minimum</div>
                                                        <div className="offre-detail__fact-value">{modalOffre.experienceMinimum} an(s)</div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {((modalOffre.competences && modalOffre.competences.length > 0) ||
                                        (modalOffre.langues && modalOffre.langues.length > 0)) && (
                                        <div className="offre-detail__section">
                                            <p className="offre-detail__section-title">Compétences & langues</p>
                                            <div className="offre-detail__chips" style={{ marginBottom: 12 }}>
                                                {modalOffre.competences?.map((c) => (
                                                    <span className="offre-detail__chip" key={c}>
                                                        {c}
                                                    </span>
                                                ))}
                                            </div>
                                            <div className="offre-detail__chips">
                                                {modalOffre.langues?.map((l) => (
                                                    <span className="offre-detail__chip" key={l}>
                                                        {l}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {modalOffre.avantages && modalOffre.avantages.length > 0 && (
                                        <div className="offre-detail__section">
                                            <p className="offre-detail__section-title">Avantages</p>
                                            <div className="offre-detail__chips">
                                                {modalOffre.avantages.map((a) => (
                                                    <span className="offre-detail__chip" key={a}>
                                                        {a}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="offre-detail__section">
                                        <p className="offre-detail__section-title">Informations complémentaires</p>
                                        <div className="offre-detail__facts">
                                            <div>
                                                <div className="offre-detail__fact-label">Nombre de postes</div>
                                                <div className="offre-detail__fact-value">{modalOffre.nombrePostes ?? 1}</div>
                                            </div>
                                            <div>
                                                <div className="offre-detail__fact-label">Publiée le</div>
                                                <div className="offre-detail__fact-value">{formatDate(modalOffre.datePublication)}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <Link
                                        to={`/offres/${modalOffre.id}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="offre-detail__cta-info"
                                        style={{ display: "inline-block", marginTop: 16 }}
                                    >
                                        Ouvrir dans un nouvel onglet ↗
                                    </Link>
                                </div>

                                <div className="offre-modal__footer">
                                    <span className="offre-detail__fact-value">{formatSalaire(modalOffre) ?? "Salaire non communiqué"}</span>
                                    {estCandidat && modalOffre.statut === "PUBLIEE" && etapeCandidature === "idle" && (
                                        <button className="btn-gold" onClick={ouvrirFormulaire} disabled={dejaPostule}>
                                            {dejaPostule ? "Candidature envoyée" : "Postuler"}
                                        </button>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}