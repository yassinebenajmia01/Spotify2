"use client";

import AuthModal from "@/components/AuthModal";
import UploadModal from "@/components/UploadModal";
import { ReactNode } from "react";

interface ModalProviderProps {
  children?: ReactNode;
}

const ModalProvider = ({ children }: ModalProviderProps) => {
  return (
    <>
      {children}
      <AuthModal />
      <UploadModal/>
    </>
  );
};

export default ModalProvider;
