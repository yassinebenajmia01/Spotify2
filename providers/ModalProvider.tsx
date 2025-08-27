"use client";

import AuthModal from "@/components/AuthModal";
import { ReactNode } from "react";

interface ModalProviderProps {
  children?: ReactNode;
}

const ModalProvider = ({ children }: ModalProviderProps) => {
  return (
    <>
      {children}
      <AuthModal />
    </>
  );
};

export default ModalProvider;
