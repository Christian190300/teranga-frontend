// pages/candidat/NotificationsPage.tsx
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    getMesNotifications,
    marquerNotificationLue,
    marquerToutesNotificationsLues,
    type NotificationCandidatDTO,
} from "../../api/Notificationservice";
import "./notificationsPage.css";

const TAILLE_PAGE = 15;

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

function libellePourType(type: NotificationCandidatDTO["type"]): string {
    switch (type) {
        case "NOUVELLE_OFFRE":
            return "Offre";
        case "FORMATION_RECOMMANDEE":
            return "Formation";
        default:
            return "Annonce";
    }
}

type Filtre = "TOUTES" | "NON_LUES";

export function NotificationsPage() {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState<NotificationCandidatDTO[]>([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [chargement, setChargement] = useState(true);
    const [filtre, setFiltre] = useState<Filtre>("TOUTES");

    const charger = useCallback(async (pageDemandee: number) => {
        setChargement(true);
        try {
            const { content, totalPages: total } = await getMesNotifications(pageDemandee, TAILLE_PAGE);
            setNotifications(content);
            setTotalPages(total ?? 1);
        } catch {
            setNotifications([]);
        } finally {
            setChargement(false);
        }
    }, []);

    useEffect(() => {
        charger(page);
    }, [page, charger]);

    async function handleClicNotification(notif: NotificationCandidatDTO) {
        if (!notif.lu) {
            setNotifications((prev) => prev.map((n) => (n.id === notif.id ? { ...n, lu: true } : n)));
            marquerNotificationLue(notif.id).catch(() => charger(page));
        }
        if (notif.lien) navigate(notif.lien);
    }

    async function handleMarquerToutesLues() {
        setNotifications((prev) => prev.map((n) => ({ ...n, lu: true })));
        try {
            await marquerToutesNotificationsLues();
        } catch {
            charger(page);
        }
    }

    const notificationsAffichees =
        filtre === "NON_LUES" ? notifications.filter((n) => !n.lu) : notifications;

    return (
        <div className="notif-page">
            <div className="notif-page__header">
                <h1 className="notif-page__title">Mes notifications</h1>
                <div className="notif-page__actions">
                    <div className="notif-page__filtres">
                        <button
                            className={`notif-page__filtre${filtre === "TOUTES" ? " notif-page__filtre--actif" : ""}`}
                            onClick={() => setFiltre("TOUTES")}
                        >
                            Toutes
                        </button>
                        <button
                            className={`notif-page__filtre${filtre === "NON_LUES" ? " notif-page__filtre--actif" : ""}`}
                            onClick={() => setFiltre("NON_LUES")}
                        >
                            Non lues
                        </button>
                    </div>
                    <button className="notif-page__mark-all" onClick={handleMarquerToutesLues}>
                        Tout marquer comme lu
                    </button>
                </div>
            </div>

            <div className="notif-page__list">
                {chargement ? (
                    <div className="notif-page__empty">Chargement...</div>
                ) : notificationsAffichees.length === 0 ? (
                    <div className="notif-page__empty">Aucune notification pour le moment.</div>
                ) : (
                    notificationsAffichees.map((n) => (
                        <button
                            key={n.id}
                            className={`notif-page-item${n.lu ? "" : " notif-page-item--non-lue"}`}
                            onClick={() => handleClicNotification(n)}
                        >
                            <span className="notif-page-item__dot" aria-hidden="true" />
                            <span className="notif-page-item__body">
                                <span className="notif-page-item__type">{libellePourType(n.type)}</span>
                                <span className="notif-page-item__message">{n.titre}</span>
                                <span className="notif-page-item__date">{formatRelatif(n.dateCreation)}</span>
                            </span>
                        </button>
                    ))
                )}
            </div>

            {totalPages > 1 && (
                <div className="notif-page__pagination">
                    <button disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
                        Précédent
                    </button>
                    <span>
                        Page {page + 1} / {totalPages}
                    </span>
                    <button disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)}>
                        Suivant
                    </button>
                </div>
            )}
        </div>
    );
}