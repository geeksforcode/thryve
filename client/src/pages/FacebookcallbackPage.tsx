import { useEffect } from "react";
import { handleFacebookCallback } from "@/services/apiClient";

export default function FacebookCallbackPage() {
    useEffect(() => {
        handleFacebookCallback()
        .then(() => {
            window.location.href = "/dashboard";
        })
        .catch((err) => {
            console.error("Facebook login error", err);
        });
    }, []);

    return <p>Logging in with facebook...</p>
}