'use client';

import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
  } from '@chakra-ui/react'

interface DeleteModalProps {
  children: React.ReactNode;
  isOpen:boolean;
  onClose:any;
}

export const DeleteModal: React.FC<DeleteModalProps> = ({children,isOpen,onClose}) => {
    
  
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Invoice</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {children}
          </ModalBody>

          <ModalFooter>
            <Button variant='ghost' mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme='red' onClick={onClose}>Delete</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
