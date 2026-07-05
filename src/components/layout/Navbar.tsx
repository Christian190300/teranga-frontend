import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./navbar.css";

interface NavLink {
    to: string;
    label: string;
}

const candidatLinks: NavLink[] = [
    { to: "/offres", label: "Offres d'emploi" },
    { to: "/candidat/candidatures", label: "Mes candidatures" },
    { to: "/candidat/profil", label: "Mon profil" },
];

const recruteurLinks: NavLink[] = [
    { to: "/recruteur/offres", label: "Mes offres" },
    { to: "/recruteur/offres/nouvelle", label: "Publier une offre" },
    { to: "/recruteur/candidatures", label: "Candidatures reçues" },
    { to: "/recruteur/entreprise", label: "Mon entreprise" },
];

export function Navbar() {
    const { isAuthenticated, currentUser, logout } = useAuth();
    const navigate = useNavigate();

    async function handleLogout() {
        await logout();
        navigate("/");
    }

    const espaceLinks: NavLink[] =
        currentUser?.role === "RECRUTEUR" ? recruteurLinks : currentUser?.role === "CANDIDAT" ? candidatLinks : [];

    return (
        <header className="container navbar">
            <Link to="/" className="navbar__brand">
                Talent<span>Sénégal</span>
            </Link>

            {isAuthenticated && espaceLinks.length > 0 && (
                <nav className="navbar__menu">
                    {espaceLinks.map((link) => (
                        <Link key={link.to} to={link.to} className="navbar__menu-link">
                            {link.label}
                        </Link>
                    ))}
                </nav>
            )}

            <nav className="navbar__links">
                {isAuthenticated ? (
                    <button className="btn btn--ghost" onClick={handleLogout}>
                        Se déconnecter
                    </button>
                ) : (
                    <Link to="/connexion" className="btn btn--ghost">
                        Commencer
                    </Link>
                )}
            </nav>
        </header>
    );
}