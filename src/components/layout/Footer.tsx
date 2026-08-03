import { Link } from "react-router-dom";
import "./footer.css";

const ANNEE = new Date().getFullYear();

export function Footer() {
    return (
        <footer className="footer">
            <div className="footer__accent" aria-hidden="true" />

            <div className="footer__container">
                <div className="footer__main">
                    {/* MARQUE */}
                    <div className="footer__brand">
                        <Link to="/" className="footer__logo">
                            <span className="footer__logo-mark">TS</span>
                            <span className="footer__logo-text">Talent Sénégal</span>
                        </Link>

                        <p className="footer__description">
                            La plateforme qui rapproche les talents, les entreprises et les opportunités
                            professionnelles au Sénégal.
                        </p>

                        <div className="footer__socials">
                            <a href="#" className="footer__social" aria-label="Facebook" title="Bientôt disponible">
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z" />
                                </svg>
                            </a>
                            <a href="#" className="footer__social" aria-label="LinkedIn" title="Bientôt disponible">
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.11 20.45H3.56V9h3.55v11.45z" />
                                </svg>
                            </a>
                            <a href="#" className="footer__social" aria-label="Instagram" title="Bientôt disponible">
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.97.24 2.43.4a4.9 4.9 0 0 1 1.77 1.15 4.9 4.9 0 0 1 1.15 1.77c.16.46.35 1.26.4 2.43.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.24 1.97-.4 2.43a4.9 4.9 0 0 1-1.15 1.77 4.9 4.9 0 0 1-1.77 1.15c-.46.16-1.26.35-2.43.4-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.97-.24-2.43-.4a4.9 4.9 0 0 1-1.77-1.15 4.9 4.9 0 0 1-1.15-1.77c-.16-.46-.35-1.26-.4-2.43C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.24-1.97.4-2.43a4.9 4.9 0 0 1 1.15-1.77A4.9 4.9 0 0 1 5.55 1.8c.46-.16 1.26-.35 2.43-.4C9.25 1.34 9.63 1.33 12 1.33m0 2.17c-3.17 0-3.55.01-4.79.07-.98.04-1.5.21-1.86.34-.47.18-.8.4-1.15.75-.35.35-.57.68-.75 1.15-.13.36-.3.88-.34 1.86-.06 1.24-.07 1.62-.07 4.79s.01 3.55.07 4.79c.04.98.21 1.5.34 1.86.18.47.4.8.75 1.15.35.35.68.57 1.15.75.36.13.88.3 1.86.34 1.24.06 1.62.07 4.79.07s3.55-.01 4.79-.07c.98-.04 1.5-.21 1.86-.34.47-.18.8-.4 1.15-.75.35-.35.57-.68.75-1.15.13-.36.3-.88.34-1.86.06-1.24.07-1.62.07-4.79s-.01-3.55-.07-4.79c-.04-.98-.21-1.5-.34-1.86a3.1 3.1 0 0 0-.75-1.15 3.1 3.1 0 0 0-1.15-.75c-.36-.13-.88-.3-1.86-.34-1.24-.06-1.62-.07-4.79-.07M12 6.87A5.13 5.13 0 1 1 12 17.13 5.13 5.13 0 0 1 12 6.87m0 2.16a2.97 2.97 0 1 0 0 5.94 2.97 2.97 0 0 0 0-5.94m5.34-2.4a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0" />
                                </svg>
                            </a>
                            <a href="#" className="footer__social" aria-label="X" title="Bientôt disponible">
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M18.9 2.9h3.1l-6.8 7.8L23.3 21h-6.3l-4.9-6.4L6.4 21H3.3l7.3-8.3L2.7 2.9H9.2l4.4 5.9zm-1.1 16.2h1.7L7.3 4.7H5.5z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* CANDIDATS */}
                    <div className="footer__column">
                        <h3>Candidats</h3>
                        <Link to="/offres">Offres d'emploi</Link>
                        <Link to="/formations">Formations</Link>
                        <Link to="/inscription?role=candidat">Créer mon profil</Link>
                        <Link to="/connexion">Suivre mes candidatures</Link>
                    </div>

                    {/* RECRUTEURS */}
                    <div className="footer__column">
                        <h3>Recruteurs</h3>
                        <Link to="/inscription?role=recruteur">Publier une offre</Link>
                        <Link to="/connexion">Espace recruteur</Link>
                        <Link to="/a-propos">Pourquoi nous choisir</Link>
                    </div>

                    {/* ENTREPRISE */}
                    <div className="footer__column">
                        <h3>Talent Sénégal</h3>
                        <Link to="/a-propos">À propos</Link>
                        <Link to="/contact">Nous contacter</Link>
                    </div>

                    {/* CONTACT */}
                    <div className="footer__column footer__column--contact">
                        <h3>Contact</h3>
                        <a href="mailto:contact@talentsenegal.sn">contact@talentsenegal.sn</a>
                        <a href="tel:+221777072424">+221 77 707 24 24</a>
                        <span>Nord Foire, Dakar, Sénégal</span>
                    </div>
                </div>

                <div className="footer__separator" />

                <div className="footer__bottom">
                    <p>© {ANNEE} Talent Sénégal. Tous droits réservés.</p>

                    <nav className="footer__legal">
                        <Link to="/mentions-legales">Mentions légales</Link>
                        <Link to="/cgu">CGU</Link>
                        <Link to="/confidentialite">Confidentialité</Link>
                    </nav>
                </div>
            </div>
        </footer>
    );
}