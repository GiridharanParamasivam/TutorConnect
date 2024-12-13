import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, Modal, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation, useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfessorPublicProfile = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const isFocused = useIsFocused(); // To check if the screen is active
    const { professorId } = route.params;
    const [professor, setProfessor] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showLoginPopup, setShowLoginPopup] = useState(false);
    const [showRatingPopup, setShowRatingPopup] = useState(false);
    const [user, setUser] = useState({ email: '', password: '' });
    const [username, setUsername] = useState('');
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [student,setStudent] = useState("")

    useEffect(() => {
        const fetchStudentDetails = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                if (!token) {
                    setIsLoggedIn(false);
                    return;
                }

                const response = await fetch('http://10.0.2.2:5000/student_profile', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await response.json();
                if (response.ok) {
                    setUsername(data.name);
                    console.log(data) // Set username
                    setStudent(data)
                    setIsLoggedIn(true);
                } else {
                    setIsLoggedIn(false);
                }
            } catch (error) {
                console.error('Error fetching student details:', error);
                setIsLoggedIn(false);
            }
        };

        const fetchProfessorProfile = async () => {
            try {
                const response = await fetch(`http://10.0.2.2:5000/professor_public_profile/${professorId}`);
                const data = await response.json();

                if (response.ok) {
                    setProfessor(data);
                } else {
                    console.error('Error fetching professor profile:', data.message);
                    if (isFocused) {
                        await AsyncStorage.removeItem('token');
                        Alert.alert(
                            'Error',
                            data.message || 'Failed to load professor profile. You will be logged out.',
                            [
                                {
                                    text: 'OK',
                                    onPress: () => {
                                        navigation.replace('StudentProfile');
                                    },
                                },
                            ]
                        );
                    }
                }
            } catch (error) {
                console.error('Error fetching professor profile:', error);
                if (isFocused) {
                    await AsyncStorage.removeItem('token');
                    Alert.alert(
                        'Error',
                        'An error occurred while fetching the professor profile. You will be logged out.',
                        [
                            {
                                text: 'OK',
                                onPress: () => {
                                    navigation.replace('StudentProfile');
                                },
                            },
                        ]
                    );
                }
            } finally {
                setLoading(false);
            }
        };

        fetchStudentDetails();
        fetchProfessorProfile();
    }, [professorId, isFocused]);

    const handleLogout = async () => {
        await AsyncStorage.removeItem('token'); // Clear session token
        navigation.replace('Home'); // Redirect to StudentProfile
    };

    const navigateToStudentDetails = () => {
        console.log(student)
        navigation.navigate('StudentDetails', { student });
    };

    if (loading) {
        return <Text>Loading professor profile...</Text>;
    }

    if (!professor) {
        return (
            <View style={styles.container}>
                <Text>Failed to load professor profile. Redirecting...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Button title="Back" onPress={() => navigation.goBack()} />
                <Text style={styles.logo}>Smart Tutor</Text>
                {isLoggedIn && (
                    <TouchableOpacity onPress={navigateToStudentDetails}>
                        <Text style={styles.username}>{username}</Text>
                    </TouchableOpacity>
                )}
                <Button title="Logout" onPress={handleLogout} />
            </View>

            <View style={styles.profileSummary}>
                <Text style={styles.overallRating}>{professor.average_rating}/5</Text>
                <Text style={styles.ratingCount}>Overall Quality Based on {professor.rating_count} ratings</Text>
                <Text style={styles.name}>{professor.name}</Text>
                <Text>{professor.department} Department</Text>
                <Text>{professor.experience} years of experience</Text>
                <Text>Subjects: {professor.subjects}</Text>
                <Button title="Rate" onPress={() => setShowRatingPopup(true)} />
            </View>

            {/* Login Popup */}
            <Modal visible={showLoginPopup} transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modal}>
                        <Text>Student Login</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            value={user.email}
                            onChangeText={(text) => setUser({ ...user, email: text })}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            secureTextEntry
                            value={user.password}
                            onChangeText={(text) => setUser({ ...user, password: text })}
                        />
                        <Button title="Login" onPress={() => setShowLoginPopup(false)} />
                        <Button title="Close" onPress={() => setShowLoginPopup(false)} />
                    </View>
                </View>
            </Modal>

            {/* Rating Popup */}
            <Modal visible={showRatingPopup} transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modal}>
                        <Text>Rate {professor.name}</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Rating (0-5)"
                            keyboardType="numeric"
                            value={String(rating)}
                            onChangeText={(text) => setRating(Number(text))}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Comment"
                            multiline
                            value={comment}
                            onChangeText={(text) => setComment(text)}
                        />
                        <Button title="Submit" onPress={() => setShowRatingPopup(false)} />
                        <Button title="Cancel" onPress={() => setShowRatingPopup(false)} />
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f4f4f4', padding: 20 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    logo: { fontSize: 24, fontWeight: 'bold' },
    username: { fontSize: 16, fontWeight: 'bold', color: '#007BFF' },
    profileSummary: { padding: 20, backgroundColor: '#fff', borderRadius: 10 },
    overallRating: { fontSize: 40, color: '#800000' },
    ratingCount: { fontSize: 16, color: '#666' },
    name: { fontSize: 24, fontWeight: 'bold' },
    modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.7)' },
    modal: { padding: 20, backgroundColor: '#fff', borderRadius: 10, width: '80%' },
    input: { borderColor: 'gray', borderWidth: 1, padding: 10, marginBottom: 10 },
});

export default ProfessorPublicProfile;
