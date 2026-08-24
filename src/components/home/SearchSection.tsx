import { useState } from "react";
import { useNavigate } from "react-router-dom";

const RECHERCHES_POPULAIRES = ["Comptabilité", "Marketing", "Informatique", "Commercial", "Chauffeur", "Design"];

export function SearchSection() {
    const navigate = useNavigate();
    const [poste, setPoste] = useState("");
    const [localisation, setLocalisation] = useState("");

    function lancerRecherche(e: React.FormEvent) {
        e.preventDefault();
        // Le backend cherche actuellement sur un seul terme (titre OU ville).
        // Si les deux champs sont remplis, on privilégie le poste.
        const terme = poste.trim() || localisation.trim();
        navigate(terme ? `/offres?recherche=${encodeURIComponent(terme)}` : "/offres");
    }

    function rechercherTerme(terme: string) {
        navigate(`/offres?recherche=${encodeURIComponent(terme)}`);
    }

    return (
        <section className="home-section home-container">
            <h2 className="home-section__title home-section__title--center">
                Recherchez votre prochaine opportunité
            </h2>

            <form className="offres-filterbar" onSubmit={lancerRecherche} style={{ marginTop: 24 }}>
                <div className="offres-filterbar__pill">
                    <svg className="offres-filterbar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle cx="11" cy="11" r="7" strokeWidth="2" />
                        <path d="M20 20L16.65 16.65" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Métier, poste, compétence..."
                        value={poste}
                        onChange={(e) => setPoste(e.target.value)}
                        className="offres-filterbar__pill-input"
                    />
                </div>

                <div className="offres-filterbar__pill">
                    <svg className="offres-filterbar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path
                            d="M12 21s-7-6.1-7-11.3C5 5.9 8.1 3 12 3s7 2.9 7 6.7C19 14.9 12 21 12 21z"
                            strokeWidth="2"
                            strokeLinejoin="round"
                        />
                        <circle cx="12" cy="9.5" r="2.3" strokeWidth="2" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Localisation"
                        value={localisation}
                        onChange={(e) => setLocalisation(e.target.value)}
                        className="offres-filterbar__pill-input"
                    />
                </div>

                <button type="submit" className="home-btn home-btn--gold" style={{ whiteSpace: "nowrap" }}>
                    Rechercher
                </button>
            </form>

            <div style={{ marginTop: 20, display: "flex", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
                <span style={{ color: "#8A8780", fontSize: 14 }}>Recherches populaires :</span>
                {RECHERCHES_POPULAIRES.map((terme) => (
                    <button
                        key={terme}
                        type="button"
                        onClick={() => rechercherTerme(terme)}
                        className="job-pass__skill"
                        style={{ cursor: "pointer", border: "1px solid #e2e2df", background: "white" }}
                    >
                        {terme}
                    </button>
                ))}
            </div>
        </section>
    );
}