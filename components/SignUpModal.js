import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import StudentSignUp from './StudentSignUp';
import ProfessorSignUp from './ProfessorSignUp';

const SignUpModal = ({ visible, closeModal }) => {
    const [role, setRole] = useState(null);

    const handleRoleSelection = (selectedRole) => {
        setRole(selectedRole);
    };

    return (
        <Modal
            transparent={true}
            animationType="slide"
            visible={visible}
            onRequestClose={closeModal} // Handle closing the modal on Android
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    {!role && (
                        <>
                            <Text style={styles.title}>Select Your Role</Text>
                            <TouchableOpacity
                                onPress={() => handleRoleSelection('student')}
                                style={styles.modalButton}
                            >
                                <Text style={styles.buttonText}>Student</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => handleRoleSelection('professor')}
                                style={styles.modalButton}
                            >
                                <Text style={styles.buttonText}>Professor</Text>
                            </TouchableOpacity>
                        </>
                    )}
                    {role === 'student' && <StudentSignUp closeModal={closeModal} />}
                    {role === 'professor' && <ProfessorSignUp closeModal={closeModal} />}
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 30,
        borderRadius: 8,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5, // For Android shadow effect
    },
    title: {
        color: 'black',
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center',
    },
    modalButton: {
        marginTop: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 30,
        backgroundColor: '#ff6347', // Tomato color
        alignItems: 'center',
        width: '80%', // Button width
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
});

export default SignUpModal;
