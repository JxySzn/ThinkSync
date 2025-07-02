"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export function useSignupFlow() {
  const router = useRouter();
  const [signupToken, setSignupTokenState] = useState<string | null>(null);
  const [email, setEmailState] = useState<string>("");

  // Persist to sessionStorage
  function setSignupToken(token: string | null) {
    setSignupTokenState(token);
    if (token) {
      sessionStorage.setItem("signupToken", token);
    } else {
      sessionStorage.removeItem("signupToken");
    }
  }
  function setEmail(email: string) {
    setEmailState(email);
    if (email) {
      sessionStorage.setItem("signupEmail", email);
    } else {
      sessionStorage.removeItem("signupEmail");
    }
  }

  // Restore from sessionStorage on mount
  useEffect(() => {
    const storedToken = sessionStorage.getItem("signupToken");
    const storedEmail = sessionStorage.getItem("signupEmail");
    if (storedToken) setSignupTokenState(storedToken);
    if (storedEmail) setEmailState(storedEmail);
  }, []);

  function startSignupFlow(_token: string | undefined, email: string) {
    setSignupToken(null); // No token needed for DB-backed OTP
    setEmail(email);
    router.push(`/sign_up_verify?email=${encodeURIComponent(email)}`);
  }

  return { signupToken, setSignupToken, email, setEmail, startSignupFlow };
}
