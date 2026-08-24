import { Link } from "react-router-dom";

export function RecruiterSection() {
    return (
        <section className="home-section home-container">
            <div
                style={{
                    background: "#faf6ec",
                    border: "1px solid #f0e2b8",
                    borderRadius: 16,
                    padding: "40px 32px",
                    textAlign: "center",
                }}
            >
                <h2 style={{ fontSize: 24, marginBottom: 12, color: "#14294d" }}>Vous recrutez ?</h2>
                <p style={{ color: "#5a5a55", maxWidth: 480, margin: "0 auto 24px" }}>
                    Publiez votre offre et recevez des candidatures directement sur Talent Sénégal.
                </p>
                <Link to="/inscription?role=recruteur" className="home-btn home-btn--outline">
                    Publier une offre
                </Link>
            </div>
        </section>
    );
}