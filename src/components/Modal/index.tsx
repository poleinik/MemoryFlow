import { forwardRef, PropsWithChildren, useImperativeHandle, useRef } from "react";
import styles from "./style";
import { Modalize } from "react-native-modalize";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type ModalHandle = {
    openModal: () => void;
    closeModal: () => void;
};

export const Modal = forwardRef<ModalHandle, PropsWithChildren>(({ children }, ref) => {
    const modalRef = useRef<Modalize>(null);
    const insets = useSafeAreaInsets();
    useImperativeHandle(
        ref,
        () => ({
            openModal: () => modalRef.current?.open(),
            closeModal: () => modalRef.current?.close(),
        }),
        [],
    );

    return (
        <Modalize ref={modalRef} adjustToContentHeight={true} childrenStyle={{...styles.container, marginBottom: insets.bottom || 20}}>
            {children}
        </Modalize>
    );
});

Modal.displayName = "Modal";