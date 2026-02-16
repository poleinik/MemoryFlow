import {
  forwardRef,
  PropsWithChildren,
  useEffect,
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
    const insets = useSafeAreaInsets();
    const iosBottomInset = insets.bottom || 20;
    const androidBottomInset = insets.bottom || 0;
    useEffect(() => {
      console.log('Modal mounted, insets:', insets);
    }, [insets]);
    
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
        avoidKeyboardLikeIOS={enableKeyboardAvoiding}
        keyboardAvoidingBehavior={
          enableKeyboardAvoiding
            ? Platform.OS === 'ios'
              ? 'padding'
              : 'position'
            : undefined
        }
        keyboardAvoidingOffset={
          enableKeyboardAvoiding && Platform.OS === 'ios' ? iosBottomInset : 0
        }
        childrenStyle={{
          ...styles.container,
          marginBottom: Platform.OS === 'ios' ? iosBottomInset : androidBottomInset,
        }}
      >
        {children}
      </Modalize>
    );
  },
);

Modal.displayName = 'Modal';
