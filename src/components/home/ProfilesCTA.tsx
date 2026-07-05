import { Link } from "react-router-dom";

export function ProfilesCTA() {
    return (
        <div className="home-cta-band">
            <div className="home-container home-cta-band__inner">
                <div>
                    <h3>Profils d'exception</h3>
                    <p>Recruteurs, découvrez une sélection de talents disponibles et prêts à rejoindre votre équipe.</p>
                </div>
                <Link to="/talents" className="home-btn home-btn--outline">
                    Parcourir les talents →
                </Link>
            </div>
        </div>
    );
}