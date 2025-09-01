"use client";

import AuthModal from "@/components/AuthModal";
import SubscribeModal from "@/components/SubscribeModal";
import UploadModal from "@/components/UploadModal";
import { ProductWithPrice } from "@/types";

interface ModalProviderProps {
  products:ProductWithPrice[];
  children?: React.ReactNode;
}

const ModalProvider:React.FC<ModalProviderProps> = ({products,children}) => {
  return (
    <>
      
      <AuthModal />
      <UploadModal/>
      <SubscribeModal products={products}/>
      {children}
    </>
  );
};

export default ModalProvider;
