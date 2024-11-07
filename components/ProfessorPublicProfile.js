import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, Modal, StyleSheet, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfessorPublicProfile = () => {
    const route = useRoute();
    const { professorId } = route.params;
    const [professor, setProfessor] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);
    const [showLoginPopup, setShowLoginPopup] = useState(false);
    const [showRatingPopup, setShowRatingPopup] = useState(false);
    const [user, setUser] = useState({ email: '', password: '' });
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log("Fetching profile for professor ID:", professorId);
        const fetchProfessorProfile = async () => {
            try {
                const response = await fetch(`http://10.0.2.2:5000/professor_public_profile/${professorId}`);
                const data = await response.json();
                if (response.ok) {
                    setProfessor(data);
                } else {
                    console.error('Error fetching professor profile:', data.message);
                    Alert.alert('Error', data.message || 'Failed to load professor profile');
                }
            } catch (error) {
                console.error('Error fetching professor profile:', error);
                Alert.alert('Error', 'An error occurred while fetching the professor profile.');
            } finally {
                setLoading(false);
            }
        };
        fetchProfessorProfile();
    }, [professorId]);

    const handleRateClick = () => {
        if (!isLoggedIn) {
            setShowLoginPrompt(true);
        } else {
            setShowRatingPopup(true);
        }
    };

    const handleLoginSubmit = async () => {
        try {
            const response = await fetch('http://10.0.2.2:5000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: user.email, password: user.password, role: 'student' }),
            });

            const data = await response.json();
            if (response.ok) {
                await AsyncStorage.setItem('token', data.token);
                console.log("Token stored:", data.token);
                setIsLoggedIn(true);
                setShowLoginPopup(false);
                setShowRatingPopup(true);
            } else {
                console.error('Login failed:', data.message);
                Alert.alert('Login Failed', data.message);
            }
        } catch (error) {
            console.error('Login error:', error);
            Alert.alert('Error', 'An error occurred while logging in. Please try again.');
        }
    };

    const handleRatingSubmit = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await fetch('http://10.0.2.2:5000/rate_professor', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ professorId, rating, comment }),
            });

            const data = await response.json();
            if (response.ok) {
                Alert.alert('Success', 'Rating submitted successfully');
                setShowRatingPopup(false);
                setRating(0);
                setComment('');
            } else {
                console.error('Rating submission failed:', data.message);
                Alert.alert('Error', data.message);
            }
        } catch (error) {
            console.error('Rating submission error:', error);
            Alert.alert('Error', 'An error occurred while submitting your rating. Please try again.');
        }
    };

    if (loading) {
        return <Text>Loading professor profile...</Text>;
    }

    if (!professor) {
        return <Text>Failed to load professor profile. Please try again later.</Text>;
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.logo}>Smart Tutor</Text>
                <View style={styles.headerButtons}>
                    {isLoggedIn ? (
                        <Text style={styles.profileInitials}>{user.name ? user.name[0] : '?'}</Text>
                    ) : (
                        <>
                            <Button title="Log In" onPress={() => setShowLoginPopup(true)} />
                            <Button title="Sign Up" onPress={() => { /* Handle sign up */ }} />
                        </>
                    )}
                </View>
            </View>

            <View style={styles.profileSummary}>
                <Text style={styles.overallRating}>{professor.average_rating}/5</Text>
                <Text style={styles.ratingCount}>Overall Quality Based on {professor.rating_count} ratings</Text>
                <Text style={styles.name}>{professor.name}</Text>
                <Text>{professor.department} Department</Text>
                <Text>{professor.experience} years of experience</Text>
                <Text>Subjects: {professor.subjects}</Text>
                <View style={styles.actions}>
                    <Button title="Rate" onPress={handleRateClick} />
                    <Button title="Compare" onPress={() => { /* Handle compare */ }} />
                </View>
            </View>

            {/* Login Prompt */}
            <Modal visible={showLoginPrompt} transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modal}>
                        <Text>Login to Rate</Text>
                        <Button title="Login" onPress={() => { setShowLoginPrompt(false); setShowLoginPopup(true); }} />
                    </View>
                </View>
            </Modal>

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
                        <Button title="Login" onPress={handleLoginSubmit} />
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
                        <Button title="Submit" onPress={handleRatingSubmit} />
                        <Button title="Cancel" onPress={() => setShowRatingPopup(false)} />
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f4f4',
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#800000',
        color: 'white',
    },
    logo: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
    },
    headerButtons: {
        flexDirection: 'row',
    },
    profileInitials: {
        backgroundColor: '#FF6347',
        color: 'white',
        borderRadius: 20,
        padding: 10,
    },
    profileSummary: {
        textAlign: 'center',
        padding: 50,
        backgroundColor: 'white',
        marginVertical: 20,
        borderRadius: 10,
        elevation: 5,
    },
    overallRating: {
        fontSize: 80,
        color: '#800000',
    },
    ratingCount: {
        fontSize: 18,
        color: '#666',
    },
    name: {
        fontSize: 40,
        color: '#800000',
        marginBottom: 10,
    },
    actions: {
        marginTop: 20,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    modal: {
        width: '80%',
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        elevation: 10,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
});

export default ProfessorPublicProfile;
