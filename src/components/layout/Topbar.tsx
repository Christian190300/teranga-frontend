import { NotificationsBell } from "./NotificationsBell";
import { ProfileMenu } from "./ProfileMenu";
import "./topbar.css";

export function Topbar() {
    return (
        <header className="topbar">
            <div className="topbar__spacer" />
            <div className="topbar__actions">
                <NotificationsBell />
                <ProfileMenu />
            </div>
        </header>
    );
}