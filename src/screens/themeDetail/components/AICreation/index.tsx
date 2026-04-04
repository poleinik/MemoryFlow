import {useRef } from 'react'
import { TouchableOpacity, View, Text } from "react-native"
import {styles} from './styles'
import BrainSparklesIcon from 'assets/BrainSparklesIcon';
import { Portal } from 'react-native-portalize';
import { CreateAICardModal } from '../CreateAICardModal';
import { Modal, ModalHandle } from 'src/components/Modal';
export const AICreateBtn = () => {
    
     const modalRef = useRef<ModalHandle>(null);
    const openModal = () => modalRef?.current?.openModal();
  const closeModal = () => modalRef?.current?.closeModal();

    return (<View style={{ position: 'absolute', right: 0, bottom: 0 }}> 
        <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
            onPress={openModal}
          >
            <BrainSparklesIcon width={28} height={28} />
          </TouchableOpacity>
          <Portal>
            <Modal ref={modalRef} enableKeyboardAvoiding>
<CreateAICardModal closeModal={closeModal}/>
            </Modal>
        
          </Portal>
          </View>
    )
}