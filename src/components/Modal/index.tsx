import {
  forwardRef,
  PropsWithChildren,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Keyboard, Platform } from 'react-native';
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
    const [keyboardHeight, setKeyboardHeight] = useState(0);

    useEffect(() => {
      if (!enableKeyboardAvoiding) return;

      const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
      const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

      const showSub = Keyboard.addListener(showEvent, (e) => {
        setKeyboardHeight(e.endCoordinates.height);
      });
      const hideSub = Keyboard.addListener(hideEvent, () => {
        setKeyboardHeight(0);
      });

      return () => {
        showSub.remove();
        hideSub.remove();
      };
    }, [enableKeyboardAvoiding]);

    useImperativeHandle(
      ref,
      () => ({
        openModal: () => modalRef.current?.open(),
        closeModal: () => modalRef.current?.close(),
      }),
      [],
    );

    const bottomPadding = keyboardHeight > 0 ? keyboardHeight : Math.max(bottom, 16);

    return (
      <Modalize
        ref={modalRef}
        adjustToContentHeight={true}
        childrenStyle={{
          ...styles.container,
          paddingBottom: bottomPadding,
        }}
      >
        {children}
      </Modalize>
    );
  },
);

Modal.displayName = 'Modal';
