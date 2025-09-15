import { useEffect } from "react";
import { handleGoogleCallback } from "@/services/apiClient";

export default function GoogleCallbackPage() {
    useEffect(() => {
        handleGoogleCallback()
        .then(() => {
            window.location.href = "/dashboard";
        })
        .catch((err) => {
            console.log("Google login error", err);
        });
    }, []);

    return <p>Logging you in with Google...</p>;
}
