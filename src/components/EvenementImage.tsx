import { useEffect, useState } from "react";

interface Props {
    presente: boolean;
    chargerUrl: () => Promise<string | null>;
    alt: string;
    className?: string;
    placeholderClassName?: string;
}

/** Affiche l'image d'un événement en récupérant un blob authentifié (admin ou public). */
export function EvenementImage({ presente, chargerUrl, alt, className, placeholderClassName }: Props) {
    const [url, setUrl] = useState<string | null>(null);

    useEffect(() => {
        let urlCree: string | null = null;
        let isMounted = true;

        if (presente) {
            chargerUrl().then((resultat) => {
                if (!isMounted) return;
                if (resultat) {
                    urlCree = resultat;
                    setUrl(resultat);
                }
            });
        }

        return () => {
            isMounted = false;
            if (urlCree) URL.revokeObjectURL(urlCree);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps -- chargerUrl est stable par usage (fermeture sur l'id)
    }, [presente]);

    if (!presente || !url) {
        return <div className={placeholderClassName} />;
    }

    return <img src={url} alt={alt} className={className} />;
}