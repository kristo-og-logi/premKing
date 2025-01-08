import type React from 'react';
import { Modal, Pressable, StyleSheet } from 'react-native';
import { colors } from '../../styles/styles';

interface Props {
  children: React.ReactNode;
  isActive: boolean;
  setIsActive: (isActive: boolean) => void;
}
const PremModal = ({ children, isActive, setIsActive }: Props) => {
  /* Having two pressables allows them to catch onPress events
   * The inner, the actual modal content, prevents the event from propagating up if the event belongs to it.
   * That is, if the press happened within the modal itself
   * If the press did not occur in the modal content, the outer pressable will catch it, closing the modal */
  return (
    <Modal visible={isActive} transparent={true} onRequestClose={() => setIsActive(false)}>
      <Pressable
        style={[styles.modalOverlay]}
        onPress={() => {
          setIsActive(false);
        }}
      >
        <Pressable
          style={styles.modal}
          onPress={(e) => {
            e.preventDefault();
          }}
        >
          {children}
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: colors.charcoal[1],
    padding: 20,
    borderRadius: 10,
    marginHorizontal: 20,
    alignItems: 'center',
  },
});

export default PremModal;
