import { useEffect, useRef, useState } from "react";

export type AutoSaveStatus = "idle" | "saving" | "saved" | "error";

/**
 * Sauvegarde automatiquement `value` en appelant `saveFn` après un délai
 * d'inactivité (debounce), pour éviter d'enregistrer à chaque frappe.
 * Ignore le premier passage effectif (une fois `enabled` devenu true) pour
 * ne pas ré-enregistrer les données qu'on vient de charger depuis le backend.
 *
 * @param enabled Passez `false` tant que les données initiales ne sont pas
 * chargées (ex: pendant un `loading`), puis `true` une fois prêtes.
 */
export function useAutoSave<T>(value: T, saveFn: (value: T) => Promise<void>, delayMs = 900, enabled = true) {
    const [status, setStatus] = useState<AutoSaveStatus>("idle");
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isBaselineRef = useRef(true);
    const savedTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (!enabled) {
            return;
        }

        if (isBaselineRef.current) {
            isBaselineRef.current = false;
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
    }, [JSON.stringify(value), enabled]);

    return status;
}