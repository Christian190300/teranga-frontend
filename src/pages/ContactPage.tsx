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

                <div className="contact-header">
                    <h1>Contactez-nous</h1>
                    <p>Une question ? N'hésitez pas à nous contacter</p>
                </div>

                <div className="contact-content">

                    {/* Formulaire */}

                    <section className="contact-form-card">

                        <h2>Envoyez-nous un message</h2>

                        <form>

                            <div className="form-group">
                                <label>Nom complet</label>
                                <input type="text" />
                            </div>

                            <div className="form-group">
                                <label>Email</label>
                                <input type="email" />
                            </div>

                            <div className="form-group">
                                <label>Sujet</label>
                                <input type="text" />
                            </div>

                            <div className="form-group">
                                <label>Message</label>
                                <textarea rows={6}></textarea>
                            </div>

                            <button type="submit">
                                Envoyer le message
                            </button>

                        </form>

                    </section>

                    {/* Coordonnées */}

                    <section className="contact-info">

                        <div className="info-card">
                            <div className="info-icon">
                                <FaEnvelope />
                            </div>

                            <div>
                                <h3>Email</h3>
                                <p>contact@talentsenegal.sn</p>
                            </div>
                        </div>

                        <div className="info-card">
                            <div className="info-icon">
                                <FaPhoneAlt />
                            </div>

                            <div>
                                <h3>Téléphone</h3>
                                <p>+221 77 000 00 00</p>
                            </div>
                        </div>

                        <div className="info-card">
                            <div className="info-icon">
                                <FaMapMarkerAlt />
                            </div>

                            <div>
                                <h3>Adresse</h3>
                                <p>Dakar, Sénégal</p>
                            </div>
                        </div>

                    </section>

                </div>

            </div>
        </main>
    );
}