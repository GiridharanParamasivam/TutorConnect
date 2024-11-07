import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';

const ProfessorProfile = ({ navigation }) => {
    const [profile, setProfile] = useState({
        name: '',
        department: '',
        experience: '',
        subjects: '',
        academics: '',
    });

    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = 'your-token-here'; // Replace with your method to get the token
            const response = await fetch('http://10.0.2.2:5000/professor_profile', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await response.json();
            if (response.ok) {
                setProfile(data);
            } else {
                console.error('Error fetching profile:', data.message);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    const handleInputChange = (name, value) => {
        setProfile(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const updateProfile = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await fetch('http://10.0.2.2:5000/update_professor_profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(profile)
            });

            const data = await response.json();
            if (response.ok) {
                Alert.alert("Profile updated successfully!");
                setEditMode(false);
                fetchProfile();
            } else {
                console.error('Error updating profile:', data.message);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.logo}>Smart Tutor</Text>
                <View style={styles.profileInfo}>
                    <Text style={styles.profileInitials}>J</Text>
                    <Text style={styles.profileName}>John</Text>
                    <Button
                        title="My Bookings"
                        onPress={() => navigation.navigate('ViewBookings')}
                    />
                </View>
            </View>
            <View style={styles.profileContainer}>
                <Text style={styles.profileTitle}>Professor Profile</Text>
                {editMode ? (
                    <View style={styles.profileBox}>
                        <TextInput
                            style={styles.input}
                            placeholder="Name"
                            value={profile.name}
                            onChangeText={text => handleInputChange('name', text)}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Department"
                            value={profile.department}
                            onChangeText={text => handleInputChange('department', text)}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Experience (years)"
                            value={profile.experience}
                            onChangeText={text => handleInputChange('experience', text)}
                            keyboardType="numeric"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Subjects"
                            value={profile.subjects}
                            onChangeText={text => handleInputChange('subjects', text)}
                        />
                        <TextInput
                            style={styles.textArea}
                            placeholder="Academic Achievements"
                            value={profile.academics}
                            onChangeText={text => handleInputChange('academics', text)}
                            multiline
                        />
                        <View style={styles.buttonContainer}>
                            <Button title="Save Changes" onPress={updateProfile} />
                            <Button title="Cancel" onPress={() => setEditMode(false)} />
                        </View>
                    </View>
                ) : (
                    <View style={styles.profileBox}>
                        <Text style={styles.profileName}>{profile.name}</Text>
                        <Text><Text style={{ fontWeight: 'bold' }}>Department:</Text> {profile.department}</Text>
                        <Text><Text style={{ fontWeight: 'bold' }}>Experience:</Text> {profile.experience} years</Text>
                        <Text><Text style={{ fontWeight: 'bold' }}>Subjects:</Text> {profile.subjects}</Text>
                        <Text><Text style={{ fontWeight: 'bold' }}>Academics:</Text> {profile.academics}</Text>
                        <Button title="Edit Profile" onPress={() => setEditMode(true)} />
                    </View>
                )}
            </View>
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
        backgroundColor: '#800000',
        padding: 10,
        borderRadius: 5,
    },
    logo: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
    },
    profileInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    profileInitials: {
        backgroundColor: '#FF6347',
        borderRadius: 50,
        padding: 10,
        color: '#fff',
        marginRight: 10,
    },
    profileName: {
        color: '#fff',
        marginRight: 10,
    },
    profileContainer: {
        marginTop: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
    profileTitle: {
        fontSize: 24,
        marginBottom: 10,
    },
    profileBox: {
        marginVertical: 10,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
        paddingLeft: 10,
    },
    textArea: {
        height: 80,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
        paddingLeft: 10,
        textAlignVertical: 'top',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});

export default ProfessorProfile;
