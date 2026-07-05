import { IconGlobe, IconShieldCheck, IconUsers, IconZap } from "./icons";

const reasons = [
    { icon: <IconShieldCheck />, variant: "navy" as const, title: "Qualité garantie", description: "Profils vérifiés uniquement." },
    { icon: <IconZap />, variant: "gold" as const, title: "Matching rapide", description: "Connexion en quelques clics." },
    { icon: <IconGlobe />, variant: "navy" as const, title: "Réseau étendu", description: "Les meilleures entreprises du pays." },
    { icon: <IconUsers />, variant: "gold" as const, title: "Accompagnement", description: "Support dédié pour vos recrutements." },
];

export function WhyChooseUs() {
    return (
        <section className="home-section home-section--cream">
            <div className="home-container" style={{ padding: "48px 32px" }}>
                <h2 className="home-section__title home-section__title--center">Pourquoi Talent Sénégal</h2>
                <p className="home-section__subtitle home-section__subtitle--center">
                    Un recrutement plus transparent et plus rapide, pour tous les acteurs.
                </p>

                <div className="home-why-grid" style={{ marginTop: "var(--sp-4)" }}>
                    {reasons.map((reason) => (
                        <div className="home-why-card" key={reason.title}>
                            <div className={`home-why-card__icon home-why-card__icon--${reason.variant}`}>{reason.icon}</div>
                            <h3>{reason.title}</h3>
                            <p>{reason.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}