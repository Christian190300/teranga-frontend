import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { IconBuilding, IconBriefcase, IconLayoutDashboard, IconLogOut, IconSettings, IconUsers } from "../home/icons";
import "./Sidebar.css";

const generalLinks = [
    { to: "/admin", label: "Tableau de bord", icon: <IconLayoutDashboard /> },
    { to: "/admin/utilisateurs", label: "Utilisateurs", icon: <IconUsers /> },
    { to: "/admin/entreprises", label: "Entreprises", icon: <IconBuilding /> },
    { to: "/admin/offres", label: "Offres", icon: <IconBriefcase /> },
    { to: "/admin/creerformation", label: "Creer Formation", icon: <IconBriefcase /> },
];

const systemLinks = [{ to: "/admin/parametres", label: "Paramètres", icon: <IconSettings /> }];

export function Sidebar() {
    const { currentUser, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    async function handleLogout() {
        await logout();
        navigate("/");
    }

    const initials = currentUser ? `${currentUser.firstName[0] ?? ""}${currentUser.lastName[0] ?? ""}`.toUpperCase() : "AD";

    function renderLinks(links: typeof generalLinks) {
        return links.map((link) => (
            <Link key={link.to} to={link.to} className={`sidebar__link ${location.pathname === link.to ? "active" : ""}`}>
                {link.icon}
                {link.label}
            </Link>
        ));
    }

    return (
        <aside className="sidebar">
            <Link to="/admin" className="sidebar__brand">
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
    );
}