import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { IconChevronDown, IconLogOut, IconUserCircle } from "../home/icons";
import "./profileMenu.css";

export function ProfileMenu() {
    const { currentUser, logout } = useAuth();
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    async function handleLogout() {
        await logout();
        navigate("/");
    }

    const initials = currentUser ? `${currentUser.firstName[0] ?? ""}${currentUser.lastName[0] ?? ""}`.toUpperCase() : "";

    const profilePath =
        currentUser?.role === "ADMIN"
            ? "/admin/profil"
            : currentUser?.role === "RECRUTEUR"
                ? "/recruteur/entreprise"
                : "/candidat/profil";

    return (
        <div className="profile-menu" ref={ref}>
            <button className="profile-menu__trigger" onClick={() => setOpen((v) => !v)}>
                {currentUser?.photoUrl ? (
                    <img src={currentUser.photoUrl} alt="" className="profile-menu__avatar profile-menu__avatar--img" />
                ) : (
                    <span className="profile-menu__avatar">{initials}</span>
                )}
                <span className="profile-menu__name">{currentUser?.firstName}</span>
                <IconChevronDown />
            </button>

            {open && (
                <div className="profile-menu__dropdown">
                    <div className="profile-menu__dropdown-header">
                        <span className="profile-menu__dropdown-name">
                            {currentUser?.firstName} {currentUser?.lastName}
                        </span>
                        <span className="profile-menu__dropdown-email">{currentUser?.email}</span>
                    </div>
                    <Link to={profilePath} className="profile-menu__item" onClick={() => setOpen(false)}>
                        <IconUserCircle /> Mon profil
                    </Link>
                    <button className="profile-menu__item profile-menu__item--danger" onClick={handleLogout}>
                        <IconLogOut /> Se déconnecter
                    </button>
                </div>
            )}
        </div>
    );
}