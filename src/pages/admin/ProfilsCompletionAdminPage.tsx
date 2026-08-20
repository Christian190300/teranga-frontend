import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    getStatistiquesCompletionProfils,
    listerProfilsComplets,
    listerProfilsIncomplets,
    type ProfilCompletionStatistiquesDTO,
} from "../../api/userAdminActivityService";
import type { ProfilCandidatDTO } from "../../api/profileService";
import "./profilsCompletionAdminPage.css";

type Filtre = "COMPLETS" | "INCOMPLETS";

function scorePourcent(dto: ProfilCandidatDTO): number {
    const score = dto.score;
    if (!score) return 0;
    return typeof score === "number" ? score : score.percentage ?? 0;
}

export function ProfilsCompletionAdminPage() {
    const [stats, setStats] = useState<ProfilCompletionStatistiquesDTO | null>(null);
    const [filtre, setFiltre] = useState<Filtre>("INCOMPLETS");
    const [profils, setProfils] = useState<ProfilCandidatDTO[]>([]);
    const [chargement, setChargement] = useState(true);

    useEffect(() => {
        getStatistiquesCompletionProfils().then(setStats).catch(() => setStats(null));
    }, []);

    useEffect(() => {
        setChargement(true);
        const appel = filtre === "COMPLETS" ? listerProfilsComplets : listerProfilsIncomplets;
        appel()
            .then(setProfils)
            .catch(() => setProfils([]))
            .finally(() => setChargement(false));
    }, [filtre]);

    return (
        <div className="pcap-page">
            <h1 className="pcap-title">Complétion des profils candidats</h1>

            {stats && (
                <div className="pcap-stats-row">
                    <div className="pcap-stat pcap-stat--total">
                        <strong>{stats.totalProfils}</strong>
                        <span>Profils au total</span>
                    </div>
                    <button
                        className={`pcap-stat pcap-stat--complet${filtre === "COMPLETS" ? " pcap-stat--actif" : ""}`}
                        onClick={() => setFiltre("COMPLETS")}
                    >
                        <strong>{stats.profilsComplets}</strong>
                        <span>Profils complets (≥ 60%)</span>
                    </button>
                    <button
                        className={`pcap-stat pcap-stat--incomplet${filtre === "INCOMPLETS" ? " pcap-stat--actif" : ""}`}
                        onClick={() => setFiltre("INCOMPLETS")}
                    >
                        <strong>{stats.profilsIncomplets}</strong>
                        <span>Profils incomplets (&lt; 60%)</span>
                    </button>
                </div>
            )}

            <div className="pcap-list">
                {chargement ? (
                    <div className="pcap-empty">Chargement...</div>
                ) : profils.length === 0 ? (
                    <div className="pcap-empty">Aucun profil dans cette catégorie.</div>
                ) : (
                    profils.map((p) => (
                        <Link key={p.userId} to={`/admin/utilisateurs/${p.userId}`} className="pcap-item">
                            <span className="pcap-item__nom">
                                {p.titreProfessionnel ?? "Profil candidat"}
                            </span>
                            <span className="pcap-item__meta">{p.userId}</span>
                            <span className={`pcap-item__score${scorePourcent(p) < 60 ? " pcap-item__score--faible" : ""}`}>
                                {scorePourcent(p)}%
                            </span>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}