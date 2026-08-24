import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ProfileMenu } from "./ProfileMenu";
import { NotificationsBellCandidat } from "./NotificationsBellCandidat";
import {
    getMonProfilCandidat,
    obtenirPhotoCandidatUrl,
    type ProfilCandidatDTO,
} from "../../api/profileService";
import "./navbar.css";

interface NavLinkItem {
    to: string;
    label: string;
}

interface IconProps {
    className?: string;
}

const candidatLinks: NavLinkItem[] = [
    { to: "/offres", label: "Offres d'emploi" },
    { to: "/candidat/offres-recommandees", label: "Recommandées pour vous" },
    { to: "/candidat/candidatures", label: "Mes candidatures" },
    { to: "/candidat/profil", label: "Mon profil" },
    { to: "/evenements", label: "Événements" },
    { to: "/candidat/formation", label: "Formations" },
];

const recruteurLinks: NavLinkItem[] = [
    { to: "/recruteur/offres", label: "Mes offres" },
    { to: "/recruteur/offres/nouvelle", label: "Publier une offre" },
    { to: "/recruteur/candidatures", label: "Candidatures reçues" },
    { to: "/recruteur/entreprise", label: "Mon entreprise" },
];

const visiteurCandidatLinks: NavLinkItem[] = [
    { to: "/espace-candidat", label: "Je suis candidat" },
    { to: "/offres", label: "Offres d'emploi" },
    { to: "/formations", label: "Formations" },
    { to: "/inscription?role=candidat", label: "Créer un compte candidat" },
];

const visiteurRecruteurLinks: NavLinkItem[] = [
    { to: "/espace-recruteur", label: "Je suis recruteur" },
    { to: "/connexion", label: "Connexion recruteur" },
    { to: "/inscription?role=recruteur", label: "Créer un compte recruteur" },
];

/* ---------- Icônes SVG ---------- */

function IconHome({ className = "navbar__bottom-icon" }: IconProps) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
        </svg>
    );
}

function IconSearch({ className = "navbar__bottom-icon" }: IconProps) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2.8" />
            <path d="M16 16L21 21" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
        </svg>
    );
}

function IconUserCircle({ className = "navbar__bottom-icon" }: IconProps) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
            <circle cx="12" cy="9.5" r="3.5" fill="currentColor" />
            <path d="M12 14c-3.2 0-5.5 1.8-6 4 1.5 2 4 3 6 3s4.5-1 6-3c-.5-2.2-2.8-4-6-4z" fill="currentColor" />
        </svg>
    );
}

function IconRecruiterCircle({ className = "navbar__bottom-icon" }: IconProps) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
            <path d="M12 6a3 3 0 100 6 3 3 0 000-6z" fill="currentColor" />
            <path d="M12 13c-2.5 0-4.5 1.2-5 3 .8 1.5 2.5 2.5 5 2.5s4.2-1 5-2.5c-.5-1.8-2.5-3-5-3z" fill="currentColor" />
        </svg>
    );
}

function IconCalendar({ className = "navbar__icon" }: IconProps) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
            <path d="M3 10h18" stroke="currentColor" strokeWidth="2" />
            <path d="M8 3v4M16 3v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
    );
}

function IconChevron() {
    return (
        <svg className="navbar__visitor-chevron" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function IconUser({ className = "navbar__icon" }: IconProps) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
            <path d="M4 20c0-4 3.5-6 8-6s8 2 8 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
    );
}

function IconBriefcase({ className = "navbar__icon" }: IconProps) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="7" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="2" />
            <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="2" />
            <path d="M3 12h18" stroke="currentColor" strokeWidth="2" />
        </svg>
    );
}

function IconLogin({ className = "navbar__icon" }: IconProps) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M15 8l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M19 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
    );
}

function IconUserPlus({ className = "navbar__icon" }: IconProps) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="9" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
            <path d="M2 20c0-4 3-6 7-6s7 2 7 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M19 8v6M16 11h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
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
    icon: React.ReactNode;
    links: NavLinkItem[];
    id: string;
    activeMenu: string | null;
    setActiveMenu: (id: string | null) => void;
}

function VisitorDropdown({ label, icon, links, id, activeMenu, setActiveMenu }: VisitorDropdownProps) {
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
                {icon}
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

/* ---------- Composant Avatar SVG avec bordure & badge dynamique ---------- */
function CircularScoreAvatar({
                                 photoUrl,
                                 score,
                                 nomComplet,
                             }: {
    photoUrl: string | null;
    score: number;
    nomComplet: string;
}) {
    const size = 130;
    const strokeWidth = 6;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    const getScoreColor = (val: number) => {
        if (val < 50) return "#dc2626";
        if (val < 80) return "#d1790a";
        return "#16a34a";
    };

    const scoreColor = getScoreColor(score);

    return (
        <div className="navbar-profile-avatar">
            <div className="navbar-profile-avatar__wrapper">
                <svg width={size} height={size} className="navbar-profile-avatar__svg">
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="none"
                        stroke="#e2e8f0"
                        strokeWidth={strokeWidth}
                    />
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="none"
                        stroke={scoreColor}
                        strokeWidth={strokeWidth}
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        transform={`rotate(-90 ${size / 2} ${size / 2})`}
                        style={{ transition: "stroke-dashoffset 0.5s ease, stroke 0.3s ease" }}
                    />
                </svg>

                <div className="navbar-profile-avatar__img-container">
                    {photoUrl ? (
                        <img src={photoUrl} alt={nomComplet} className="navbar-profile-avatar__img" />
                    ) : (
                        <div className="navbar-profile-avatar__placeholder">
                            {nomComplet.charAt(0).toUpperCase()}
                        </div>
                    )}
                </div>

                <div
                    className="navbar-profile-avatar__badge"
                    style={{ backgroundColor: scoreColor, color: "#ffffff" }}
                >
                    {score}%
                </div>
            </div>

            <h3 className="navbar-profile-avatar__name" style={{ color: "#d1790a" }}>
                {nomComplet}
            </h3>
        </div>
    );
}

export function Navbar() {
    const { isAuthenticated, currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [menuOuvert, setMenuOuvert] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [activeVisitorMenu, setActiveVisitorMenu] = useState<string | null>(null);
    const [mobileVisitorMenu, setMobileVisitorMenu] = useState<string | null>(null);
    const visitorMenusRef = useRef<HTMLDivElement>(null);

    const [profilCandidat, setProfilCandidat] = useState<ProfilCandidatDTO | null>(null);
    const [photoBlobUrl, setPhotoBlobUrl] = useState<string | null>(null);

    const espaceLinks: NavLinkItem[] =
        currentUser?.role === "RECRUTEUR" ? recruteurLinks : currentUser?.role === "CANDIDAT" ? candidatLinks : [];

    useEffect(() => {
        setMenuOuvert(false);
        setActiveVisitorMenu(null);
        setMobileVisitorMenu(null);
    }, [location.pathname]);

    useEffect(() => {
        document.body.style.overflow = menuOuvert ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [menuOuvert]);

    useEffect(() => {
        // Si l'utilisateur n'est pas connecté ou n'est pas candidat, on réinitialise tout de suite
        if (!isAuthenticated || currentUser?.role !== "CANDIDAT") {
            setProfilCandidat(null);
            setPhotoBlobUrl(null);
            return;
        }

        let isMounted = true;
        let objectUrlCreated: string | null = null;

        async function chargerProfil() {
            try {
                const data = await getMonProfilCandidat();
                if (!isMounted) return;
                setProfilCandidat(data);

                if (data.photoPresente) {
                    const blobUrl = await obtenirPhotoCandidatUrl();
                    if (isMounted && blobUrl) {
                        objectUrlCreated = blobUrl;
                        setPhotoBlobUrl(blobUrl);
                    }
                }
            } catch (e) {
                if (isMounted) {
                    console.error("Erreur lors de la récupération du profil dans la Navbar", e);
                }
            }
        }

        chargerProfil();

        return () => {
            isMounted = false;
            if (objectUrlCreated) {
                URL.revokeObjectURL(objectUrlCreated);
            }
        };
    }, [isAuthenticated, currentUser]);

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
        if (isLoggingOut) return;

        setIsLoggingOut(true);
        setMenuOuvert(false);

        try {
            await logout();
        } catch (error) {
            console.error("Erreur lors de la déconnexion :", error);
        } finally {
            navigate("/", { replace: true });
            setIsLoggingOut(false);
        }
    }

    const scoreCompletion =
        profilCandidat?.score?.percentage ??
        profilCandidat?.scoreCompletion ??
        profilCandidat?.pourcentageCompletion ??
        0;

    const nomAffiché =
        currentUser?.firstName && currentUser?.lastName
            ? `${currentUser.firstName} ${currentUser.lastName}`
            : currentUser?.email ?? "Candidat";

    const photoFinale = photoBlobUrl || currentUser?.photoUrl || null;

    return (
        <>
            <header className="container navbar">
                <Link to="/" className="navbar__brand">
                    Talent<span>Sénégal</span>
                </Link>

                <nav className="navbar__menu navbar__desktop-only">
                    {isAuthenticated &&
                        espaceLinks.map((link) => (
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

                <nav className="navbar__links">
                    {isAuthenticated ? (
                        <div className="navbar__desktop-only" style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            {currentUser?.role === "CANDIDAT" && <NotificationsBellCandidat />}
                            <ProfileMenu />
                        </div>
                    ) : (
                        /* Visible sur desktop ET mobile : les boutons Connexion/Inscription restent
                           accessibles en permanence, hors du menu hamburger. Seuls les menus
                           déroulants Candidat/Recruteur (avec sous-liens) restent réservés au
                           desktop, car ils ont leur propre équivalent dans le tiroir mobile. */
                        <div className="navbar__auth-links">
                            <div className="navbar__visitor-menus navbar__desktop-only" ref={visitorMenusRef}>
                                <VisitorDropdown
                                    id="candidat"
                                    label="Candidat"
                                    icon={<IconUser />}
                                    links={visiteurCandidatLinks}
                                    activeMenu={activeVisitorMenu}
                                    setActiveMenu={setActiveVisitorMenu}
                                />
                                <VisitorDropdown
                                    id="recruteur"
                                    label="Recruteur"
                                    icon={<IconBriefcase />}
                                    links={visiteurRecruteurLinks}
                                    activeMenu={activeVisitorMenu}
                                    setActiveMenu={setActiveVisitorMenu}
                                />
                                <NavLink
                                    to="/evenements"
                                    className={({ isActive }) => `navbar__menu-link ${isActive ? "active" : ""}`}
                                >
                                    <IconCalendar />
                                    Événements
                                </NavLink>
                            </div>

                            <span className="navbar__auth-divider navbar__desktop-only" aria-hidden="true" />

                            <Link to="/connexion" className="btn btn--ghost">
                                <IconLogin />
                                Se connecter
                            </Link>
                            <Link to="/inscription" className="btn btn--primary">
                                <IconUserPlus />
                                S'inscrire
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

                {/* ---------- Menu tiroir mobile ---------- */}
                <div
                    className={`navbar__mobile-overlay${menuOuvert ? " navbar__mobile-overlay--open" : ""}`}
                    onClick={() => setMenuOuvert(false)}
                    aria-hidden="true"
                />

                <div className={`navbar__mobile-panel${menuOuvert ? " navbar__mobile-panel--open" : ""}`}>

                    {isAuthenticated && currentUser?.role === "CANDIDAT" && (
                        <CircularScoreAvatar
                            photoUrl={photoFinale}
                            score={scoreCompletion}
                            nomComplet={nomAffiché}
                        />
                    )}

                    {isAuthenticated && currentUser?.role === "CANDIDAT" && (
                        <div style={{ display: "flex", justifyContent: "center", marginTop: -8, marginBottom: 12 }}>
                            <NotificationsBellCandidat />
                        </div>
                    )}

                    <nav className="navbar__mobile-links">
                        {espaceLinks.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                end={link.to === "/recruteur/offres"}
                                className={({ isActive }) => `navbar__mobile-link ${isActive ? "active" : ""}`}
                                onClick={() => setMenuOuvert(false)}
                            >
                                {link.label}
                            </NavLink>
                        ))}
                    </nav>

                    {!isAuthenticated && (
                        <div className="navbar__mobile-visitor-menus">
                            <div className="navbar__mobile-visitor-group">
                                <button
                                    type="button"
                                    className={`navbar__mobile-visitor-trigger${mobileVisitorMenu === "candidat" ? " navbar__mobile-visitor-trigger--open" : ""}`}
                                    onClick={() => setMobileVisitorMenu((v) => (v === "candidat" ? null : "candidat"))}
                                    aria-expanded={mobileVisitorMenu === "candidat"}
                                >
                                    <span className="navbar__mobile-visitor-label">
                                        <IconUser />
                                        Candidat
                                    </span>
                                    <IconChevron />
                                </button>
                                {mobileVisitorMenu === "candidat" && (
                                    <div className="navbar__mobile-visitor-sublinks">
                                        {visiteurCandidatLinks.map((link) => (
                                            <Link
                                                key={link.label}
                                                to={link.to}
                                                className="navbar__mobile-visitor-sublink"
                                                onClick={() => setMenuOuvert(false)}
                                            >
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
                                    <span className="navbar__mobile-visitor-label">
                                        <IconBriefcase />
                                        Recruteur
                                    </span>
                                    <IconChevron />
                                </button>
                                {mobileVisitorMenu === "recruteur" && (
                                    <div className="navbar__mobile-visitor-sublinks">
                                        {visiteurRecruteurLinks.map((link) => (
                                            <Link
                                                key={link.label}
                                                to={link.to}
                                                className="navbar__mobile-visitor-sublink"
                                                onClick={() => setMenuOuvert(false)}
                                            >
                                                {link.label}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <NavLink
                                to="/evenements"
                                className={({ isActive }) => `navbar__mobile-link ${isActive ? "active" : ""}`}
                                onClick={() => setMenuOuvert(false)}
                            >
                                <IconCalendar className="navbar__icon" />
                                Événements
                            </NavLink>
                        </div>
                    )}

                    <div className="navbar__mobile-actions">
                        {isAuthenticated ? (
                            <>
                                <Link
                                    to={currentUser?.role === "RECRUTEUR" ? "/recruteur/entreprise" : "/candidat/profil"}
                                    className="btn btn--ghost"
                                    onClick={() => setMenuOuvert(false)}
                                >
                                    <IconUser />
                                    Mon profil
                                </Link>
                                <button
                                    type="button"
                                    className="btn btn--ghost"
                                    onClick={() => void handleDeconnexion()}
                                    disabled={isLoggingOut}
                                >
                                    {isLoggingOut ? "Déconnexion..." : "Se déconnecter"}
                                </button>
                            </>
                        ) : null}
                    </div>
                </div>
            </header>

            {/* ---------- Bottom Nav Mobile ---------- */}
            {!isAuthenticated && (
                <nav className="navbar__bottom-nav" aria-label="Navigation principale mobile">
                    <NavLink to="/" end className={({ isActive }) => `navbar__bottom-item ${isActive ? "active" : ""}`}>
                        <IconHome />
                        <span>Accueil</span>
                    </NavLink>

                    <NavLink to="/offres" className={({ isActive }) => `navbar__bottom-item ${isActive ? "active" : ""}`}>
                        <IconSearch />
                        <span>Recherche</span>
                    </NavLink>

                    <NavLink to="/espace-candidat" className={({ isActive }) => `navbar__bottom-item ${isActive ? "active" : ""}`}>
                        <IconUserCircle />
                        <span>Candidat</span>
                    </NavLink>

                    <NavLink to="/espace-recruteur" className={({ isActive }) => `navbar__bottom-item ${isActive ? "active" : ""}`}>
                        <IconRecruiterCircle />
                        <span>Recruteur</span>
                    </NavLink>
                </nav>
            )}
        </>
    );
}