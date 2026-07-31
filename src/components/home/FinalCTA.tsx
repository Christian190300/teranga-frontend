import { Link } from "react-router-dom";
import "./finalCta.css";

export function FinalCTA() {
    return (
        <section className="final-cta">
            <div className="final-cta__glow final-cta__glow--1" aria-hidden="true" />
            <div className="final-cta__glow final-cta__glow--2" aria-hidden="true" />

            <div className="final-cta__container">
                <span className="final-cta__eyebrow">Rejoignez-nous</span>
                <h2 className="final-cta__title">Prêt à franchir le cap ?</h2>
                <p className="final-cta__text">
                    Rejoignez les milliers de professionnels et d'entreprises qui font confiance à Talent Sénégal
                    pour construire leur avenir.
                </p>

                <div className="final-cta__actions">
                    <Link to="/inscription?role=candidat" className="final-cta__btn final-cta__btn--gold">
                        Créer mon profil
                        <span aria-hidden="true">→</span>
                    </Link>
                    <Link to="/offres" className="final-cta__btn final-cta__btn--outline">
                        Voir les offres
                    </Link>
                </div>

                <p className="final-cta__note">Gratuit • Sans engagement • Inscription en 2 minutes</p>
            </div>
        </section>
    );
}