import { useEffect, useState } from "react";
import { type CandidatureDTO, LABELS_STATUT_CANDIDATURE, listerToutesCandidaturesAdmin } from "../../api/candidatureService";
import type {SpringPage} from "../../api/offreService";

export function CandidaturesAdminPage() {
    const [candidatures, setCandidatures] = useState<CandidatureDTO[]>([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [chargement, setChargement] = useState(true);
    const [erreur, setErreur] = useState<string | null>(null);

    useEffect(() => {
        chargerCandidatures(page);
    }, [page]);

    async function chargerCandidatures(pageDemandee: number) {
        setChargement(true);
        setErreur(null);
        try {
            const resultat: SpringPage<CandidatureDTO> = await listerToutesCandidaturesAdmin(pageDemandee, 20);
            setCandidatures(resultat.content);
            setTotalPages(resultat.totalPages);
        } catch (err) {
            setErreur("Impossible de charger les candidatures.");
        } finally {
            setChargement(false);
        }
    }

    if (chargement && candidatures.length === 0) {
        return <div className="p-6">Chargement des candidatures...</div>;
    }

    if (erreur) {
        return <div className="p-6 text-red-600">{erreur}</div>;
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Toutes les candidatures</h1>

            <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200 rounded-lg">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-4 py-2 text-left text-sm font-semibold">Candidat</th>
                        <th className="px-4 py-2 text-left text-sm font-semibold">Offre</th>
                        <th className="px-4 py-2 text-left text-sm font-semibold">Statut</th>
                        <th className="px-4 py-2 text-left text-sm font-semibold">Date</th>
                        <th className="px-4 py-2 text-left text-sm font-semibold">Ville</th>
                    </tr>
                    </thead>
                    <tbody>
                    {candidatures.map((c) => (
                        <tr key={c.id} className="border-t border-gray-100 hover:bg-gray-50">
                            <td className="px-4 py-2">
                                {c.candidatFirstName} {c.candidatLastName}
                                <div className="text-xs text-gray-500">{c.candidatEmail}</div>
                            </td>
                            <td className="px-4 py-2">{c.offreTitre ?? "—"}</td>
                            <td className="px-4 py-2">
                                    <span className="px-2 py-1 rounded text-xs bg-gray-100">
                                        {LABELS_STATUT_CANDIDATURE[c.statut]}
                                    </span>
                            </td>
                            <td className="px-4 py-2 text-sm">
                                {new Date(c.dateCandidature).toLocaleDateString("fr-FR")}
                            </td>
                            <td className="px-4 py-2 text-sm">{c.ville ?? "—"}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {candidatures.length === 0 && (
                <p className="text-gray-500 mt-4">Aucune candidature pour le moment.</p>
            )}

            <div className="flex items-center justify-between mt-4">
                <button
                    disabled={page === 0}
                    onClick={() => setPage((p) => p - 1)}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                >
                    Précédent
                </button>
                <span className="text-sm text-gray-600">
                    Page {page + 1} / {Math.max(totalPages, 1)}
                </span>
                <button
                    disabled={page + 1 >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                >
                    Suivant
                </button>
            </div>
        </div>
    );
}