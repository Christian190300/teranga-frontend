import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ProfileMenu } from "./ProfileMenu";
import "./navbar.css";

interface NavLink {
    to: string;
    label: string;
}

const candidatLinks: NavLink[] = [
    { to: "/offres", label: "Offres d'emploi" },
    { to: "/candidat/candidatures", label: "Mes candidatures" },
    { to: "/candidat/profil", label: "Mon profil" },
    { to: "/candidat/formation", label: "Mes formation" },
];

const recruteurLinks: NavLink[] = [
    { to: "/recruteur/offres", label: "Mes offres" },
    { to: "/recruteur/offres/nouvelle", label: "Publier une offre" },
    { to: "/recruteur/candidatures", label: "Candidatures reçues" },
    { to: "/recruteur/entreprise", label: "Mon entreprise" },
];

function IconHamburger({ ouvert }: { ouvert: boolean }) {
    return (
        <span className={`navbar__burger${ouvert ? " navbar__burger--open" : ""}`} aria-hidden="true">
            <span />
            <span />
            <span />
        </span>
    );
}

export function Navbar() {
    const { isAuthenticated, currentUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [menuOuvert, setMenuOuvert] = useState(false);

    const espaceLinks: NavLink[] =
        currentUser?.role === "RECRUTEUR" ? recruteurLinks : currentUser?.role === "CANDIDAT" ? candidatLinks : [];

    // Ferme le menu mobile à chaque changement de page.
    useEffect(() => {
        setMenuOuvert(false);
    }, [location.pathname]);

    // Empêche le scroll de fond quand le menu mobile est ouvert.
    useEffect(() => {
        document.body.style.overflow = menuOuvert ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [menuOuvert]);

    return (
        <header className="container navbar">
            <Link to="/" className="navbar__brand">
                Talent<span>Sénégal</span>
            </Link>

            {isAuthenticated && espaceLinks.length > 0 && (
                <nav className="navbar__menu">
                    {espaceLinks.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            end={link.to === "/recruteur/offres"}
                            className={({ isActive }) => `navbar__menu-link ${isActive ? "active" : ""}`}
                        >
                            {link.label}
                        </NavLink>
                    ))}
                </nav>
            )}

            <nav className="navbar__links">
                {isAuthenticated ? (
                    <ProfileMenu />
                ) : (
                    <Link to="/connexion" className="btn btn--ghost navbar__desktop-only" onClick={() => navigate("/connexion")}>
                        Commencer
                    </Link>
                )}

                <button
                    type="button"
                    className="navbar__burger-btn"
                    onClick={() => setMenuOuvert((v) => !v)}
                    aria-label={menuOuvert ? "Fermer le menu" : "Ouvrir le menu"}
                    aria-expanded={menuOuvert}
                >
                    <IconHamburger ouvert={menuOuvert} />
                </button>
            </nav>

            {/* ---------- Panneau mobile ---------- */}
            <div className={`navbar__mobile-overlay${menuOuvert ? " navbar__mobile-overlay--open" : ""}`} onClick={() => setMenuOuvert(false)} />

            <div className={`navbar__mobile-panel${menuOuvert ? " navbar__mobile-panel--open" : ""}`}>
                <nav className="navbar__mobile-links">
                    {espaceLinks.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            end={link.to === "/recruteur/offres"}
                            className={({ isActive }) => `navbar__mobile-link ${isActive ? "active" : ""}`}
                        >
                            {link.label}
                        </NavLink>
                    ))}
                </nav>

                {!isAuthenticated && (
                    <div className="navbar__mobile-actions">
                        <Link to="/connexion" className="btn btn--ghost" onClick={() => setMenuOuvert(false)}>
                            Se connecter
                        </Link>
                        <Link to="/inscription" className="btn btn--primary" onClick={() => setMenuOuvert(false)}>
                            Créer un compte
                        </Link>
                    </div>
                )}
            </div>
        </header>
    );
}