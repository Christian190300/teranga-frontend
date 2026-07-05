import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./sidebar.css";

const links = [
    { to: "/admin", label: "Tableau de bord" },
    { to: "/admin/utilisateurs", label: "Utilisateurs" },
    { to: "/admin/entreprises", label: "Entreprises" },
    { to: "/admin/offres", label: "Offres" },
];

export function Sidebar() {
    const { currentUser, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    async function handleLogout() {
        await logout();
        navigate("/");
    }

    return (
        <aside className="sidebar">
            <Link to="/admin" className="sidebar__brand">
                Talent<span>Sénégal</span>
            </Link>
            <p className="sidebar__role">Espace administrateur{currentUser ? ` · ${currentUser.firstName}` : ""}</p>

            <nav className="sidebar__nav">
                {links.map((link) => (
                    <Link key={link.to} to={link.to} className={`sidebar__link ${location.pathname === link.to ? "active" : ""}`}>
                        {link.label}
                    </Link>
                ))}
            </nav>

            <div className="sidebar__footer">
                <button className="sidebar__logout" onClick={handleLogout}>
                    Se déconnecter
                </button>
            </div>
        </aside>
    );
}