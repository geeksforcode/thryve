import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

type JwtPayload = {
  provider: string;
  email?: string;
  role?: string;
};

export default function AuthSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    let token: string | null = null;

    // First, try query string (rare for Facebook, but good for other providers)
    const searchParams = new URLSearchParams(window.location.search);
    token = searchParams.get("token");

    // If not found, check inside the hash fragment (Facebook usually does this)
    if (!token && window.location.hash.includes("?")) {
      const hashQuery = window.location.hash.split("?")[1]; // everything after '?'
      const hashParams = new URLSearchParams(hashQuery);
      token = hashParams.get("token");
    }

    console.log("Extracted token:", token);

    if (token) {
      localStorage.setItem("auth_token", token);

      try {
        const decoded: JwtPayload = jwtDecode(token);
        console.log("Decoded token:", decoded);

        // Redirect based on role in token
        switch (decoded.role) {
          case "jobseeker":
            navigate("/profile/job-seeker");
            break;
          case "artist":
            navigate("/profile/artist");
            break;
          case "investor":
            navigate("/profile/investor");
            break;
          case "employer":
            navigate("/profile/employer");
            break;
          default:
            navigate("/"); // fallback if role is missing
        }
      } catch (err) {
        console.error("Invalid token:", err);
        navigate("/auth");
      }
    } else {
      console.warn("No token found in URL");
      navigate("/auth");
    }
  }, [navigate]);

  return <p>Authenticating... please wait</p>;
}
