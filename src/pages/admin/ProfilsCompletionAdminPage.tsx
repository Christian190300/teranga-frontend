import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    getStatistiquesCompletionProfils,
    listerProfilsComplets,
    listerProfilsIncomplets,
    type ProfilCompletionStatistiquesDTO,
} from "../../api/userAdminActivityService";
import { listerUtilisateurs } from "../../api/adminUserService";
import type { AdminUtilisateur } from "../../api/adminUserService";
import type { ProfilCandidatDTO } from "../../api/profileService";
import "./profilsCompletionAdminPage.css";

type Filtre = "COMPLETS" | "INCOMPLETS";

interface LigneProfil {
    userId: string;
    score: number;
    titreProfessionnel: string | null;
    firstName: string | null;
    lastName: string | null;
    username: string | null;
    email: string | null;
}

function initiales(prenom?: string | null, nom?: string | null): string {
    return `${prenom?.[0] ?? ""}${nom?.[0] ?? ""}`.toUpperCase() || "?";
}

function IconSearch() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
            <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
    );
}

function IconChevronRight() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export function ProfilsCompletionAdminPage() {
    const [stats, setStats] = useState<ProfilCompletionStatistiquesDTO | null>(null);
    const [filtre, setFiltre] = useState<Filtre>("INCOMPLETS");
    const [lignes, setLignes] = useState<LigneProfil[]>([]);
    const [chargement, setChargement] = useState(true);
    const [erreur, setErreur] = useState<string | null>(null);
    const [recherche, setRecherche] = useState("");

    useEffect(() => {
        getStatistiquesCompletionProfils().then(setStats).catch(() => setStats(null));
    }, []);

    const charger = useCallback(async () => {
        setChargement(true);
        setErreur(null);
        try {
            const appelProfils = filtre === "COMPLETS" ? listerProfilsComplets : listerProfilsIncomplets;

            // On croise les profils candidats (userId + score) avec la liste des
            // utilisateurs (nom, email) via l'endpoint admin/utilisateurs existant.
            const [profils, resultatUtilisateurs] = await Promise.all([
                appelProfils(),
                listerUtilisateurs(0, 1000, ""),
            ]);

            const utilisateursParId = new Map<string, AdminUtilisateur>(
                resultatUtilisateurs.utilisateurs.map((u) => [u.id, u])
            );

            const fusion: LigneProfil[] = profils.map((p: ProfilCandidatDTO) => {
                const u = utilisateursParId.get(p.userId);
                return {
                    userId: p.userId,
                    score: p.score?.percentage ?? 0,
                    titreProfessionnel: p.titreProfessionnel,
                    firstName: u?.firstName ?? null,
                    lastName: u?.lastName ?? null,
                    username: u?.username ?? null,
                    email: u?.email ?? null,
                };
            });

            setLignes(fusion);
        } catch {
            setErreur("Impossible de charger la liste des profils.");
            setLignes([]);
        } finally {
            setChargement(false);
        }
    }, [filtre]);

    useEffect(() => {
        charger();
    }, [charger]);

    const lignesFiltrees = lignes.filter((l) => {
        if (!recherche.trim()) return true;
        const cible = `${l.firstName ?? ""} ${l.lastName ?? ""} ${l.email ?? ""} ${l.username ?? ""}`.toLowerCase();
        return cible.includes(recherche.toLowerCase());
    });

    return (
        <div className="pcap-page">
            <div className="pcap-head">
                <div>
                    <h1 className="pcap-title">Complétion des profils</h1>
                    <p className="pcap-subtitle">
                        Profils candidats classés par niveau de complétion (seuil : 60%).
                    </p>
                </div>
            </div>

            {stats && (
                <div className="pcap-stats-row">
                    <div className="pcap-stat pcap-stat--total">
                        <span className="pcap-stat__value">{stats.totalProfils}</span>
                        <span className="pcap-stat__label">Profils au total</span>
                    </div>
                    <button
                        type="button"
                        className={`pcap-stat pcap-stat--complet${filtre === "COMPLETS" ? " is-active" : ""}`}
                        onClick={() => setFiltre("COMPLETS")}
                    >
                        <span className="pcap-stat__value">{stats.profilsComplets}</span>
                        <span className="pcap-stat__label">Profils complets (≥ 60%)</span>
                    </button>
                    <button
                        type="button"
                        className={`pcap-stat pcap-stat--incomplet${filtre === "INCOMPLETS" ? " is-active" : ""}`}
                        onClick={() => setFiltre("INCOMPLETS")}
                    >
                        <span className="pcap-stat__value">{stats.profilsIncomplets}</span>
                        <span className="pcap-stat__label">Profils incomplets (&lt; 60%)</span>
                    </button>
                </div>
            )}

            <div className="pcap-toolbar">
                <div className="pcap-search">
                    <IconSearch />
                    <input
                        type="search"
                        className="pcap-search__input"
                        placeholder="Rechercher par nom ou email…"
                        value={recherche}
                        onChange={(e) => setRecherche(e.target.value)}
                    />
                </div>
                <span className="pcap-toolbar__count">{lignesFiltrees.length} profil(s)</span>
            </div>

            {erreur && <div className="pcap-alert">{erreur}</div>}

            <div className="pcap-table-wrap">
                <table className="pcap-table">
                    <thead>
                    <tr>
                        <th>Candidat</th>
                        <th>Email</th>
                        <th>Titre professionnel</th>
                        <th>Score</th>
                        <th aria-label="Actions" />
                    </tr>
                    </thead>
                    <tbody>
                    {chargement ? (
                        <tr>
                            <td colSpan={5} className="pcap-table__empty">
                                Chargement…
                            </td>
                        </tr>
                    ) : lignesFiltrees.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="pcap-table__empty">
                                Aucun profil dans cette catégorie.
                            </td>
                        </tr>
                    ) : (
                        lignesFiltrees.map((l) => (
                            <tr key={l.userId}>
                                <td data-label="Candidat">
                                    <Link to={`/admin/utilisateurs/${l.userId}`} className="pcap-table__user">
                                        <div className="pcap-table__avatar">{initiales(l.firstName, l.lastName)}</div>
                                        <div>
                                            <div className="pcap-table__name">
                                                {l.firstName || l.lastName
                                                    ? `${l.firstName ?? ""} ${l.lastName ?? ""}`.trim()
                                                    : "Nom inconnu"}
                                            </div>
                                            <div className="pcap-table__username">@{l.username ?? "—"}</div>
                                        </div>
                                    </Link>
                                </td>
                                <td data-label="Email">{l.email ?? "—"}</td>
                                <td data-label="Titre professionnel">{l.titreProfessionnel ?? "—"}</td>
                                <td data-label="Score">
                                        <span className={`pcap-score-pill${l.score < 60 ? " pcap-score-pill--faible" : ""}`}>
                                            {l.score}%
                                        </span>
                                </td>
                                <td data-label="Actions">
                                    <Link to={`/admin/utilisateurs/${l.userId}`} className="pcap-table__voir">
                                        Voir <IconChevronRight />
                                    </Link>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}