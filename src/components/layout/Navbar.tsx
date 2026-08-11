import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ProfileMenu } from "./ProfileMenu";
import "./navbar.css";

interface NavLinkItem {
    to: string;
    label: string;
}

const candidatLinks: NavLinkItem[] = [
    { to: "/offres", label: "Offres d'emploi" },
    { to: "/candidat/offres-recommandees", label: "Recommandées pour vous" },
    { to: "/candidat/candidatures", label: "Mes candidatures" },
    { to: "/candidat/profil", label: "Mon profil" },
    { to: "/candidat/formation", label: "Mes formation" },
];

const recruteurLinks: NavLinkItem[] = [
    { to: "/recruteur/offres", label: "Mes offres" },
    { to: "/recruteur/offres/nouvelle", label: "Publier une offre" },
    { to: "/recruteur/candidatures", label: "Candidatures reçues" },
    { to: "/recruteur/entreprise", label: "Mon entreprise" },
];

// Menus visiteurs (visibles uniquement quand l'utilisateur n'est pas connecté),
// affichés juste avant les liens Connexion / Inscription.
const visiteurCandidatLinks: NavLinkItem[] = [
    { to: "/offres", label: "Offres d'emploi" },
    { to: "/formations", label: "Formations" },
    { to: "/inscription?role=candidat", label: "Créer un compte candidat" },
];

const visiteurRecruteurLinks: NavLinkItem[] = [
    { to: "/inscription?role=recruteur", label: "Publier une offre" },
    { to: "/a-propos", label: "Pourquoi Talent Sénégal" },
    { to: "/inscription?role=recruteur", label: "Créer un compte recruteur" },
];

function IconChevron() {
    return (
        <svg className="navbar__visitor-chevron" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function IconHamburger({ ouvert }: { ouvert: boolean }) {
    return (
        <span className={`navbar__burger${ouvert ? " navbar__burger--open" : ""}`} aria-hidden="true">
            <span />
            <span />
            <span />
        </span>
    );
}

interface VisitorDropdownProps {
    label: string;
    links: NavLinkItem[];
    id: string;
    activeMenu: string | null;
    setActiveMenu: (id: string | null) => void;
}

function VisitorDropdown({ label, links, id, activeMenu, setActiveMenu }: VisitorDropdownProps) {
    const estOuvert = activeMenu === id;

    return (
        <div className="navbar__visitor-dropdown">
            <button
                type="button"
                className={`navbar__visitor-trigger${estOuvert ? " navbar__visitor-trigger--open" : ""}`}
                onClick={() => setActiveMenu(estOuvert ? null : id)}
                aria-expanded={estOuvert}
                aria-haspopup="true"
            >
                {label}
                <IconChevron />
            </button>
            {estOuvert && (
                <div className="navbar__visitor-panel">
                    {links.map((link) => (
                        <Link
                            key={link.label}
                            to={link.to}
                            className="navbar__visitor-panel-link"
                            onClick={() => setActiveMenu(null)}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}

export function Navbar() {
    const { isAuthenticated, currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [menuOuvert, setMenuOuvert] = useState(false);
    const [activeVisitorMenu, setActiveVisitorMenu] = useState<string | null>(null);
    const [mobileVisitorMenu, setMobileVisitorMenu] = useState<string | null>(null);
    const visitorMenusRef = useRef<HTMLDivElement>(null);

    const espaceLinks: NavLinkItem[] =
        currentUser?.role === "RECRUTEUR" ? recruteurLinks : currentUser?.role === "CANDIDAT" ? candidatLinks : [];

    // Ferme le menu mobile à chaque changement de page.
    useEffect(() => {
        setMenuOuvert(false);
        setActiveVisitorMenu(null);
        setMobileVisitorMenu(null);
    }, [location.pathname]);

    // Empêche le scroll de fond quand le menu mobile est ouvert.
    useEffect(() => {
        document.body.style.overflow = menuOuvert ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [menuOuvert]);

    // Ferme les menus déroulants visiteurs au clic en dehors, ou avec Échap.
    useEffect(() => {
        if (!activeVisitorMenu) return;

        function handleClickDehors(e: MouseEvent) {
            if (visitorMenusRef.current && !visitorMenusRef.current.contains(e.target as Node)) {
                setActiveVisitorMenu(null);
            }
        }
        function handleEscape(e: KeyboardEvent) {
            if (e.key === "Escape") setActiveVisitorMenu(null);
        }

        document.addEventListener("mousedown", handleClickDehors);
        document.addEventListener("keydown", handleEscape);
        return () => {
            document.removeEventListener("mousedown", handleClickDehors);
            document.removeEventListener("keydown", handleEscape);
        };
    }, [activeVisitorMenu]);

    async function handleDeconnexion() {
        setMenuOuvert(false);
        await logout();
        navigate("/");
    }

    return (
        <header className="container navbar">
            <Link to="/" className="navbar__brand">
                Talent<span>Sénégal</span>
            </Link>

            {isAuthenticated && espaceLinks.length > 0 && (
                <nav className="navbar__menu navbar__desktop-only">
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
                    <div className="navbar__desktop-only">
                        <ProfileMenu />
                    </div>
                ) : (
                    <div className="navbar__auth-links navbar__desktop-only">
                        <div className="navbar__visitor-menus" ref={visitorMenusRef}>
                            <VisitorDropdown
                                id="candidat"
                                label="Candidat"
                                links={visiteurCandidatLinks}
                                activeMenu={activeVisitorMenu}
                                setActiveMenu={setActiveVisitorMenu}
                            />
                            <VisitorDropdown
                                id="recruteur"
                                label="Recruteur"
                                links={visiteurRecruteurLinks}
                                activeMenu={activeVisitorMenu}
                                setActiveMenu={setActiveVisitorMenu}
                            />
                        </div>
                        <Link to="/connexion" className="btn btn--ghost">
                            Connexion
                        </Link>
                        <Link to="/inscription" className="btn btn--ghost">
                            Inscription
                        </Link>
                    </div>
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

            {/* ---------- Menu mobile ---------- */}
            <div
                className={`navbar__mobile-overlay${menuOuvert ? " navbar__mobile-overlay--open" : ""}`}
                onClick={() => setMenuOuvert(false)}
                aria-hidden="true"
            />

            <div className={`navbar__mobile-panel${menuOuvert ? " navbar__mobile-panel--open" : ""}`}>
                {espaceLinks.length > 0 && (
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
                )}

                {!isAuthenticated && (
                    <div className="navbar__mobile-visitor-menus">
                        <div className="navbar__mobile-visitor-group">
                            <button
                                type="button"
                                className={`navbar__mobile-visitor-trigger${mobileVisitorMenu === "candidat" ? " navbar__mobile-visitor-trigger--open" : ""}`}
                                onClick={() => setMobileVisitorMenu((v) => (v === "candidat" ? null : "candidat"))}
                                aria-expanded={mobileVisitorMenu === "candidat"}
                            >
                                Candidat
                                <IconChevron />
                            </button>
                            {mobileVisitorMenu === "candidat" && (
                                <div className="navbar__mobile-visitor-sublinks">
                                    {visiteurCandidatLinks.map((link) => (
                                        <Link key={link.label} to={link.to} className="navbar__mobile-visitor-sublink">
                                            {link.label}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="navbar__mobile-visitor-group">
                            <button
                                type="button"
                                className={`navbar__mobile-visitor-trigger${mobileVisitorMenu === "recruteur" ? " navbar__mobile-visitor-trigger--open" : ""}`}
                                onClick={() => setMobileVisitorMenu((v) => (v === "recruteur" ? null : "recruteur"))}
                                aria-expanded={mobileVisitorMenu === "recruteur"}
                            >
                                Recruteur
                                <IconChevron />
                            </button>
                            {mobileVisitorMenu === "recruteur" && (
                                <div className="navbar__mobile-visitor-sublinks">
                                    {visiteurRecruteurLinks.map((link) => (
                                        <Link key={link.label} to={link.to} className="navbar__mobile-visitor-sublink">
                                            {link.label}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div className="navbar__mobile-actions">
                    {isAuthenticated ? (
                        <>
                            <Link
                                to={currentUser?.role === "RECRUTEUR" ? "/recruteur/entreprise" : "/candidat/profil"}
                                className="btn btn--ghost"
                            >
                                Mon profil
                            </Link>
                            <button type="button" className="btn btn--ghost" onClick={handleDeconnexion}>
                                Se déconnecter
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/connexion" className="btn btn--ghost">
                                Connexion
                            </Link>
                            <Link to="/inscription" className="btn btn--ghost">
                                Inscription
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}