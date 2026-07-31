import "./ContactPage.css";
import {
    FaEnvelope,
    FaPhoneAlt,
    FaMapMarkerAlt,
    FaArrowRight,
    FaShieldAlt,
} from "react-icons/fa";

export default function ContactPage() {
    return (
        <main className="contact-page">
            <div className="contact-container">

                <div className="contact-layout">

                    {/* =========================
                        COLONNE GAUCHE
                    ========================= */}
                    <section className="contact-intro">

                        <div className="contact-eyebrow">
                            PARLONS-NOUS
                        </div>

                        <div className="contact-accent" />

                        <h1>
                            Une équipe
                            <br />
                            à votre écoute<span>.</span>
                        </h1>

                        <p className="contact-description">
                            Nous sommes disponibles pour répondre à vos questions
                            et vous accompagner dans vos projets professionnels.
                        </p>

                        <div className="contact-details">

                            <div className="contact-detail">
                                <div className="contact-detail__icon">
                                    <FaEnvelope />
                                </div>

                                <div className="contact-detail__content">
                                    <span>EMAIL</span>
                                    <strong>contact@talentsenegal.sn</strong>
                                </div>
                            </div>

                            <div className="contact-detail">
                                <div className="contact-detail__icon">
                                    <FaPhoneAlt />
                                </div>

                                <div className="contact-detail__content">
                                    <span>TÉLÉPHONE</span>
                                    <strong>+221 77 000 00 00</strong>
                                </div>
                            </div>

                            <div className="contact-detail">
                                <div className="contact-detail__icon">
                                    <FaMapMarkerAlt />
                                </div>

                                <div className="contact-detail__content">
                                    <span>SIÈGE</span>
                                    <strong>Dakar, Sénégal</strong>
                                </div>
                            </div>

                        </div>

                        <div className="contact-brand">
                            <div className="contact-brand__line" />

                            <strong>Talent Sénégal</strong>

                            <p>
                                La plateforme qui rapproche
                                <br />
                                les talents et les opportunités.
                            </p>
                        </div>

                    </section>


                    {/* =========================
                        COLONNE DROITE
                    ========================= */}
                    <section className="contact-form-section">

                        <div className="contact-eyebrow">
                            VOTRE MESSAGE
                        </div>

                        <div className="contact-accent" />

                        <h2>
                            Comment pouvons-nous
                            <br />
                            vous aider<span> ?</span>
                        </h2>

                        <p className="contact-form-intro">
                            Décrivez-nous votre demande. Nous vous répondrons
                            dans les meilleurs délais.
                        </p>

                        <form className="contact-form">

                            <div className="contact-form__row">

                                <div className="contact-field">
                                    <label htmlFor="name">
                                        Nom complet
                                    </label>

                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        placeholder="Votre nom complet"
                                        autoComplete="name"
                                        required
                                    />
                                </div>

                                <div className="contact-field">
                                    <label htmlFor="email">
                                        Adresse email
                                    </label>

                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="vous@exemple.com"
                                        autoComplete="email"
                                        required
                                    />
                                </div>

                            </div>

                            <div className="contact-field">
                                <label htmlFor="subject">
                                    Sujet
                                </label>

                                <input
                                    id="subject"
                                    name="subject"
                                    type="text"
                                    placeholder="Objet de votre demande"
                                    required
                                />
                            </div>

                            <div className="contact-field contact-field--message">
                                <label htmlFor="message">
                                    Votre message
                                </label>

                                <textarea
                                    id="message"
                                    name="message"
                                    rows={5}
                                    placeholder="Écrivez votre message..."
                                    required
                                />
                            </div>

                            <div className="contact-form-footer">

                                <div className="contact-privacy">
                                    <div className="contact-privacy__icon">
                                        <FaShieldAlt />
                                    </div>

                                    <p>
                                        En envoyant ce formulaire, vous acceptez
                                        que Talent Sénégal utilise vos informations
                                        uniquement pour répondre à votre demande.
                                    </p>
                                </div>

                                <button
                                    type="submit"
                                    className="contact-submit"
                                >
                                    <span>ENVOYER LE MESSAGE</span>
                                    <FaArrowRight />
                                </button>

                            </div>

                        </form>

                    </section>

                </div>

            </div>
        </main>
    );
}