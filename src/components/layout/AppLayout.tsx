import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./profilWidget.css";

export function ProfilWidget() {
    const { currentUser, isAuthenticated } = useAuth();

    const [isOpen, setIsOpen] = useState(false);
    const widgetRef = useRef<HTMLDivElement>(null);

    // Le hook doit toujours être appelé, quelle que soit la situation
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                widgetRef.current &&
                !widgetRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Maintenant seulement, on peut faire le return conditionnel
    if (
        !isAuthenticated ||
        !currentUser ||
        currentUser.role !== "CANDIDAT"
    ) {
        return null;
    }

    return (
        <div className="profil-widget-container" ref={widgetRef}>
            <div
                className={`profil-widget-banner ${
                    isOpen ? "is-open" : ""
                }`}
            >
                <button
                    type="button"
                    className="profil-widget-close"
                    onClick={() => setIsOpen(false)}
                    aria-label="Fermer"
                >
                    &times;
                </button>

                <div className="profil-widget-content">
                    <p>
                        🚀 <strong>Optimisez votre profil !</strong>
                    </p>

                    <p>
                        Bonjour {currentUser.firstName} ! Un profil complet
                        attire <strong>3x plus d'opportunités</strong> !{" "}

                        <Link
                            to="/candidat/profil"
                            className="profil-widget-link"
                            onClick={() => setIsOpen(false)}
                        >
                            Cliquez ici
                        </Link>{" "}
                        pour le compléter.
                    </p>
                </div>
            </div>

            <button
                type="button"
                className="profil-widget-btn"
                onClick={() => setIsOpen((value) => !value)}
                aria-label="Compléter mon profil"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>

                <span className="profil-widget-badge">1</span>
            </button>
        </div>
    );
}