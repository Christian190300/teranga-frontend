import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { AppLayout } from "./components/layout/AppLayout";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ProfilCandidatPage } from "./pages/candidat/ProfilCandidatPage";
import { ProfilRecruteurPage } from "./pages/recruteur/ProfilRecruteurPage";
import { UserAdminPage } from "./pages/admin/UserAdminPage";
import { MesOffresPage } from "./pages/recruteur/MesOffresPage";
import {OffresPubliquesPage} from "./pages/offres/OffresPubliquesPage.tsx";
import {OffresRecruteurPage} from "./pages/recruteur/OffresRecruteurPage.tsx";
import {OffreFormPage} from "./pages/recruteur/OffreFormPage.tsx";
import {OffresAdminPage} from "./pages/admin/OffresAdminPage.tsx";
import { EntrepriseAdminPage } from "./pages/admin/EntrepriseAdminPage";
import { AdminDashboardPage } from "./pages/admin/AdminDashboardPage";
import { MesCandidaturesPage } from "./pages/candidat/MesCandidaturesPage";
import { CandidaturesOffrePage } from "./pages/recruteur/CandidaturesOffrePage";
import { CandidaturesRecuesPage } from "./pages/recruteur/CandidaturesRecuesPage";
import { FormationsAdminPage } from "./pages/admin/FormationsAdminPage";
import { FormationWizardPage } from "./pages/admin/FormationWizardPage";
import { MesFormationsPage } from "./pages/candidat/MesFormationsPage";
import { FormationLecteurPage } from "./pages/candidat/FormationLecteurPage";
import { FormationQuizPage } from "./pages/candidat/FormationQuizPage";
import { FormationsPubliquesPage } from "./pages/public/FormationsPubliquesPage";
import { OffreDetailPage } from "./pages/public/OffreDetailPage";
import {ForgotPasswordPage} from "./pages/ForgotPasswordPage.tsx";
import {ResetPasswordPage} from "./pages/ResetPasswordPage.tsx";
import {PremiereConnexionPage} from "./pages/PremiereConnexionPage.tsx";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <AppLayout>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/a-propos" element={<AboutPage />} />
                        <Route path="/contact" element={<ContactPage />} />
                        <Route path="/connexion" element={<LoginPage />} />
                        <Route path="/inscription" element={<RegisterPage />} />
                        <Route path="/candidat/profil" element={<ProfilCandidatPage />} />
                        <Route path="/recruteur/entreprise" element={<ProfilRecruteurPage />} />
                        <Route path="/admin/utilisateurs" element={<UserAdminPage />} />
                        <Route path="/admin/utilisateurs" element={<UserAdminPage />} />
                        <Route path="/recruteur/offres" element={<MesOffresPage />} />
                        <Route path="/offres" element={<OffresPubliquesPage />} />
                        <Route path="/offres/:id" element={<OffreDetailPage />} />
                        <Route path="/recruteur/offres" element={<OffresRecruteurPage />} />
                        <Route path="/recruteur/offres/nouvelle" element={<OffreFormPage />} />
                        <Route path="/recruteur/offres/:id/modifier" element={<OffreFormPage />} />
                        <Route path="/admin/offres" element={<OffresAdminPage />} />
                        <Route path="/admin/entreprises" element={<EntrepriseAdminPage />} />
                        <Route path="/admin" element={<AdminDashboardPage />} />
                        <Route path="/candidat/candidatures" element={<MesCandidaturesPage />} />
                        <Route path="/recruteur/offres/:offreId/candidatures" element={<CandidaturesOffrePage />} />
                        <Route path="/recruteur/candidatures" element={<CandidaturesRecuesPage />} />
                        <Route path="/admin/formations" element={<FormationsAdminPage />} />
                        <Route path="/admin/formations/nouvelle" element={ <FormationWizardPage />}/>
                        <Route path="/admin/formations/:id/modifier" element={ <FormationWizardPage />}/>
                        <Route path="/formations" element={<FormationsPubliquesPage />} />
                        <Route path="/candidat/formation" element={<MesFormationsPage />} />
                        <Route path="/candidat/formation/:formationId" element={<FormationLecteurPage />} />
                        <Route path="/candidat/formation/:formationId/quiz/:quizId" element={<FormationQuizPage />} />
                        <Route path="/mot-de-passe-oublie" element={<ForgotPasswordPage />} />
                        <Route path="/reinitialiser-mot-de-passe" element={<ResetPasswordPage />} />
                        <Route path="/premiere-connexion" element={<PremiereConnexionPage />} />
                        {/* Routes à venir : /admin, /offres, /candidat/candidatures, /recruteur/offres, etc. */}
                    </Routes>
                </AppLayout>
                <footer/>
            </BrowserRouter>
        </AuthProvider>
    );
}