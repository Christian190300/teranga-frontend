import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { IconBuilding, IconBriefcase, IconLayoutDashboard, IconLogOut, IconSettings, IconUsers } from "../home/icons";
import "./sidebar.css";

function IconHome() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M3 10.5L12 3l9 7.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function IconCalendar() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
            <path d="M3 10h18" stroke="currentColor" strokeWidth="2" />
            <path d="M8 3v4M16 3v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
    );
}

const generalLinks = [
    { to: "/admin", label: "Tableau de bord", icon: <IconLayoutDashboard /> },
    { to: "/admin/utilisateurs", label: "Utilisateurs", icon: <IconUsers /> },
    { to: "/admin/profils-completion", label: "Complétion des profils", icon: <IconUsers /> },
    { to: "/admin/entreprises", label: "Entreprises", icon: <IconBuilding /> },
    { to: "/admin/offres", label: "Offres", icon: <IconBriefcase /> },
    { to: "/admin/offres/import", label: "Import SENJOB", icon: <IconBriefcase /> },
    { to: "/admin/candidatures", label: "Candidatures", icon: <IconBriefcase /> },
    { to: "/admin/evenements", label: "Événements", icon: <IconCalendar /> },
    { to: "/admin/formations", label: "Creer Formation", icon: <IconBriefcase /> },
    { to: "/admin/annonces", label: "Envoyer une annonce", icon: <IconUsers /> },
];

const systemLinks = [{ to: "/admin/parametres", label: "Paramètres", icon: <IconSettings /> }];

export function Sidebar() {
    const { currentUser, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    async function handleLogout() {
        if (isLoggingOut) return;

        setIsLoggingOut(true);
        setIsOpen(false);

        try {
            await logout();
        } catch (error) {
            console.error("Erreur lors de la déconnexion :", error);
        } finally {
            navigate("/", { replace: true });
            setIsLoggingOut(false);
        }
    }

    function handleLinkClick() {
        setIsOpen(false);
    }

    const initials = currentUser
        ? `${currentUser.firstName?.[0] ?? ""}${currentUser.lastName?.[0] ?? ""}`.toUpperCase()
        : "AD";

    /**
     * Un lien reste actif sur ses sous-routes (ex: "/admin/utilisateurs" reste
     * surligné quand on est sur "/admin/utilisateurs/abc-123", la fiche détail
     * d'un utilisateur précis). Cas particulier pour "/admin" : il ne doit
     * matcher que l'URL exacte, sinon il resterait actif sur toutes les pages
     * admin (qui commencent toutes par /admin).
     */
    function estActif(to: string) {
        if (to === "/admin") {
            return location.pathname === "/admin";
        }
        return location.pathname === to || location.pathname.startsWith(`${to}/`);
    }

    function renderLinks(links: typeof generalLinks) {
        return links.map((link) => (
            <Link
                key={link.to}
                to={link.to}
                onClick={handleLinkClick}
                className={`sidebar__link ${estActif(link.to) ? "active" : ""}`}
            >
                {link.icon}
                {link.label}
            </Link>
        ));
    }

    return (
        <>
            <button
                className="sidebar__hamburger"
                onClick={() => setIsOpen((prev) => !prev)}
                aria-label="Ouvrir le menu"
                aria-expanded={isOpen}
            >
                <span className="sidebar__hamburger-icon">
                    <span className={`sidebar__hamburger-bar ${isOpen ? "open" : ""}`} />
                    <span className={`sidebar__hamburger-bar ${isOpen ? "open" : ""}`} />
                    <span className={`sidebar__hamburger-bar ${isOpen ? "open" : ""}`} />
                </span>
            </button>

            {isOpen && <div className="sidebar__overlay" onClick={() => setIsOpen(false)} />}

            <aside className={`sidebar ${isOpen ? "sidebar--open" : ""}`}>
                <Link to="/admin" className="sidebar__brand" onClick={handleLinkClick}>
                    <span className="sidebar__brand-mark">TS</span>
                    <span className="sidebar__brand-name">Talent Sénégal</span>
                </Link>

                <Link to="/" onClick={handleLinkClick} className="sidebar__link sidebar__link--home">
                    <IconHome />
                    Voir le site public
                </Link>

                <div className="sidebar__section-label">Général</div>
                <nav className="sidebar__nav">{renderLinks(generalLinks)}</nav>

                <div className="sidebar__section-label">Système</div>
                <nav className="sidebar__nav">{renderLinks(systemLinks)}</nav>

                <div className="sidebar__spacer" />

                <div className="sidebar__profile">
                    <span className="sidebar__avatar">{initials}</span>
                    <div className="sidebar__profile-info">
                        <div className="sidebar__profile-name">
                            {currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : "Administrateur"}
                        </div>
                        <div className="sidebar__profile-role">Administrateur</div>
                    </div>
                    <button
                        type="button"
                        className="sidebar__logout-icon"
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        aria-label="Se déconnecter"
                    >
                        <IconLogOut />
                    </button>
                </div>
            </aside>
        </>
    );
}