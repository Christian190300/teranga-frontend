import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Navbar } from "./components/layout/Navbar";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Navbar />
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/connexion" element={<LoginPage />} />
                    <Route path="/inscription" element={<RegisterPage />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}