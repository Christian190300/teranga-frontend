import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { AppLayout } from "./components/layout/AppLayout";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ProfilCandidatPage } from "./pages/candidat/ProfilCandidatPage";
import { ProfilRecruteurPage } from "./pages/recruteur/ProfilRecruteurPage";

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
                        {/* Routes à venir : /admin, /offres, /candidat/candidatures, /recruteur/offres, etc. */}
                    </Routes>
                </AppLayout>
            </BrowserRouter>
        </AuthProvider>
    );
}