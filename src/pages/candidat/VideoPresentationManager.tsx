import React, { useState, useEffect, useRef } from "react";
import {
    type StatutVideoPresentation,
    type VideoStatutDTO,
    uploaderVideoPresentation,
    obtenirStatutVideo,
    obtenirVideoPresentationUrl,
    supprimerVideoPresentation,
} from "../../api/profileService";
import "./VideoPresentationManager.css";

interface Props {
    initialStatut?: StatutVideoPresentation | string | null;
    initialDuree?: number | null;
    initialErreur?: string | null;
    onProfilUpdated?: () => void;
    onVideoUpdated?: () => void | Promise<void>;
}

export function VideoPresentationManager({
                                             initialStatut,
                                             initialDuree,
                                             initialErreur,
                                             onProfilUpdated,
                                         }: Props) {
    const [statut, setStatut] = useState<StatutVideoPresentation>(
        (initialStatut as StatutVideoPresentation) || "EN_ATTENTE"
    );
    const [duree, setDuree] = useState<number | null | undefined>(initialDuree);
    const [erreurMessage, setErreurMessage] = useState<string | null | undefined>(initialErreur);

    const [isUploading, setIsUploading] = useState(false);
    const [videoSrc, setVideoSrc] = useState<string | null>(null);

    const pollingRef = useRef<NodeJS.Timeout | null>(null);

    const stopPolling = () => {
        if (pollingRef.current) {
            clearInterval(pollingRef.current);
            pollingRef.current = null;
        }
    };

    // 1. Chargement de la vidéo (Blob) quand le statut est DISPONIBLE
    useEffect(() => {
        let isMounted = true;
        let blobUrl: string | null = null;

        if (statut === "DISPONIBLE") {
            obtenirVideoPresentationUrl().then((url) => {
                if (isMounted && url) {
                    blobUrl = url;
                    setVideoSrc(url);
                }
            });
        } else {
            setVideoSrc(null);
        }

        return () => {
            isMounted = false;
            if (blobUrl) {
                URL.revokeObjectURL(blobUrl);
            }
        };
    }, [statut]);

    // 2. Polling si le traitement FFmpeg est EN_ATTENTE ou EN_COURS
    useEffect(() => {
        if (statut === "EN_ATTENTE" || statut === "EN_COURS") {
            pollingRef.current = setInterval(async () => {
                try {
                    const res: VideoStatutDTO = await obtenirStatutVideo();
                    setStatut(res.statut);
                    setDuree(res.dureeSecondes);

                    if (res.statut === "DISPONIBLE" || res.statut === "ECHEC") {
                        if (res.statut === "ECHEC") {
                            setErreurMessage(res.erreurMessage || "Échec de la compression vidéo.");
                        }
                        stopPolling();
                        if (onProfilUpdated) onProfilUpdated();
                    }
                } catch (e) {
                    console.error("Erreur polling statut vidéo:", e);
                }
            }, 2500);
        } else {
            stopPolling();
        }

        return () => stopPolling();
    }, [statut, onProfilUpdated]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setErreurMessage(null);

        try {
            const res = await uploaderVideoPresentation(file);
            setStatut(res.statut);
        } catch (err: any) {
            setErreurMessage(err?.response?.data?.message || "Erreur lors de l'envoi de la vidéo.");
            setStatut("ECHEC");
        } finally {
            setIsUploading(false);
            e.target.value = "";
        }
    };

    const handleSupprimer = async () => {
        if (!window.confirm("Voulez-vous vraiment supprimer votre vidéo de présentation ?")) return;

        try {
            const profil = await supprimerVideoPresentation();
            setStatut((profil.videoStatut as StatutVideoPresentation) || "EN_ATTENTE");
            setDuree(null);
            setErreurMessage(null);
            setVideoSrc(null);
            if (onProfilUpdated) onProfilUpdated();
        } catch (err: any) {
            alert(err?.response?.data?.message || "Erreur lors de la suppression.");
        }
    };

    const formatDuree = (secondes?: number | null) => {
        if (!secondes) return "";
        const mins = Math.floor(secondes / 60);
        const secs = secondes % 60;
        return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
    };

    return (
        <div className="video-card">
            <h3 className="video-card__title">Vidéo de Présentation</h3>

            {(statut === "EN_COURS" || statut === "EN_ATTENTE") && (
                <div className="video-card__status video-card__status--processing">
                    <div className="spinner" />
                    <div>
                        <p className="status-text">
                            {statut === "EN_ATTENTE"
                                ? "Vidéo reçue, mise en file d'attente..."
                                : "Traitement et compression FFmpeg en cours..."}
                        </p>
                        <span className="status-subtext">
                            Le traitement s'effectue en arrière-plan.
                        </span>
                    </div>
                </div>
            )}

            {statut === "DISPONIBLE" && videoSrc && (
                <div className="video-card__player-box">
                    <video controls controlsList="nodownload" className="video-player" src={videoSrc}>
                        Votre navigateur ne prend pas en charge la lecture vidéo.
                    </video>
                    <div className="video-card__footer">
                        {duree && <span className="duration-badge">⏱️ Durée : {formatDuree(duree)}</span>}
                        <button type="button" className="btn-delete" onClick={handleSupprimer}>
                            Supprimer la vidéo
                        </button>
                    </div>
                </div>
            )}

            {statut === "ECHEC" && (
                <div className="video-card__status video-card__status--error">
                    <p className="error-title">Échec du traitement</p>
                    <p className="error-desc">{erreurMessage || "Fichier non valide ou format incorrect."}</p>
                </div>
            )}

            {(statut === "EN_ATTENTE" || statut === "ECHEC") && !isUploading && (
                <div className="video-card__upload">
                    <label className="dropzone">
                        <input
                            type="file"
                            accept="video/mp4,video/webm,video/quicktime"
                            onChange={handleFileChange}
                            className="hidden-input"
                        />
                        <div className="dropzone-body">
                            <span className="icon">🎥</span>
                            <p className="main-text">
                                <strong>Cliquez pour ajouter une vidéo</strong> ou glissez-déposez
                            </p>
                            <span className="sub-text">Formats : MP4, MOV, WebM</span>
                        </div>
                    </label>
                </div>
            )}

            {isUploading && (
                <div className="video-card__status video-card__status--uploading">
                    <div className="spinner" />
                    <p className="status-text">Téléversement du fichier en cours...</p>
                </div>
            )}
        </div>
    );
}