import { Link, NavLink, useNavigate } from "react-router-dom";import { useAuth } from "../../context/AuthContext";
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

export function Navbar() {
    const { isAuthenticated, currentUser } = useAuth();
    const navigate = useNavigate();

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
                        <NavLink
                            key={link.to}
                            to={link.to}
                            end={link.to === "/recruteur/offres"}
                            className={({ isActive }) =>
                                `navbar__menu-link ${isActive ? "active" : ""}`
                            }
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
                    <Link to="/connexion" className="btn btn--ghost" onClick={() => navigate("/connexion")}>
                        Commencer
                    </Link>
                )}
            </nav>
        </header>
    );
}