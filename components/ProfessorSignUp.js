import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, Modal } from 'react-native';

const ProfessorSignUp = ({ visible, closeModal }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [department, setDepartment] = useState('');
    const [experience, setExperience] = useState('');
    const [subjects, setSubjects] = useState('');

    const handleSubmit = async () => {
        const response = await fetch('http://10.0.2.2:5000/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password, name, department, experience, subjects, role: 'professor' }),
        });
        const data = await response.json();
        console.log(data);
        if (response.ok) {
            Alert.alert("Success", "Professor account created successfully!");
        } else {
            Alert.alert("Error", data.message);
        }
        closeModal();
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={closeModal}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.header}>Professor Sign Up</Text>
                    <TextInput
                        style={styles.modalInput}
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                    />
                    <TextInput
                        style={styles.modalInput}
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                    <TextInput
                        style={styles.modalInput}
                        placeholder="Full Name"
                        value={name}
                        onChangeText={setName}
                    />
                    <TextInput
                        style={styles.modalInput}
                        placeholder="Department"
                        value={department}
                        onChangeText={setDepartment}
                    />
                    <TextInput
                        style={styles.modalInput}
                        placeholder="Years of Experience"
                        value={experience}
                        onChangeText={setExperience}
                        keyboardType="numeric"
                    />
                    <TextInput
                        style={styles.modalInput}
                        placeholder="Subjects (comma separated)"
                        value={subjects}
                        onChangeText={setSubjects}
                    />
                    <Button title="Sign Up" onPress={handleSubmit} color="#ff7f50" />
                    <Button title="Close" onPress={closeModal} color="#ff6347" />
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
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        maxWidth: 400,
    },
    header: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center',
    },
    modalInput: {
        width: '100%',
        padding: 10,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
});

export default ProfessorSignUp;
