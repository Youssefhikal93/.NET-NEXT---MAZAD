import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'flowbite-react'
import { Dispatch, SetStateAction } from 'react'
import Logo from '../nav/Logo'
type Props = {
    openModal:boolean
    setOpenModal: Dispatch<SetStateAction<boolean>>
    children:React.ReactNode
}

export default function BidModal({openModal,setOpenModal,children}:Props) {
  return (
   <Modal show={openModal} onClose={() => setOpenModal(false)}>
                       <ModalHeader>
                           <Logo/> 
                       </ModalHeader>
                       <ModalBody>
                         <div className="space-y-6">
                           <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                             Place a Bid...
                           </p>
                           {children}
                         </div>
                       </ModalBody>
                       <ModalFooter>
                         <Button color={"red"} type="submit" form="bidForm" onClick={() => {
                           
                         }}>Submit your bid</Button>
                         <Button color="alternative" onClick={() => setOpenModal(false)}>
                           Cancel
                         </Button>
                       </ModalFooter>
                     </Modal>
  )
}
