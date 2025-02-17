import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

// Save session data
export const saveSession = async (token, role) => {
    try {
        await AsyncStorage.setItem('userSession', JSON.stringify({ token, role }));
        console.log('Session saved successfully.');
    } catch (error) {
        console.error('Failed to save session:', error);
    }
};

// Get session data
export const getSession = async () => {
    try {
        const session = await AsyncStorage.getItem('userSession');
        return session ? JSON.parse(session) : null;
    } catch (error) {
        console.error('Failed to retrieve session:', error);
        return null;
    }
};

// Clear session data
export const clearSession = async () => {
    try {
        await AsyncStorage.removeItem('userSession');
        console.log('Session cleared.');
    } catch (error) {
        console.error('Failed to clear session:', error);
    }
};

const LoginModal = ({ closeModal }) => {
    const [role, setRole] = useState(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigation = useNavigation();

    const handleRoleSelection = (selectedRole) => {
        setRole(selectedRole);
        setError('');
    };

    const handleLogin = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://10.0.2.2:5000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, role }),
            });
    
            const data = await response.json();
            console.log('API response:', data); // Debugging
    
            if (response.ok && data.token) {
                await AsyncStorage.setItem('token', data.token); // Store the token
                await saveSession(data.token, role); // Save session with role
                Alert.alert("Login successful!");
                navigation.navigate(role === 'student' ? 'StudentProfile' : 'ProfessorProfile');
            } else {
                console.error('Error response:', data);
                Alert.alert('Error', data.message || 'Login failed.');
            }
        } catch (error) {
            console.error("Login error:", error);
            Alert.alert('Error', 'An error occurred during login.');
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
                {!role ? (
                    <>
                        <Text style={styles.title}>Select Your Role</Text>
                        <TouchableOpacity
                            onPress={() => handleRoleSelection('student')}
                            style={[styles.button, role === 'student' && styles.activeButton]}
                        >
                            <Text style={styles.buttonText}>Student</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => handleRoleSelection('professor')}
                            style={[styles.button, role === 'professor' && styles.activeButton]}
                        >
                            <Text style={styles.buttonText}>Professor</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <>
                        <Text style={styles.title}>{role.charAt(0).toUpperCase() + role.slice(1)} Login</Text>
                        {error ? <Text style={styles.errorMessage}>{error}</Text> : null}
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                        <TouchableOpacity onPress={handleLogin} style={styles.button} disabled={loading}>
                            {loading ? <ActivityIndicator size="small" color="#ffffff" /> : <Text style={styles.buttonText}>Login</Text>}
                        </TouchableOpacity>
                        <TouchableOpacity onPress={closeModal} style={styles.cancelButton}>
                            <Text style={styles.buttonText}>Close</Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>
        </View>
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
        width: '80%',
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        marginBottom: 20,
    },
    input: {
        width: '100%',
        padding: 10,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
    button: {
        width: '100%',
        padding: 10,
        backgroundColor: '#007bff',
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 10,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    activeButton: {
        backgroundColor: '#0056b3',
    },
    cancelButton: {
        padding: 10,
        backgroundColor: '#dc3545',
        borderRadius: 5,
        alignItems: 'center',
    },
    errorMessage: {
        color: 'red',
        marginBottom: 15,
    },
});

export default LoginModal;
