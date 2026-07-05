import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { AppLayout } from "./components/layout/AppLayout";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <AppLayout>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/connexion" element={<LoginPage />} />
                        <Route path="/inscription" element={<RegisterPage />} />
                        {/* Routes à venir : /candidat/profil, /recruteur/offres, /admin, etc. */}
                    </Routes>
                </AppLayout>
            </BrowserRouter>
        </AuthProvider>
    );
}