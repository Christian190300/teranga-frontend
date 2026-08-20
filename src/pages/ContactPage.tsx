import "./ContactPage.css";
import {
    FaEnvelope,
    FaPhoneAlt,
    FaMapMarkerAlt,
} from "react-icons/fa";

export default function ContactPage() {
    return (
        <main className="contact-page">
            <div className="contact-container">

                {/* En-tête */}
                <header className="contact-header">
                    <span className="contact-eyebrow">
                        CONTACT
                    </span>

                    <h1>Contactez Talent Sénégal</h1>

                    <p>
                        Une question, une demande d'information ou un projet de
                        recrutement ? Notre équipe est à votre disposition pour
                        vous accompagner.
                    </p>
                </header>

                {/* Contenu */}
                <section className="contact-content">

                    {/* Informations */}
                    <aside className="contact-details">

                        <div className="contact-details__intro">
                            <h2>Nous sommes à votre écoute</h2>

                            <p>
                                Que vous soyez candidat, recruteur ou partenaire,
                                nous sommes disponibles pour répondre à vos
                                questions et vous accompagner.
                            </p>
                        </div>

                        <div className="contact-details__items">

                            <div className="contact-detail">
                                <div className="contact-detail__icon">
                                    <FaEnvelope />
                                </div>

                                <div className="contact-detail__content">
                                    <span>Email</span>
                                    <a href="mailto:contact@talentsenegal.com">
                                        contact@talentsenegal.com
                                    </a>
                                </div>
                            </div>

                            <div className="contact-detail">
                                <div className="contact-detail__icon">
                                    <FaPhoneAlt />
                                </div>

                                <div className="contact-detail__content">
                                    <span>Téléphone</span>
                                    <a href="tel:+221770000000">
                                        +221 77 707 24 24
                                    </a>
                                </div>
                            </div>

                            <div className="contact-detail">
                                <div className="contact-detail__icon">
                                    <FaMapMarkerAlt />
                                </div>

                                <div className="contact-detail__content">
                                    <span>Localisation</span>
                                    <p>Nord Foire Dakar, Sénégal</p>
                                </div>
                            </div>

                        </div>

                        <div className="contact-details__bottom">
                            <span></span>

                            <p>
                                Talent Sénégal
                                <br />
                                <small>
                                    La plateforme qui rapproche les talents
                                    et les opportunités.
                                </small>
                            </p>
                        </div>

                    </aside>

                    {/* Formulaire */}
                    <section className="contact-form-section">

                        <div className="contact-form-header">
                            <span>NOUS ÉCRIRE</span>

                            <h2>Envoyez-nous un message</h2>

                            <p>
                                Remplissez le formulaire ci-dessous. Nous vous
                                répondrons dans les meilleurs délais.
                            </p>
                        </div>

                        <form className="contact-form">

                            <div className="contact-form-row">

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
                                    rows={6}
                                    placeholder="Écrivez votre message..."
                                    required
                                />
                            </div>

                            <div className="contact-form-footer">
                                <p>
                                    Vos informations sont utilisées uniquement
                                    pour répondre à votre demande.
                                </p>

                                <button type="submit">
                                    Envoyer le message
                                </button>
                            </div>

                        </form>

                    </section>

                </section>

            </div>
        </main>
    );
}