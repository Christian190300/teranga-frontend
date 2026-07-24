import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { IconBuilding, IconBriefcase, IconLayoutDashboard, IconLogOut, IconSettings, IconUsers } from "../home/icons";
import "./sidebar.css";

const generalLinks = [
    { to: "/admin", label: "Tableau de bord", icon: <IconLayoutDashboard /> },
    { to: "/admin/utilisateurs", label: "Utilisateurs", icon: <IconUsers /> },
    { to: "/admin/entreprises", label: "Entreprises", icon: <IconBuilding /> },
    { to: "/admin/offres", label: "Offres", icon: <IconBriefcase /> },
    { to: "/admin/candidatures", label: "Candidatures", icon: <IconBriefcase /> },
    { to: "/admin/formations", label: "Creer Formation", icon: <IconBriefcase /> },
];

const systemLinks = [{ to: "/admin/parametres", label: "Paramètres", icon: <IconSettings /> }];

export function Sidebar() {
    const { currentUser, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    async function handleLogout() {
        await logout();
        navigate("/");
    }

    function handleLinkClick() {
        setIsOpen(false);
    }

    const initials = currentUser ? `${currentUser.firstName[0] ?? ""}${currentUser.lastName[0] ?? ""}`.toUpperCase() : "AD";

    function renderLinks(links: typeof generalLinks) {
        return links.map((link) => (
            <Link
                key={link.to}
                to={link.to}
                onClick={handleLinkClick}
                className={`sidebar__link ${location.pathname === link.to ? "active" : ""}`}
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
                <span className={`sidebar__hamburger-bar ${isOpen ? "open" : ""}`} />
                <span className={`sidebar__hamburger-bar ${isOpen ? "open" : ""}`} />
                <span className={`sidebar__hamburger-bar ${isOpen ? "open" : ""}`} />
            </button>

            {isOpen && <div className="sidebar__overlay" onClick={() => setIsOpen(false)} />}

            <aside className={`sidebar ${isOpen ? "sidebar--open" : ""}`}>
                <Link to="/admin" className="sidebar__brand" onClick={handleLinkClick}>
                    <span className="sidebar__brand-mark">TS</span>
                    <span className="sidebar__brand-name">Talent Sénégal</span>
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
                    <button className="sidebar__logout-icon" onClick={handleLogout} aria-label="Se déconnecter">
                        <IconLogOut />
                    </button>
                </div>
            </aside>
        </>
    );
}