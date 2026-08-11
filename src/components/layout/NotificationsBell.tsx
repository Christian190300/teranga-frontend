import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { IconBell } from "../home/icons";
import {
    compterNotificationsNonLues,
    listerNotifications,
    marquerNotificationLue,
    marquerToutesNotificationsLues,
    type NotificationAdminDTO,
} from "../../api/notificationAdminService";
import { LABELS_TYPE_NOTIFICATION, couleurNotification } from "../../pages/admin/notificationConfig";
import "./notificationsBell.css";

const INTERVALLE_POLLING_MS = 20000;
const TAILLE_APERCU = 8;
const SEUIL_MOBILE = 640;

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

interface PositionDropdown {
    top: number;
    right: number;
}

export function NotificationsBell() {
    const [ouvert, setOuvert] = useState(false);
    const [count, setCount] = useState(0);
    const [notifications, setNotifications] = useState<NotificationAdminDTO[]>([]);
    const [chargement, setChargement] = useState(false);
    const [position, setPosition] = useState<PositionDropdown | null>(null);

    const wrapRef = useRef<HTMLDivElement>(null);
    const boutonRef = useRef<HTMLButtonElement>(null);

    const rafraichirCompteur = useCallback(async () => {
        try {
            const total = await compterNotificationsNonLues();
            setCount(total);
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
            const target = event.target as Node;
            const dansLeBouton = wrapRef.current?.contains(target);
            const dansLeDropdown = (target as HTMLElement)?.closest?.(".notif-bell__dropdown");
            if (!dansLeBouton && !dansLeDropdown) {
                setOuvert(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Recalcule la position au resize/scroll pendant que le dropdown est ouvert
    useEffect(() => {
        if (!ouvert) return;

        function calculerPosition() {
            const rect = boutonRef.current?.getBoundingClientRect();
            if (!rect) return;
            setPosition({
                top: rect.bottom + 10,
                right: window.innerWidth - rect.right,
            });
        }

        calculerPosition();
        window.addEventListener("resize", calculerPosition);
        window.addEventListener("scroll", calculerPosition, true);
        return () => {
            window.removeEventListener("resize", calculerPosition);
            window.removeEventListener("scroll", calculerPosition, true);
        };
    }, [ouvert]);

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
        setCount((c) => Math.max(0, c - 1));
        try {
            await marquerNotificationLue(id);
        } catch {
            rafraichirCompteur();
        }
    }

    async function handleMarquerToutesLues() {
        setNotifications((prev) => prev.map((n) => ({ ...n, lu: true })));
        setCount(0);
        try {
            await marquerToutesNotificationsLues();
        } catch {
            rafraichirCompteur();
        }
    }

    const estMobile = typeof window !== "undefined" && window.innerWidth <= SEUIL_MOBILE;

    const dropdown = ouvert && (
        <div
            className="notif-bell__dropdown"
            style={
                !estMobile && position
                    ? { top: `${position.top}px`, right: `${position.right}px` }
                    : undefined
            }
        >
            <div className="notif-bell__head">
                <span className="notif-bell__title">Notifications</span>
                {count > 0 && (
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
    );

    return (
        <div className="notif-bell-wrap" ref={wrapRef}>
            <button className="notif-bell" aria-label="Notifications" onClick={ouvrirDropdown} ref={boutonRef}>
                <IconBell />
                {count > 0 && <span className="notif-bell__badge">{count > 99 ? "99+" : count}</span>}
            </button>

            {typeof document !== "undefined" && dropdown && createPortal(dropdown, document.body)}
        </div>
    );
}