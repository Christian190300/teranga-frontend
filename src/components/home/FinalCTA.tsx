import { Link } from "react-router-dom";

export function FinalCTA() {
    return (
        <section className="home-final home-container">
            <div className="home-final__circle" />
            <h2>Prêt à franchir le cap ?</h2>
            <p>Rejoignez les professionnels qui font confiance à Talent Sénégal.</p>
            <div className="home-final__actions">
                <Link to="/inscription?role=candidat" className="home-btn home-btn--gold">
                    Créer mon profil
                </Link>
                <Link to="/inscription?role=candidat" className="home-btn home-btn--outline">
                    Voir les offres
                </Link>
            </div>
        </section>
    );
}