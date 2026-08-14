import { Link } from "react-router-dom";
import "./EspaceCandidatPage.css";

// Ajuster le chemin relatif ci-dessous selon l'emplacement réel de ce fichier
// par rapport à src/main/webapp/app/assets/hero/
import heroCandidats from "../../assets/candidats.jpg";
import heroCandidature from "../../assets/candidature.jpg";
import heroFormation from "../../assets/formation-hero.jpg";
import heroPhotoPro from "../../assets/photoPro.jpeg";
import heroSendCv from "../../assets/sendCv.jpg";
import heroTalent1 from "../../assets/talent-1.jpg";
import heroTalent2 from "../../assets/talent-2.jpg";
import heroTalent3 from "../../assets/talent-3.jpg";

/**
 * À coller dans Navbar.tsx, dans la liste de liens affichés aux visiteurs
 * non connectés (candidats potentiels) :
 *
 * const visiteurCandidatLinks: NavLinkItem[] = [
 *     { to: "/espace-candidat", label: "Je suis candidat" },
 *     { to: "/offres", label: "Offres d'emploi" },
 *     { to: "/formations", label: "Formations" },
 *     { to: "/inscription?role=candidat", label: "Créer un compte candidat" },
 * ];
 */

function IconTarget() {
    return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.6" />
            <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.6" />
            <circle cx="12" cy="12" r="1.2" fill="currentColor" />
        </svg>
    );
}

function IconEye() {
    return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path
                d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
            />
            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
        </svg>
    );
}

function IconSearch() {
    return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" strokeWidth="1.6" />
            <path d="M19.5 19.5 15 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
    );
}

function IconStar() {
    return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path
                d="M12 3.5l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17.3l-5.4 3.1 1-6.1-4.4-4.3 6.1-.9L12 3.5Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function IconDocument() {
    return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path
                d="M7 3.5h7l4 4v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-15a1 1 0 0 1 1-1Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
            />
            <path d="M14 3.5v4h4" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
    );
}

function IconBadge() {
    return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <circle cx="12" cy="9.5" r="5" stroke="currentColor" strokeWidth="1.6" />
            <path d="M8.5 13.8 7 20.5l5-2.5 5 2.5-1.5-6.7" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
    );
}

function IconGraduation() {
    return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M12 4 2 8.5 12 13l10-4.5L12 4Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
            <path d="M6 10.5v5c0 1.4 2.7 3 6 3s6-1.6 6-3v-5" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
            <path d="M20.5 9v6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
    );
}

const AVANTAGES = [
    {
        icon: <IconTarget />,
        titre: "Un profil, une vraie identité de carrière",
        texte:
            "Au-delà du CV classique, Talent Sénégal construit votre profil autour de vos compétences, vos ambitions et vos preuves concrètes de travail.",
    },
    {
        icon: <IconEye />,
        titre: "Visible par les bons recruteurs",
        texte:
            "Les recruteurs sénégalais qui cherchent votre profil vous trouvent directement, sans que vous ayez à postuler à l'aveugle partout.",
    },
    {
        icon: <IconSearch />,
        titre: "Des offres qui vous correspondent",
        texte:
            "Filtrez par secteur, ville et niveau d'expérience pour ne voir que les offres pertinentes pour vous, partout au Sénégal.",
    },
    {
        icon: <IconGraduation />,
        titre: "Des formations pour progresser",
        texte:
            "Complétez votre profil avec des formations recommandées pour combler l'écart entre votre niveau actuel et le poste visé.",
    },
];

const ETAPES_OPTIMISATION = [
    {
        n: "Coordonnées et infos pro",
        texte: "Téléphone, ville, titre professionnel : les recruteurs filtrent d'abord sur ces critères.",
    },
    {
        n: "Parcours et compétences",
        texte: "Ajoutez formations, certifications et compétences avec des exemples concrets, pas seulement des mots-clés.",
    },
    {
        n: "CV et lettre de motivation",
        texte: "Un CV à jour au format PDF augmente fortement vos chances d'être contacté pour un entretien.",
    },
    {
        n: "Vidéo de présentation",
        texte: "30 à 60 secondes pour vous présenter donnent aux recruteurs un aperçu humain avant même l'entretien.",
    },
];

const CONSEILS_VISIBILITE = [
    "Un profil complété à 100 % apparaît en priorité dans les recherches des recruteurs.",
    "Une photo professionnelle claire inspire davantage confiance qu'un profil sans photo.",
    "Mettre à jour régulièrement votre profil signale que vous êtes activement en recherche.",
    "Renseigner votre disponibilité évite aux recruteurs de vous contacter au mauvais moment.",
];

const CONSEILS_RECHERCHE = [
    "Utilisez les filtres secteur, ville et niveau d'expérience pour cibler les offres pertinentes.",
    "Activez la mobilité géographique si vous êtes ouvert à travailler dans une autre région du Sénégal.",
    "Consultez régulièrement les nouvelles offres : les postes les plus demandés se pourvoient vite.",
    "Personnalisez votre lettre de motivation selon l'entreprise et le poste visé.",
];

const COMPETENCES_EXEMPLES = [
    "Gestion de projet", "Excel avancé", "Communication", "Comptabilité", "React",
    "Vente B2B", "Français", "Anglais professionnel", "Leadership", "Analyse de données",
];

export function EspaceCandidatPage() {
    return (
        <div className="ecp">
            {/* HERO */}
            <section className="ecp-hero">
                <div className="ecp-hero__text">
                    <p className="ecp-eyebrow">Espace candidat</p>
                    <h1 className="ecp-hero__title">
                        Votre carrière mérite mieux qu'un CV qui dort dans un dossier.
                    </h1>
                    <p className="ecp-hero__subtitle">
                        Talent Sénégal vous aide à construire un profil complet, visible et crédible
                        auprès des recruteurs qui recrutent vraiment, partout au Sénégal.
                    </p>
                    <div className="ecp-hero__actions">
                        <Link to="/inscription?role=candidat" className="ecp-btn ecp-btn--primary">
                            Créer mon compte candidat
                        </Link>
                        <Link to="/offres" className="ecp-btn ecp-btn--ghost">
                            Voir les offres d'emploi
                        </Link>
                    </div>
                </div>
                <div className="ecp-hero__media">
                    <img src={heroCandidats} alt="Candidat prêt à démarrer sa recherche d'emploi" className="ecp-hero__img" />
                </div>
            </section>

            {/* FRISE — élément signature : le parcours candidat */}
            <section className="ecp-parcours">
                <p className="ecp-section-eyebrow ecp-section-eyebrow--light">Votre parcours sur Talent Sénégal</p>
                <h2 className="ecp-parcours__title">De la création de profil à l'opportunité</h2>
                <div className="ecp-parcours__track">
                    <div className="ecp-parcours__line" />
                    {["Profil complété", "Visibilité accrue", "Recherche ciblée", "Entretien décroché"].map((etape, i) => (
                        <div className="ecp-parcours__step" key={etape}>
                            <span className="ecp-parcours__dot">{i + 1}</span>
                            <span className="ecp-parcours__label">{etape}</span>
                        </div>
                    ))}
                </div>
                <p className="ecp-parcours__hint">
                    Ce même principe pilote la barre de progression de votre profil : plus il est
                    complet, plus vous avancez sur cette ligne.
                </p>
            </section>

            {/* AVANTAGES */}
            <section className="ecp-section" id="avantages">
                <p className="ecp-section-eyebrow">Pourquoi Talent Sénégal</p>
                <h2 className="ecp-section-title">Ce que la plateforme change pour vous</h2>
                <div className="ecp-avantages-grid">
                    {AVANTAGES.map((a) => (
                        <div className="ecp-avantage-card" key={a.titre}>
                            <div className="ecp-avantage-card__icon">{a.icon}</div>
                            <h3 className="ecp-avantage-card__titre">{a.titre}</h3>
                            <p className="ecp-avantage-card__texte">{a.texte}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* OPTIMISER SON PROFIL */}
            <section className="ecp-section ecp-section--tint" id="optimiser-profil">
                <p className="ecp-section-eyebrow">Passer à l'action</p>
                <h2 className="ecp-section-title">Comment optimiser votre profil</h2>
                <p className="ecp-section-lead">
                    Un profil optimisé se construit dans cet ordre — chaque étape débloque la suivante.
                </p>
                <div className="ecp-etapes">
                    {ETAPES_OPTIMISATION.map((e, i) => (
                        <div className="ecp-etape" key={e.n}>
                            <span className="ecp-etape__num">{String(i + 1).padStart(2, "0")}</span>
                            <div>
                                <h3 className="ecp-etape__titre">{e.n}</h3>
                                <p className="ecp-etape__texte">{e.texte}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* VISIBILITÉ */}
            <section className="ecp-section-split" id="visibilite">
                <div className="ecp-section-split__media">
                    <img src={heroTalent1} alt="Talent visible et repéré par les recruteurs" className="ecp-section-split__img" />
                </div>
                <div className="ecp-section-split__text">
                    <p className="ecp-section-eyebrow">Se faire remarquer</p>
                    <h2 className="ecp-section-title">Augmenter votre visibilité auprès des recruteurs</h2>
                    <ul className="ecp-checklist">
                        {CONSEILS_VISIBILITE.map((c) => (
                            <li key={c}>{c}</li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* RECHERCHE EFFICACE */}
            <section className="ecp-section-split ecp-section-split--reverse ecp-section--tint" id="recherche">
                <div className="ecp-section-split__media">
                    <img src={heroCandidature} alt="Candidat consultant les offres d'emploi disponibles" className="ecp-section-split__img" />
                </div>
                <div className="ecp-section-split__text">
                    <p className="ecp-section-eyebrow">Trouver le bon poste</p>
                    <h2 className="ecp-section-title">Rechercher efficacement un emploi</h2>
                    <ul className="ecp-checklist">
                        {CONSEILS_RECHERCHE.map((c) => (
                            <li key={c}>{c}</li>
                        ))}
                    </ul>
                    <Link to="/offres" className="ecp-inline-link">
                        Parcourir les offres d'emploi →
                    </Link>
                </div>
            </section>

            {/* VALORISER SES COMPÉTENCES */}
            <section className="ecp-section" id="competences">
                <p className="ecp-section-eyebrow">Vos compétences, en clair</p>
                <h2 className="ecp-section-title">Valoriser ce que vous savez faire</h2>
                <p className="ecp-section-lead">
                    Un recruteur passe quelques secondes sur chaque profil : nommez vos compétences
                    clairement, avec un exemple concret plutôt qu'une longue liste vague.
                </p>
                <div className="ecp-tags-demo">
                    {COMPETENCES_EXEMPLES.map((c) => (
                        <span className="ecp-tag-demo" key={c}>
                            {c}
                        </span>
                    ))}
                </div>
            </section>

            {/* IMPORTANCE DU CV */}
            <section className="ecp-section-split" id="cv">
                <div className="ecp-section-split__media">
                    <img src={heroSendCv} alt="Envoi d'un CV professionnel" className="ecp-section-split__img" />
                </div>
                <div className="ecp-section-split__text">
                    <div className="ecp-icon-badge"><IconDocument /></div>
                    <p className="ecp-section-eyebrow">La base de tout</p>
                    <h2 className="ecp-section-title">L'importance d'un CV complet</h2>
                    <p className="ecp-section-lead">
                        Un CV à jour, structuré et sans zone vide reste le premier document consulté
                        par un recruteur. Un profil sans CV, même bien rempli par ailleurs, est
                        rarement contacté en premier.
                    </p>
                </div>
            </section>

            {/* PRÉSENTATION PROFESSIONNELLE */}
            <section className="ecp-section-split ecp-section-split--reverse ecp-section--tint" id="presentation">
                <div className="ecp-section-split__media">
                    <img src={heroPhotoPro} alt="Présentation professionnelle soignée" className="ecp-section-split__img" />
                </div>
                <div className="ecp-section-split__text">
                    <div className="ecp-icon-badge"><IconBadge /></div>
                    <p className="ecp-section-eyebrow">La première impression</p>
                    <h2 className="ecp-section-title">L'importance d'une présentation professionnelle</h2>
                    <p className="ecp-section-lead">
                        Une photo de profil claire, un titre professionnel précis et une vidéo de
                        présentation courte donnent au recruteur une image fiable de vous avant même
                        le premier échange.
                    </p>
                </div>
            </section>

            {/* OPPORTUNITÉS */}
            <section className="ecp-section" id="opportunites">
                <p className="ecp-section-eyebrow">Ce qui vous attend</p>
                <h2 className="ecp-section-title">Les opportunités proposées par Talent Sénégal</h2>
                <div className="ecp-avantages-grid ecp-avantages-grid--3">
                    <div className="ecp-avantage-card">
                        <div className="ecp-avantage-card__icon"><IconSearch /></div>
                        <h3 className="ecp-avantage-card__titre">Offres d'emploi vérifiées</h3>
                        <p className="ecp-avantage-card__texte">
                            Des postes publiés par des recruteurs identifiés, dans tous les secteurs et régions du pays.
                        </p>
                    </div>
                    <div className="ecp-avantage-card">
                        <div className="ecp-avantage-card__icon"><IconStar /></div>
                        <h3 className="ecp-avantage-card__titre">Mise en relation directe</h3>
                        <p className="ecp-avantage-card__texte">
                            Les recruteurs peuvent vous contacter directement lorsque votre profil correspond à leur besoin.
                        </p>
                    </div>
                    <div className="ecp-avantage-card">
                        <div className="ecp-avantage-card__icon"><IconGraduation /></div>
                        <h3 className="ecp-avantage-card__titre">Formations recommandées</h3>
                        <p className="ecp-avantage-card__texte">
                            Progressez vers le poste visé grâce à des formations ciblées sur vos manques de compétences.
                        </p>
                    </div>
                </div>
            </section>

            {/* FORMATIONS */}
            <section className="ecp-formations">
                <div className="ecp-formations__media">
                    <img src={heroFormation} alt="Session de formation professionnelle" className="ecp-formations__img" />
                </div>
                <div className="ecp-formations__text">
                    <p className="ecp-section-eyebrow">Continuer à progresser</p>
                    <h2 className="ecp-section-title">Des formations pour renforcer votre profil</h2>
                    <p className="ecp-section-lead">
                        Retrouvez des formations sélectionnées pour combler l'écart entre votre profil
                        actuel et les postes que vous visez, et faites-les apparaître sur votre profil.
                    </p>
                    <Link to="/formations" className="ecp-btn ecp-btn--primary">
                        Voir les formations disponibles
                    </Link>
                </div>
            </section>

            {/* BANDEAU PHOTO */}
            <div className="ecp-bandeau">
                <img src={heroTalent2} alt="Talents accompagnés par Talent Sénégal" className="ecp-bandeau__img" />
            </div>

            {/* CITATION */}
            <section className="ecp-quote" style={{ backgroundImage: `url(${heroTalent3})` }}>
                <div className="ecp-quote__overlay" />
                <p className="ecp-quote__text">
                    « Un profil complet et une présentation soignée ouvrent plus de portes qu'une
                    centaine de candidatures envoyées à l'aveugle. »
                </p>
                <p className="ecp-quote__auteur">— L'équipe Talent Sénégal</p>
            </section>

            {/* CTA FINAL */}
            <section className="ecp-cta-final">
                <h2 className="ecp-cta-final__title">Prêt à construire votre identité de carrière ?</h2>
                <p className="ecp-cta-final__text">
                    Créez votre profil en quelques minutes et devenez visible auprès des recruteurs du Sénégal.
                </p>
                <div className="ecp-hero__actions ecp-hero__actions--center">
                    <Link to="/inscription?role=candidat" className="ecp-btn ecp-btn--primary">
                        Créer mon compte candidat
                    </Link>
                    <Link to="/offres" className="ecp-btn ecp-btn--ghost-light">
                        Voir les offres d'emploi
                    </Link>
                </div>
            </section>
        </div>
    );
}