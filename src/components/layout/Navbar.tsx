import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export function Navbar() {
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    async function handleLogout() {
        await logout();
        navigate("/");
    }

    return (
        <header className="container navbar">
            <Link to="/" className="navbar__brand">
                Talent<span>Sénégal</span>
            </Link>
            <nav className="navbar__links">
                {isAuthenticated ? (
                    <button className="btn btn--ghost" onClick={handleLogout}>
                        Se déconnecter
                    </button>
                ) : (
                    <>
                        <Link to="/connexion" className="btn btn--ghost">
                            Se connecter
                        </Link>
                        <Link to="/inscription" className="btn btn--primary">
                            S'inscrire
                        </Link>
                    </>
                )}
            </nav>
        </header>
    );
}