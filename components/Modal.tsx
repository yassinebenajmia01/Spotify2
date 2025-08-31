import * as Dialog from "@radix-ui/react-dialog";
import { IoMdClose } from "react-icons/io";

interface ModalProps {
  isOpen: boolean;
  onChange: (open: boolean) => void;
  title: string;
  description: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onChange, title, description, children }) => {
  
  return (
    <Dialog.Root open={isOpen} onOpenChange={onChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-neutral-900/90 backdrop-blur-sm fixed inset-0" />
        <Dialog.Content className="fixed top-1/2 left-1/2 max-h-[85vh] w-[90vw] max-w-[450px] bg-neutral-800 p-6 rounded-md shadow-lg transform -translate-x-1/2 -translate-y-1/2 focus:outline-none overflow-auto">
          <Dialog.Title className="text-xl text-center font-bold mb-2">
            {title}
          </Dialog.Title>
          <Dialog.Description className="text-center text-sm mb-4">
            {description}
          </Dialog.Description>
          <div>{children}</div>
          <Dialog.Close asChild>
            <button className="absolute top-3 right-3 text-neutral-400 hover:text-white rounded-full w-8 h-8 flex items-center justify-center">
              <IoMdClose />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default Modal;
