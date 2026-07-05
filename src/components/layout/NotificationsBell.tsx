import { useState } from "react";
import { IconBell } from "../home/icons";
import "./notificationsBell.css";

export function NotificationsBell() {
    // Compteur statique pour l'instant — à brancher sur une vraie API de notifications plus tard.
    const [count] = useState(0);

    return (
        <button className="notif-bell" aria-label="Notifications">
            <IconBell />
            {count > 0 && <span className="notif-bell__badge">{count}</span>}
        </button>
    );
}