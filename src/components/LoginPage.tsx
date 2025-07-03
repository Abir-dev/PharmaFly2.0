"use client";
import React from "react";
import {
  IconBrandGithub,
  IconBrandGoogle,
  IconBrandOnlyfans,
} from "@tabler/icons-react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { cn } from "../lib/utils";

const LoginPage: React.FC = () => {
  const handleGoogleLogin = () => {
    alert("Google Auth Demo");
    // Here you would trigger your real Google auth flow
  };
  return (
    <div className="pharma-login-bg-dark">
      <div className="pharma-login-card-dark">
        <img src="/drone.png" alt="PharmaFly Drone Logo" className="pharma-login-logo" />
        <div className="pharma-login-gradient-bar" />
        <h2 className="pharma-login-title-dark">Sign in to PharmaFly</h2>
        <p className="pharma-login-desc">
          <span className="pharma-login-highlight">PharmaFly</span> delivers essential medicines and medical supplies via drones, ensuring fast, safe, and reliable healthcare access—anytime, anywhere.
        </p>
        <button className="pharma-google-btn-dark" onClick={handleGoogleLogin}>
          <img src="/icons/google.svg" alt="Google" className="pharma-google-icon-dark" />
          <span>Sign in with Google</span>
        </button>
      </div>
    </div>
  );
};

export default LoginPage;

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};
