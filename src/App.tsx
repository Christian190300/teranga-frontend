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
import {OffreDetailPage} from "./pages/offres/OffreDetailPage.tsx";
import { EntrepriseAdminPage } from "./pages/admin/EntrepriseAdminPage";

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <AppLayout>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/connexion" element={<LoginPage />} />
                        <Route path="/inscription" element={<RegisterPage />} />
                        <Route path="/candidat/profil" element={<ProfilCandidatPage />} />
                        <Route path="/recruteur/entreprise" element={<ProfilRecruteurPage />} />
                        <Route path="/admin/utilisateurs" element={<UserAdminPage />} />
                        <Route path="/admin/utilisateurs" element={<UserAdminPage />} />
                        <Route path="/recruteur/offres" element={<MesOffresPage />} />
                        <Route path="/offres" element={<OffresPubliquesPage />} />
                        <Route path="/recruteur/offres" element={<OffresRecruteurPage />} />
                        <Route path="/recruteur/offres/nouvelle" element={<OffreFormPage />} />
                        <Route path="/recruteur/offres/:id/modifier" element={<OffreFormPage />} />
                        <Route path="/admin/offres" element={<OffresAdminPage />} />
                        <Route path="/offres/:id" element={<OffreDetailPage />} />
                        <Route path="/admin/entreprises" element={<EntrepriseAdminPage />} />

                        {/* Routes à venir : /admin, /offres, /candidat/candidatures, /recruteur/offres, etc. */}
                    </Routes>
                </AppLayout>
            </BrowserRouter>
        </AuthProvider>
    );
}