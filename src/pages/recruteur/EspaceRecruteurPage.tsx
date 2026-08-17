import { Link } from "react-router-dom";
import "./EspaceRecruteurPage.css";

// Ajuster les chemins relatifs selon l'emplacement de vos assets
import heroRecruteur from "../../assets/talent-1.jpg";
import heroTalentSearch from "../../assets/talent-2.jpg";
import heroEntreprise from "../../assets/talent-3.jpg";
import heroSelection from "../../assets/candidats.jpg";
import heroDashboard from "../../assets/candidature.jpg";

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

function IconBuilding() {
    return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M4 21V3h16v18H4Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
            <path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
    );
}

const AVANTAGES_RECRUTEUR = [
    {
        icon: <IconTarget />,
        titre: "Des profils complets et vérifiés",
        texte:
            "Accédez à une base de talents sénégalais dont les compétences, les expériences et la complétude du profil sont clairement mises en avant.",
    },
    {
        icon: <IconSearch />,
        titre: "Détection rapide par affinité",
        texte:
            "Notre algorithme classe les candidats selon leur score de compatibilité avec vos offres pour identifier les profils pertinents en un clin d'œil.",
    },
    {
        icon: <IconBuilding />,
        titre: "Valorisation de votre marque employeur",
        texte:
            "Mettez en valeur votre entreprise, vos valeurs et vos projets de croissance pour attirer les meilleurs profils du marché local.",
    },
    {
        icon: <IconEye />,
        titre: "Suivi centralisé des candidatures",
        texte:
            "Gérez vos offres, suivez les dossiers reçus et collaborez efficacement avec vos équipes de recrutement au même endroit.",
    },
];

const ETAPES_RECRUTEMENT = [
    {
        n: "Inscription et profil entreprise",
        texte: "Renseignez votre secteur d'activité, votre localisation et l'esprit de votre structure.",
    },
    {
        n: "Publication d'offres ciblées",
        texte: "Définissez les compétences clés recherchées pour cibler directement les bons candidats.",
    },
    {
        n: "Exploration et filtres intelligents",
        texte: "Consultez les profils les plus complets et repérez instantanément les talents adaptés à vos besoins.",
    },
    {
        n: "Prise de contact et entretiens",
        texte: "Initiez les échanges directement avec les candidats sélectionnés pour intégrer vos équipes.",
    },
];

const CONSEILS_OFFRES = [
    "Un intitulé de poste clair et précis double le taux de réponse des candidats qualifiés.",
    "Lister les technologies et compétences indispensables évite de recevoir des profils hors sujet.",
    "Détailler les missions concrètes rassure et attire les professionnels les plus motivés.",
    "Publier des offres actualisées maintient un flux régulier de candidatures pertinentes.",
];

const CONSEILS_SELECTION = [
    "Repérez en priorité les profils affichant un taux de complétude élevé (recommandations automatiques).",
    "Consultez les présentations vidéo et les portfolios pour évaluer rapidement les savoir-faire.",
    "Répondez rapidement aux meilleurs profils pour éviter qu'ils ne soient recrutés ailleurs.",
    "Utilisez les filtres par zone géographique pour cibler les candidats disponibles près de chez vous.",
];

export function EspaceRecruteurPage() {
    return (
        <div className="ecp">
            {/* HERO */}
            <section className="ecp-hero">
                <div className="ecp-hero__content">
                    <p className="ecp-eyebrow">Espace recruteur</p>
                    <h1 className="ecp-hero__title">
                        Détectez rapidement les meilleurs talents du Sénégal.
                    </h1>
                    <p className="ecp-hero__subtitle">
                        Talent Sénégal simplifie vos recrutements : publiez vos offres, accédez à des profils
                        détaillés et trouvez vos futurs collaborateurs en toute efficacité.
                    </p>
                    <div className="ecp-hero__actions">
                        <Link to="/inscription?role=recruteur" className="ecp-btn ecp-btn--primary">
                            Créer un compte recruteur
                        </Link>
                        <Link to="/connexion" className="ecp-btn ecp-btn--ghost">
                            Publier une offre
                        </Link>
                    </div>
                </div>
                <div className="ecp-hero__media">
                    <img src={heroRecruteur} alt="Espace recruteur Talent Sénégal" className="ecp-hero__img" />
                </div>
            </section>

            {/* FRISE PARCOURS */}
            <section className="ecp-parcours">
                <p className="ecp-section-eyebrow ecp-section-eyebrow--light">Votre parcours sur la plateforme</p>
                <h2 className="ecp-parcours__title">De l'offre publiée au recrutement réussi</h2>
                <div className="ecp-parcours__track">
                    <div className="ecp-parcours__line" />
                    {["Entreprise inscrite", "Offre publiée", "Talents détectés", "Collaborateur recruté"].map((etape, i) => (
                        <div className="ecp-parcours__step" key={etape}>
                            <span className="ecp-parcours__dot">{i + 1}</span>
                            <span className="ecp-parcours__label">{etape}</span>
                        </div>
                    ))}
                </div>
                <p className="ecp-parcours__hint">
                    Un processus pensé pour réduire votre temps de sourcing et maximiser la pertinence de vos choix.
                </p>
            </section>

            {/* AVANTAGES */}
            <section className="ecp-section">
                <p className="ecp-section-eyebrow">Pourquoi recruter sur Talent Sénégal</p>
                <h2 className="ecp-section-title">Des outils taillés pour l'efficacité</h2>
                <div className="ecp-avantages-grid">
                    {AVANTAGES_RECRUTEUR.map((a) => (
                        <div className="ecp-avantage-card" key={a.titre}>
                            <div className="ecp-avantage-card__icon">{a.icon}</div>
                            <h3 className="ecp-avantage-card__titre">{a.titre}</h3>
                            <p className="ecp-avantage-card__texte">{a.texte}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ÉTAPES DE RECRUTEMENT */}
            <section className="ecp-section ecp-section--tint">
                <p className="ecp-section-eyebrow">Méthodologie</p>
                <h2 className="ecp-section-title">Comment structurer vos campagnes de recrutement</h2>
                <p className="ecp-section-lead">
                    Suivez ces étapes clés pour attirer l'attention des meilleurs profils inscrits sur la plateforme.
                </p>
                <div className="ecp-etapes">
                    {ETAPES_RECRUTEMENT.map((e, i) => (
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

            {/* CONSEILS OFFRES */}
            <section className="ecp-section-split">
                <div className="ecp-section-split__media">
                    <img src={heroTalentSearch} alt="Rédaction d'offres d'emploi" className="ecp-section-split__img" />
                </div>
                <div className="ecp-section-split__text">
                    <div className="ecp-icon-badge"><IconTarget /></div>
                    <p className="ecp-section-eyebrow">Attractivité des offres</p>
                    <h2 className="ecp-section-title">Rédiger des annonces percutantes</h2>
                    <ul className="ecp-checklist">
                        {CONSEILS_OFFRES.map((c) => (
                            <li key={c}>{c}</li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* CONSEILS SÉLECTION */}
            <section className="ecp-section-split ecp-section-split--reverse ecp-section--tint">
                <div className="ecp-section-split__media">
                    <img src={heroSelection} alt="Sélection rigoureuse des candidats" className="ecp-section-split__img" />
                </div>
                <div className="ecp-section-split__text">
                    <div className="ecp-icon-badge"><IconSearch /></div>
                    <p className="ecp-section-eyebrow">Sourcing intelligent</p>
                    <h2 className="ecp-section-title">Repérer rapidement les profils qualifiés</h2>
                    <ul className="ecp-checklist">
                        {CONSEILS_SELECTION.map((c) => (
                            <li key={c}>{c}</li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* BANDEAU ENTREPRISE */}
            <div className="ecp-bandeau">
                <img src={heroEntreprise} alt="Réseau d'entreprises partenaires" className="ecp-bandeau__img" />
            </div>

            {/* CITATION */}
            <section className="ecp-quote" style={{ backgroundImage: `url(${heroDashboard})` }}>
                <div className="ecp-quote__overlay" />
                <div className="ecp-quote__content">
                    <p className="ecp-quote__text">
                        « Grâce à la visibilité des profils complets et aux alertes de compatibilité,
                        nous avons réduit par deux le temps nécessaire pour pourvoir nos postes clés. »
                    </p>
                    <p className="ecp-quote__auteur">— Responsable RH, Entreprise partenaire</p>
                </div>
            </section>

            {/* CTA FINAL */}
            <section className="ecp-cta-final">
                <h2 className="ecp-cta-final__title">Prêt à recruter vos futurs talents ?</h2>
                <p className="ecp-cta-final__text">
                    Rejoignez dès aujourd'hui les entreprises qui font confiance à Talent Sénégal.
                </p>
                <div className="ecp-hero__actions ecp-hero__actions--center">
                    <Link to="/inscription?role=recruteur" className="ecp-btn ecp-btn--primary">
                        Créer un compte recruteur
                    </Link>
                    <Link to="/connexion" className="ecp-btn ecp-btn--ghost-light">
                        Accéder à mon espace
                    </Link>
                </div>
            </section>
        </div>
    );
}