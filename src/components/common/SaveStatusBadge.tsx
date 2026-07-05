import type { AutoSaveStatus } from "../../hooks/useAutoSave";
import "./saveStatusBadge.css";

export function SaveStatusBadge({ status }: { status: AutoSaveStatus }) {
    if (status === "idle") return null;

    const config = {
        saving: { label: "Enregistrement...", className: "save-status--saving" },
        saved: { label: "Enregistré", className: "save-status--saved" },
        error: { label: "Échec de l'enregistrement", className: "save-status--error" },
    }[status];

    return <span className={`save-status ${config.className}`}>{config.label}</span>;
}