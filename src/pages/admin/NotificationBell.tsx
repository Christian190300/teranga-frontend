import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
    compterNotificationsNonLues,
    listerNotifications,
    marquerNotificationLue,
    marquerToutesNotificationsLues,
    type NotificationAdminDTO,
} from "../../api/notificationAdminService";
import { LABELS_TYPE_NOTIFICATION, couleurNotification } from "./notificationConfig";
import "./NotificationBell.css";

const INTERVALLE_POLLING_MS = 20000;
const TAILLE_APERCU = 8;

function formatRelatif(iso: string): string {
    const diffMs = Date.now() - new Date(iso).getTime();
    const minutes = Math.floor(diffMs / 60000);
    if (minutes < 1) return "à l'instant";
    if (minutes < 60) return `il y a ${minutes} min`;
    const heures = Math.floor(minutes / 60);
    if (heures < 24) return `il y a ${heures} h`;
    const jours = Math.floor(heures / 24);
    return `il y a ${jours} j`;
}

export function NotificationBell() {
    const [ouvert, setOuvert] = useState(false);
    const [compteur, setCompteur] = useState(0);
    const [notifications, setNotifications] = useState<NotificationAdminDTO[]>([]);
    const [chargement, setChargement] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const rafraichirCompteur = useCallback(async () => {
        try {
            const total = await compterNotificationsNonLues();
            setCompteur(total);
        } catch {
            // Silencieux : ne pas gêner l'UI pour un échec de polling.
        }
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- polling au montage, pattern standard
        rafraichirCompteur();
        const interval = setInterval(rafraichirCompteur, INTERVALLE_POLLING_MS);
        return () => clearInterval(interval);
    }, [rafraichirCompteur]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setOuvert(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    async function ouvrirDropdown() {
        const prochainEtat = !ouvert;
        setOuvert(prochainEtat);
        if (!prochainEtat) return;

        setChargement(true);
        try {
            const resultat = await listerNotifications(0, TAILLE_APERCU);
            setNotifications(resultat.notifications);
        } catch {
            setNotifications([]);
        } finally {
            setChargement(false);
        }
    }

    async function handleMarquerLue(id: number) {
        setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, lu: true } : n)));
        setCompteur((c) => Math.max(0, c - 1));
        try {
            await marquerNotificationLue(id);
        } catch {
            rafraichirCompteur();
        }
    }

    async function handleMarquerToutesLues() {
        setNotifications((prev) => prev.map((n) => ({ ...n, lu: true })));
        setCompteur(0);
        try {
            await marquerToutesNotificationsLues();
        } catch {
            rafraichirCompteur();
        }
    }

    return (
        <div className="notif-bell" ref={ref}>
            <button className="notif-bell__trigger" onClick={ouvrirDropdown} aria-label="Notifications">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M18 16v-5a6 6 0 0 0-5-5.92V4a1 1 0 1 0-2 0v1.08A6 6 0 0 0 6 11v5l-1.7 1.7a1 1 0 0 0 .7 1.7h14a1 1 0 0 0 .7-1.7L18 16Z"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinejoin="round"
                    />
                    <path d="M9.5 20a2.5 2.5 0 0 0 5 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
                {compteur > 0 && <span className="notif-bell__badge">{compteur > 99 ? "99+" : compteur}</span>}
            </button>

            {ouvert && (
                <div className="notif-bell__dropdown">
                    <div className="notif-bell__head">
                        <span className="notif-bell__title">Notifications</span>
                        {compteur > 0 && (
                            <button className="notif-bell__mark-all" onClick={handleMarquerToutesLues}>
                                Tout marquer comme lu
                            </button>
                        )}
                    </div>

                    <div className="notif-bell__list">
                        {chargement ? (
                            <div className="notif-bell__empty">Chargement...</div>
                        ) : notifications.length === 0 ? (
                            <div className="notif-bell__empty">Aucune notification pour le moment.</div>
                        ) : (
                            notifications.map((n) => (
                                <button
                                    key={n.id}
                                    className={`notif-item${n.lu ? "" : " notif-item--non-lue"}`}
                                    onClick={() => !n.lu && handleMarquerLue(n.id)}
                                >
                                    <span className="notif-item__dot" style={{ background: couleurNotification(n.type) }} />
                                    <span className="notif-item__body">
                                        <span className="notif-item__type">{LABELS_TYPE_NOTIFICATION[n.type]}</span>
                                        <span className="notif-item__message">{n.message}</span>
                                        <span className="notif-item__date">{formatRelatif(n.dateCreation)}</span>
                                    </span>
                                </button>
                            ))
                        )}
                    </div>

                    <Link to="/admin/notifications" className="notif-bell__footer" onClick={() => setOuvert(false)}>
                        Voir toutes les notifications
                    </Link>
                </div>
            )}
        </div>
    );
}