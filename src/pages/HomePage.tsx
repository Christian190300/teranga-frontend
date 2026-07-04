import { Link } from "react-router-dom";

export function HomePage() {
    return (
        <main className="container">
            <section className="hero">
                <p className="hero__eyebrow">Talent Sénégal</p>
                <h1 className="hero__title">
                    Là où le talent sénégalais <em>rencontre</em> l'opportunité
                </h1>
                <p className="hero__subtitle">
                    Une plateforme pensée pour deux publics : les candidats qui cherchent le poste qui leur
                    correspond, et les recruteurs qui cherchent le profil qu'il leur faut. Choisissez votre
                    chemin.
                </p>

                <div className="paths">
                    <Link to="/inscription?role=candidat" className="paths__path">
                        <span className="paths__number">01 — Candidat</span>
                        <h3>Je cherche un emploi</h3>
                        <p>Créez votre profil, ajoutez votre CV et vos compétences, postulez en quelques clics.</p>
                        <span className="paths__cta">Créer mon profil candidat →</span>
                    </Link>
                    <Link to="/inscription?role=recruteur" className="paths__path">
                        <span className="paths__number">02 — Recruteur</span>
                        <h3>Je recrute</h3>
                        <p>Publiez vos offres, présentez votre entreprise, trouvez les bons profils rapidement.</p>
                        <span className="paths__cta">Créer mon compte entreprise →</span>
                    </Link>
                </div>

                <div className="stats">
                    <div className="stats__item">
                        <div className="stats__value">100%</div>
                        <div className="stats__label">Candidats sénégalais</div>
                    </div>
                    <div className="stats__item">
                        <div className="stats__value">2</div>
                        <div className="stats__label">Profils : candidat & recruteur</div>
                    </div>
                    <div className="stats__item">
                        <div className="stats__value">0 FCFA</div>
                        <div className="stats__label">Pour créer votre profil</div>
                    </div>
                </div>
            </section>
        </main>
    );
}