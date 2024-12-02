import React, { useState } from 'react';
import { 
  Modal, 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  Image 
} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

interface HelpModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isVisible, onClose }) => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={isVisible}
        onRequestClose={onClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <FontAwesome name="close" size={24} color="#ffffff" />
            </TouchableOpacity>
            
            <ScrollView contentContainerStyle={styles.scrollContent}>
              <Text style={styles.modalTitle}>Airport Information Guide</Text>
              
              <Text style={styles.instructionText}>
                To get airport information, phrase your request as follows:
              </Text>
              
              <Text style={styles.exampleText}>
                "What is the {"{information type}"} of {"{airport identifier}"}"
              </Text>
              
              <Text style={styles.noteText}>
                • Last four words MUST be the airport identifier
              </Text>
              <Text style={styles.noteText}>
                • Ask for only one piece of information at a time
              </Text>
              
              <Text style={styles.infoTypesTitle}>
                Information Types:
              </Text>
              
              <View style={styles.infoTypesList}>
                <Text style={styles.infoTypesText}>• Weather frequency</Text>
                <Text style={styles.infoTypesText}>• Weather conditions</Text>
                <Text style={styles.infoTypesText}>• Unicom</Text>
                <Text style={styles.infoTypesText}>• Airport length</Text>
                <Text style={styles.infoTypesText}>• Airport elevation</Text>
              </View>
              
              <Text style={styles.identifierTitle}>
                Airport Identifier Guidelines:
              </Text>
              
              <Text style={styles.identifierText}>
                • Use alphanumeric 4 letter/number codes
                • Examples: KLAX, KJFK, KORD 
              </Text>
              
              <View style={styles.imageContainer}>
                <Image
                  source={require('../assets/images/aviation.alphabet.png')}
                  //Pocket-Co-Pilot\Fourth\expo-client\assets\images\aviation.alphabet.png
                  style={styles.exampleImage}
                  resizeMode="contain"
                  accessibilityLabel="Example of airport information request"
                />
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 15,
  },
  exampleImage: {
    width: 350, 
    height: 175,
    borderRadius: 10,
  },
  modalContainer: {
    width: '90%',
    maxHeight: '90%',
    backgroundColor: '#233446',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 10,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#7bb5e3',
    textAlign: 'center',
    marginBottom: 20,
  },
  instructionHeader: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
  instructionText: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 10,
    textAlign: 'center',
  },
  exampleText: {
    fontSize: 16,
    color: '#7bb5e3',
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 15,
  },
  noteText: {
    fontSize: 14,
    color: '#e53e3e',
    marginBottom: 15,
    textAlign: 'center',
  },
  infoTypesTitle: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
  infoTypesList: {
    alignItems: 'center',
    marginBottom: 15,
  },
  infoTypesText: {
    fontSize: 15,
    color: '#7bb5e3',
    marginVertical: 5,
  },
  identifierTitle: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
  identifierText: {
    fontSize: 15,
    color: '#7bb5e3',
    textAlign: 'center',
    marginBottom: 15,
  },
  placeholderImageContainer: {
    alignItems: 'center',
    marginTop: 15,
  },
  placeholderImageText: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 10,
  },
  imagePlaceholder: {
    width: 200,
    height: 150,
    backgroundColor: '#1a2a3a',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#7bb5e3',
  },
});

export default HelpModal;