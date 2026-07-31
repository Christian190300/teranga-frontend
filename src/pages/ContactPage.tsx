import "./ContactPage.css";
import {
    FaEnvelope,
    FaPhoneAlt,
    FaMapMarkerAlt,
    FaPaperPlane,
} from "react-icons/fa";

export default function ContactPage() {
    return (
        <main className="contact-page">
            <div className="contact-container">

                {/* Header */}
                <header className="contact-header">
                    <span className="contact-eyebrow">CONTACT</span>

                    <h1>
                        Parlons de votre
                        <span> projet</span>
                    </h1>

                    <p>
                        Une question, une suggestion ou un besoin particulier ?
                        Notre équipe est à votre écoute.
                    </p>
                </header>

                <div className="contact-content">

                    {/* Formulaire */}
                    <section className="contact-form-card">

                        <div className="contact-form-header">
                            <div>
                                <span className="form-label">NOUS ÉCRIRE</span>
                                <h2>Envoyez-nous un message</h2>
                                <p>
                                    Remplissez le formulaire et notre équipe
                                    vous répondra dans les meilleurs délais.
                                </p>
                            </div>
                        </div>

                        <form className="contact-form">

                            <div className="form-row">

                                <div className="form-group">
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

                                <div className="form-group">
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

                            <div className="form-group">
                                <label htmlFor="subject">
                                    Sujet
                                </label>

                                <input
                                    id="subject"
                                    type="text"
                                    placeholder="Comment pouvons-nous vous aider ?"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="message">
                                    Message
                                </label>

                                <textarea
                                    id="message"
                                    rows={6}
                                    placeholder="Décrivez votre demande..."
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="contact-submit"
                            >
                                <span>Envoyer le message</span>
                                <FaPaperPlane />
                            </button>

                        </form>

                    </section>

                    {/* Informations */}
                    <aside className="contact-info">

                        <div className="contact-info-intro">
                            <span className="form-label">NOS COORDONNÉES</span>

                            <h2>
                                Nous sommes
                                <br />
                                <span>à votre écoute.</span>
                            </h2>

                            <p>
                                Que vous soyez candidat, recruteur ou partenaire,
                                notre équipe est disponible pour vous accompagner.
                            </p>
                        </div>

                        <div className="info-card">
                            <div className="info-icon">
                                <FaEnvelope />
                            </div>

                            <div className="info-content">
                                <span>Email</span>
                                <h3>contact@talentsenegal.sn</h3>
                            </div>
                        </div>

                        <div className="info-card">
                            <div className="info-icon">
                                <FaPhoneAlt />
                            </div>

                            <div className="info-content">
                                <span>Téléphone</span>
                                <h3>+221 77 000 00 00</h3>
                            </div>
                        </div>

                        <div className="info-card">
                            <div className="info-icon">
                                <FaMapMarkerAlt />
                            </div>

                            <div className="info-content">
                                <span>Localisation</span>
                                <h3>Dakar, Sénégal</h3>
                            </div>
                        </div>

                    </aside>

                </div>

            </div>
        </main>
    );
}