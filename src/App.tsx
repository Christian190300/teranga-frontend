import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { AppLayout } from "./components/layout/AppLayout";
import { MaintenanceGuard } from "./components/layout/MaintenanceGuard";
import { ScrollToTop } from "./components/layout/ScrollToTop";

// --- PAGES PUBLIQUES ET AUTH ---
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";
import { PremiereConnexionPage } from "./pages/PremiereConnexionPage";
import { VerifyEmailPage } from "./pages/VerifyEmailPage";
import { VerificationEnvoyeePage } from "./pages/VerificationEnvoyeePage";
import { OffresPubliquesPage } from "./pages/offres/OffresPubliquesPage";
import { OffreDetailPage } from "./pages/public/OffreDetailPage";
import { FormationsPubliquesPage } from "./pages/public/FormationsPubliquesPage";

// --- PAGES CANDIDAT ---
import { ProfilCandidatPage } from "./pages/candidat/ProfilCandidatPage";
import { MesCandidaturesPage } from "./pages/candidat/MesCandidaturesPage";
import { MesFormationsPage } from "./pages/candidat/MesFormationsPage";
import { FormationLecteurPage } from "./pages/candidat/FormationLecteurPage";
import { FormationQuizPage } from "./pages/candidat/FormationQuizPage";
import { OffresRecommandeesPage } from "./pages/candidat/OffresRecommandeesPage";

// --- PAGES RECRUTEUR ---
import { ProfilRecruteurPage } from "./pages/recruteur/ProfilRecruteurPage";
import { OffresRecruteurPage } from "./pages/recruteur/OffresRecruteurPage";
import { OffreFormPage } from "./pages/recruteur/OffreFormPage";
import { CandidaturesOffrePage } from "./pages/recruteur/CandidaturesOffrePage";
import { CandidaturesRecuesPage } from "./pages/recruteur/CandidaturesRecuesPage";
import { CandidatsMatchesPage } from "./pages/recruteur/CandidatsMatchesPage";

// --- PAGES ADMIN ---
import { AdminDashboardPage } from "./pages/admin/AdminDashboardPage";
import { UserAdminPage } from "./pages/admin/UserAdminPage";
import { OffresAdminPage } from "./pages/admin/OffresAdminPage";
import { EntrepriseAdminPage } from "./pages/admin/EntrepriseAdminPage";
import { NotificationsAdminPage } from "./pages/admin/NotificationsAdminPage";
import { FormationsAdminPage } from "./pages/admin/FormationsAdminPage";
import { FormationWizardPage } from "./pages/admin/FormationWizardPage";
import { CandidaturesAdminPage } from "./pages/admin/CandidaturesAdminPage";
import { ParametresAdminPage } from "./pages/admin/ParametresAdminPage";
import { ImportOffresPage } from "./pages/admin/ImportOffresPage";

// --- COMPOSANTS & WIDGETS ---
import { ProfilWidget } from "./components/common/ProfilWidget";

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <ScrollToTop />
                <MaintenanceGuard>
                    <AppLayout>
                        <Routes>
                            {/* Pages Publiques */}
                            <Route path="/" element={<HomePage />} />
                            <Route path="/a-propos" element={<AboutPage />} />
                            <Route path="/contact" element={<ContactPage />} />
                            <Route path="/connexion" element={<LoginPage />} />
                            <Route path="/inscription" element={<RegisterPage />} />
                            <Route path="/offres" element={<OffresPubliquesPage />} />
                            <Route path="/offres/:id" element={<OffreDetailPage />} />
                            <Route path="/formations" element={<FormationsPubliquesPage />} />

                            {/* Auth & Vérification */}
                            <Route path="/mot-de-passe-oublie" element={<ForgotPasswordPage />} />
                            <Route path="/reinitialiser-mot-de-passe" element={<ResetPasswordPage />} />
                            <Route path="/premiere-connexion" element={<PremiereConnexionPage />} />
                            <Route path="/verifier-email" element={<VerifyEmailPage />} />
                            <Route path="/verification-envoyee" element={<VerificationEnvoyeePage />} />

                            {/* Espace Candidat */}
                            <Route path="/candidat/profil" element={<ProfilCandidatPage />} />
                            <Route path="/candidat/candidatures" element={<MesCandidaturesPage />} />
                            <Route path="/candidat/formation" element={<MesFormationsPage />} />
                            <Route path="/candidat/formation/:formationId" element={<FormationLecteurPage />} />
                            <Route path="/candidat/formation/:formationId/quiz/:quizId" element={<FormationQuizPage />} />
                            <Route path="/candidat/offres-recommandees" element={<OffresRecommandeesPage />} />

                            {/* Espace Recruteur */}
                            <Route path="/recruteur/entreprise" element={<ProfilRecruteurPage />} />
                            <Route path="/recruteur/offres" element={<OffresRecruteurPage />} />
                            <Route path="/recruteur/offres/nouvelle" element={<OffreFormPage />} />
                            <Route path="/recruteur/offres/:id/modifier" element={<OffreFormPage />} />
                            <Route path="/recruteur/offres/:offreId/candidatures" element={<CandidaturesOffrePage />} />
                            <Route path="/recruteur/candidatures" element={<CandidaturesRecuesPage />} />
                            <Route path="/recruteur/offres/:id/candidats-matches" element={<CandidatsMatchesPage />} />

                            {/* Espace Admin */}
                            <Route path="/admin" element={<AdminDashboardPage />} />
                            <Route path="/admin/utilisateurs" element={<UserAdminPage />} />
                            <Route path="/admin/offres" element={<OffresAdminPage />} />
                            <Route path="/admin/offres/import" element={<ImportOffresPage />} />
                            <Route path="/admin/entreprises" element={<EntrepriseAdminPage />} />
                            <Route path="/admin/notifications" element={<NotificationsAdminPage />} />
                            <Route path="/admin/formations" element={<FormationsAdminPage />} />
                            <Route path="/admin/formations/nouvelle" element={<FormationWizardPage />} />
                            <Route path="/admin/formations/:id/modifier" element={<FormationWizardPage />} />
                            <Route path="/admin/candidatures" element={<CandidaturesAdminPage />} />
                            <Route path="/admin/parametres" element={<ParametresAdminPage />} />
                        </Routes>

                        {/* Widget global d'incitation profil */}
                        <ProfilWidget isAuthenticated={false} profileCompletionRate={0} />
                    </AppLayout>
                </MaintenanceGuard>
            </BrowserRouter>
        </AuthProvider>
    );
}