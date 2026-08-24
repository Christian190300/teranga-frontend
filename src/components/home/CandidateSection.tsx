import { Link } from "react-router-dom";

export function CandidateSection() {
    return (
        <section className="home-section home-container">
            <div
                style={{
                    background: "#14294d",
                    color: "white",
                    borderRadius: 16,
                    padding: "40px 32px",
                    textAlign: "center",
                }}
            >
                <h2 style={{ fontSize: 24, marginBottom: 12 }}>Vous cherchez un emploi ?</h2>
                <p style={{ color: "#c7d0e0", maxWidth: 480, margin: "0 auto 24px" }}>
                    Créez votre profil Talent Sénégal et augmentez vos chances d'être repéré par les recruteurs.
                </p>
                <Link to="/inscription?role=candidat" className="home-btn home-btn--gold">
                    Créer mon profil
                </Link>
            </div>
        </section>
    );
}