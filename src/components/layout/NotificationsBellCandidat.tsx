import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import {
    getCompteurNonLues,
    getMesNotifications,
    marquerNotificationLue,
    marquerToutesNotificationsLues,
    type NotificationCandidatDTO,
} from "../../api/Notificationservice";
import { IconBell } from "../home/icons";
import "./notificationsBellCandidat.css";

const INTERVALLE_POLLING_MS = 30000;
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

interface PositionDropdown {
    top: number;
    right: number;
}

export function NotificationsBellCandidat() {
    const navigate = useNavigate();
    const [ouvert, setOuvert] = useState(false);
    const [count, setCount] = useState(0);
    const [notifications, setNotifications] = useState<NotificationCandidatDTO[]>([]);
    const [chargement, setChargement] = useState(false);
    const [position, setPosition] = useState<PositionDropdown | null>(null);
    const [estMobile, setEstMobile] = useState(false);

    const wrapRef = useRef<HTMLDivElement>(null);
    const boutonRef = useRef<HTMLButtonElement>(null);

    const rafraichirCompteur = useCallback(async () => {
        try {
            const total = await getCompteurNonLues();
            setCount(total);
        } catch {
            // silencieux
        }
    }, []);

    useEffect(() => {
        rafraichirCompteur();
        const interval = setInterval(rafraichirCompteur, INTERVALLE_POLLING_MS);
        return () => clearInterval(interval);
    }, [rafraichirCompteur]);

    useEffect(() => {
        function checkMobile() {
            setEstMobile(window.innerWidth <= SEUIL_MOBILE);
        }
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            const target = event.target as Node;
            const dansLeBouton = wrapRef.current?.contains(target);
            const dansLeDropdown = (target as HTMLElement)?.closest?.(".notif-cand-bell__dropdown");
            if (!dansLeBouton && !dansLeDropdown) {
                setOuvert(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (!ouvert) return;
        function calculerPosition() {
            const rect = boutonRef.current?.getBoundingClientRect();
            if (!rect) return;
            setPosition({ top: rect.bottom + 10, right: window.innerWidth - rect.right });
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
            const { content } = await getMesNotifications(0, TAILLE_APERCU);
            setNotifications(content);
        } catch {
            setNotifications([]);
        } finally {
            setChargement(false);
        }
    }

    async function handleClicNotification(notif: NotificationCandidatDTO) {
        if (!notif.lu) {
            setNotifications((prev) => prev.map((n) => (n.id === notif.id ? { ...n, lu: true } : n)));
            setCount((c) => Math.max(0, c - 1));
            marquerNotificationLue(notif.id).catch(() => rafraichirCompteur());
        }
        setOuvert(false);
        if (notif.lien) navigate(notif.lien);
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

    const dropdown = ouvert && (
        <>
            {estMobile && <div className="notif-cand-bell__backdrop" onClick={() => setOuvert(false)} />}
            <div
                className="notif-cand-bell__dropdown"
                style={
                    position
                        ? estMobile
                            ? { top: `${position.top}px` }
                            : { top: `${position.top}px`, right: `${position.right}px` }
                        : undefined
                }
            >
                <div className="notif-cand-bell__head">
                    <span className="notif-cand-bell__title">Notifications</span>
                    {count > 0 && (
                        <button className="notif-cand-bell__mark-all" onClick={handleMarquerToutesLues}>
                            Tout marquer comme lu
                        </button>
                    )}
                </div>

                <div className="notif-cand-bell__list">
                    {chargement ? (
                        <div className="notif-cand-bell__empty">Chargement...</div>
                    ) : notifications.length === 0 ? (
                        <div className="notif-cand-bell__empty">Aucune notification pour le moment.</div>
                    ) : (
                        notifications.map((n) => (
                            <button
                                key={n.id}
                                className={`notif-cand-item${n.lu ? "" : " notif-cand-item--non-lue"}`}
                                onClick={() => handleClicNotification(n)}
                            >
                                <span className="notif-cand-item__dot" aria-hidden="true" />
                                <span className="notif-cand-item__body">
                                    <span className="notif-cand-item__type">{libellePourType(n.type)}</span>
                                    <span className="notif-cand-item__message">{n.titre}</span>
                                    <span className="notif-cand-item__date">{formatRelatif(n.dateCreation)}</span>
                                </span>
                            </button>
                        ))
                    )}
                </div>

                <button
                    type="button"
                    className="notif-cand-bell__footer"
                    onClick={() => {
                        setOuvert(false);
                        navigate("/candidat/notifications");
                    }}
                >
                    Voir toutes mes notifications
                </button>
            </div>
        </>
    );

    return (
        <div className="notif-cand-bell-wrap" ref={wrapRef}>
            <button className="notif-cand-bell" aria-label="Notifications" onClick={ouvrirDropdown} ref={boutonRef}>
                <IconBell />
                {count > 0 && <span className="notif-cand-bell__badge">{count > 99 ? "99+" : count}</span>}
            </button>

            {typeof document !== "undefined" && dropdown && createPortal(dropdown, document.body)}
        </div>
    );
}