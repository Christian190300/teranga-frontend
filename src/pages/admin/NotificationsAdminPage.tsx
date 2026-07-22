import { useCallback, useEffect, useState } from "react";
import {
    listerNotifications,
    marquerNotificationLue,
    marquerToutesNotificationsLues,
    type NotificationAdminDTO,
} from "../../api/notificationAdminService";
import { LABELS_TYPE_NOTIFICATION, couleurNotification } from "./notificationConfig";
import "./NotificationsAdminPage.css";

const PAGE_SIZE = 20;

function formatDate(iso: string): string {
    return new Date(iso).toLocaleString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export function NotificationsAdminPage() {
    const [notifications, setNotifications] = useState<NotificationAdminDTO[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(0);
    const [chargement, setChargement] = useState(true);
    const [erreur, setErreur] = useState<string | null>(null);

    const charger = useCallback(async () => {
        setChargement(true);
        setErreur(null);
        try {
            const resultat = await listerNotifications(page, PAGE_SIZE);
            setNotifications(resultat.notifications);
            setTotal(resultat.total);
        } catch {
            setErreur("Impossible de charger les notifications.");
        } finally {
            setChargement(false);
        }
    }, [page]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch au montage, pattern standard
        charger();
    }, [charger]);

    async function handleMarquerLue(id: number) {
        setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, lu: true } : n)));
        try {
            await marquerNotificationLue(id);
        } catch {
            setErreur("Impossible de marquer cette notification comme lue.");
        }
    }

    async function handleMarquerToutesLues() {
        setNotifications((prev) => prev.map((n) => ({ ...n, lu: true })));
        try {
            await marquerToutesNotificationsLues();
        } catch {
            setErreur("Impossible de marquer les notifications comme lues.");
        }
    }

    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    const nonLues = notifications.filter((n) => !n.lu).length;

    return (
        <div className="admin-page">
            <div className="admin-page__container">
                <div className="admin-page__head">
                    <div>
                        <h1 className="admin-page__title">Notifications</h1>
                        <p className="admin-page__subtitle">Historique des actions effectuées sur la plateforme.</p>
                    </div>
                    {nonLues > 0 && (
                        <button className="admin-btn admin-btn--ghost" onClick={handleMarquerToutesLues}>
                            Tout marquer comme lu
                        </button>
                    )}
                </div>

                {erreur && <div className="admin-alert">{erreur}</div>}

                <div className="notif-list">
                    {chargement ? (
                        <div className="notif-list__empty">Chargement...</div>
                    ) : notifications.length === 0 ? (
                        <div className="notif-list__empty">Aucune notification pour le moment.</div>
                    ) : (
                        notifications.map((n) => (
                            <div key={n.id} className={`notif-row${n.lu ? "" : " notif-row--non-lue"}`}>
                                <span className="notif-row__dot" style={{ background: couleurNotification(n.type) }} />
                                <div className="notif-row__body">
                                    <div className="notif-row__head">
                                        <span className="notif-row__type">{LABELS_TYPE_NOTIFICATION[n.type]}</span>
                                        <span className="notif-row__date">{formatDate(n.dateCreation)}</span>
                                    </div>
                                    <p className="notif-row__message">{n.message}</p>
                                </div>
                                {!n.lu && (
                                    <button className="admin-btn admin-btn--ghost notif-row__action" onClick={() => handleMarquerLue(n.id)}>
                                        Marquer comme lu
                                    </button>
                                )}
                            </div>
                        ))
                    )}
                </div>

                <div className="admin-pagination">
                    <button className="admin-btn admin-btn--ghost" disabled={page === 0} onClick={() => setPage((p) => Math.max(0, p - 1))}>
                        Précédent
                    </button>
                    <span className="admin-pagination__label">
                        Page {page + 1} / {totalPages}
                    </span>
                    <button className="admin-btn admin-btn--ghost" disabled={page + 1 >= totalPages} onClick={() => setPage((p) => p + 1)}>
                        Suivant
                    </button>
                </div>
            </div>
        </div>
    );
}