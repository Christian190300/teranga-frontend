import "./AppLayout.css";
import type { ReactNode } from "react";
import { useAuth } from "../../context/AuthContext";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { Footer } from "./Footer";

export function AppLayout({ children }: { children: ReactNode }) {
    const { currentUser, isLoadingUser, isAuthenticated } = useAuth();

    if (isAuthenticated && isLoadingUser) {
        return <div className="app-shell__boot" aria-hidden="true" />;
    }

    const isAdmin = currentUser?.role === "ADMIN";

    if (isAdmin) {
        return (
            <div className="app-shell app-shell--vertical">
                <Sidebar />
                <div className="app-shell__main">
                    <Topbar />
                    <main className="app-shell__content-admin">{children}</main>
                </div>
            </div>
        );
    }

    return (
        <div className="app-shell app-shell--horizontal">
            <Navbar />
            <div className="app-shell__content">{children}</div>
            <Footer />
        </div>
    );
}