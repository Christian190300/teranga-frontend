import "./ContactPage.css";
import {
    FaEnvelope,
    FaPhoneAlt,
    FaMapMarkerAlt,
    FaArrowRight,
} from "react-icons/fa";

export default function ContactPage() {
    return (
        <main className="contact-page">

            {/* =====================================================
                HERO
            ===================================================== */}

            <section className="contact-hero">
                <div className="contact-container">

                    <div className="contact-hero__content">

                        <span className="contact-hero__eyebrow">
                            NOUS CONTACTER
                        </span>

                        <h1>
                            Construisons ensemble
                            <br />
                            <span>les opportunités de demain.</span>
                        </h1>

                        <p>
                            Une question sur Talent Sénégal, un projet de recrutement
                            ou une demande de partenariat ? Notre équipe est à votre
                            disposition pour vous accompagner.
                        </p>

                    </div>

                </div>
            </section>


            {/* =====================================================
                CONTACT AREA
            ===================================================== */}

            <section className="contact-main">

                <div className="contact-container">

                    <div className="contact-layout">

                        {/* =================================================
                            INFORMATIONS
                        ================================================= */}

                        <aside className="contact-details">

                            <div className="contact-details__heading">
                                <span>PARLONS-NOUS</span>

                                <h2>
                                    Une équipe
                                    <br />
                                    à votre écoute.
                                </h2>
                            </div>

                            <p className="contact-details__intro">
                                Nous sommes disponibles pour répondre à vos
                                questions et vous accompagner dans vos projets
                                professionnels.
                            </p>


                            <div className="contact-details__items">

                                <div className="contact-detail">
                                    <div className="contact-detail__icon">
                                        <FaEnvelope />
                                    </div>

                                    <div>
                                        <span>Email</span>
                                        <a href="mailto:contact@talentsenegal.sn">
                                            contact@talentsenegal.sn
                                        </a>
                                    </div>
                                </div>


                                <div className="contact-detail">
                                    <div className="contact-detail__icon">
                                        <FaPhoneAlt />
                                    </div>

                                    <div>
                                        <span>Téléphone</span>
                                        <a href="tel:+221770000000">
                                            +221 77 000 00 00
                                        </a>
                                    </div>
                                </div>


                                <div className="contact-detail">
                                    <div className="contact-detail__icon">
                                        <FaMapMarkerAlt />
                                    </div>

                                    <div>
                                        <span>Siège</span>
                                        <p>Dakar, Sénégal</p>
                                    </div>
                                </div>

                            </div>


                            <div className="contact-details__footer">
                                <div className="contact-line" />

                                <p>
                                    Talent Sénégal
                                    <br />
                                    La plateforme qui rapproche
                                    les talents et les opportunités.
                                </p>
                            </div>

                        </aside>


                        {/* =================================================
                            FORMULAIRE
                        ================================================= */}

                        <section className="contact-form-section">

                            <div className="contact-form-heading">

                                <span>VOTRE MESSAGE</span>

                                <h2>
                                    Comment pouvons-nous
                                    <br />
                                    vous aider ?
                                </h2>

                                <p>
                                    Décrivez-nous votre demande. Nous vous
                                    répondrons dans les meilleurs délais.
                                </p>

                            </div>


                            <form className="contact-form">

                                <div className="contact-form__row">

                                    <div className="contact-field">

                                        <label htmlFor="name">
                                            Nom complet
                                        </label>

                                        <input
                                            id="name"
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
                                        type="text"
                                        placeholder="Objet de votre demande"
                                        required
                                    />

                                </div>


                                <div className="contact-field">

                                    <label htmlFor="message">
                                        Votre message
                                    </label>

                                    <textarea
                                        id="message"
                                        rows={7}
                                        placeholder="Écrivez votre message..."
                                        required
                                    />

                                </div>


                                <div className="contact-form__bottom">

                                    <p>
                                        En envoyant ce formulaire, vous acceptez
                                        que Talent Sénégal utilise ces informations
                                        uniquement pour répondre à votre demande.
                                    </p>

                                    <button
                                        type="submit"
                                        className="contact-submit"
                                    >
                                        <span>Envoyer le message</span>
                                        <FaArrowRight />
                                    </button>

                                </div>

                            </form>

                        </section>

                    </div>

                </div>

            </section>

        </main>
    );
}