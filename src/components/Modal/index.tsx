import {
  forwardRef,
  PropsWithChildren,
  useImperativeHandle,
  useRef,
} from 'react';
import { Platform } from 'react-native';
import styles from './style';
import { Modalize } from 'react-native-modalize';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type ModalHandle = {
  openModal: () => void;
  closeModal: () => void;
};

type ModalProps = PropsWithChildren<{
  enableKeyboardAvoiding?: boolean;
}>;


export const Modal = forwardRef<ModalHandle, ModalProps>(
  ({ children, enableKeyboardAvoiding = false }, ref) => {
    const modalRef = useRef<Modalize>(null);
    const { bottom } = useSafeAreaInsets();

    useImperativeHandle(
      ref,
      () => ({
        openModal: () => modalRef.current?.open(),
        closeModal: () => modalRef.current?.close(),
      }),
      [],
    );

    return (
      <Modalize
        ref={modalRef}
        adjustToContentHeight={true}
        avoidKeyboardLikeIOS={enableKeyboardAvoiding && Platform.OS === 'ios'}
        keyboardAvoidingBehavior="padding"
        keyboardAvoidingOffset={0}
        childrenStyle={{
          ...styles.container,
          paddingBottom: Math.max(bottom, 16),
        }}
      >
        {children}
      </Modalize>
    );
  },
);

Modal.displayName = 'Modal';
