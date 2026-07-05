import { useEffect, useRef, useState } from "react";

export type AutoSaveStatus = "idle" | "saving" | "saved" | "error";

/**
 * Sauvegarde automatiquement `value` en appelant `saveFn` après un délai
 * d'inactivité (debounce), pour éviter d'enregistrer à chaque frappe.
 * Ignore l'appel initial (au montage) pour ne pas ré-enregistrer les
 * données qu'on vient de charger depuis le backend.
 */
export function useAutoSave<T>(value: T, saveFn: (value: T) => Promise<void>, delayMs = 900) {
    const [status, setStatus] = useState<AutoSaveStatus>("idle");
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isFirstRender = useRef(true);
    const savedTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setStatus("saving");

        timeoutRef.current = setTimeout(async () => {
            try {
                await saveFn(value);
                setStatus("saved");
                if (savedTimeoutRef.current) clearTimeout(savedTimeoutRef.current);
                savedTimeoutRef.current = setTimeout(() => setStatus("idle"), 2000);
            } catch {
                setStatus("error");
            }
        }, delayMs);

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(value)]);

    return status;
}