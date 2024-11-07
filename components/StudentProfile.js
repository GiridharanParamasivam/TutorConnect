// src/components/StudentProfile.js
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const StudentProfile = ({ navigation }) => {
    const [student, setStudent] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [error, setError] = useState(null); // To hold any error messages

    useEffect(() => {
        const fetchStudentProfile = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                const response = await fetch('http://10.0.2.2:5000/student_profile', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                const data = await response.json();
                if (response.ok) {
                    setStudent(data);
                } else {
                    Alert.alert('Error', data.message || 'Unable to fetch profile.');
                    console.error('Error fetching student profile:', data.message);
                }
            } catch (error) {
                Alert.alert('Error', 'An error occurred while fetching the profile. Please try again later.');
                console.error('Error fetching student profile:', error);
            }
        };

        fetchStudentProfile();
    }, []);

    const handleSearchChange = async (query) => {
        setSearchQuery(query);
        if (query.length > 2) {
            try {
                console.log("Fetching suggestions for:", query); // Debugging log
                const response = await fetch(`http://10.0.2.2:5000/search_professor?query=${query}`);
                const data = await response.json();
                console.log("Suggestions received:", data); // Log response data

                if (response.ok) {
                    setSuggestions(data);
                    setError(null); // Clear any previous errors
                } else {
                    console.error('Error fetching search suggestions:', data.message);
                    setError('No results found.');
                }
            } catch (error) {
                console.error('Error fetching search suggestions:', error);
                setError('Error fetching data. Please try again later.');
            }
        } else {
            setSuggestions([]);
            setError(null); // Clear error when query is too short
        }
    };

    const handleSuggestionClick = (professorId) => {
        navigation.navigate('ProfessorPublicProfile', { professorId });
    };

    const getInitials = (name) => {
        if (!name) return '';
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    if (!student) {
        return <View style={styles.loadingContainer}><Text>Loading...</Text></View>;
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Smart Tutor</Text>
                <View style={styles.searchBar}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search for professors/subjects..."
                        value={searchQuery}
                        onChangeText={handleSearchChange}
                    />
                    {error && <Text style={styles.errorText}>{error}</Text>}
                    {suggestions.length > 0 && (
                        <FlatList
                            data={suggestions}
                            renderItem={({ item }) => (
                                <TouchableOpacity onPress={() => handleSuggestionClick(item.id)} style={styles.suggestionItem}>
                                    <Text>{item.name} - {item.subjects}</Text>
                                </TouchableOpacity>
                            )}
                            keyExtractor={item => item.id ? item.id.toString() : Math.random().toString()} // Ensure unique key
                            style={styles.suggestionsDropdown}
                        />
                    )}
                </View>
                <View style={styles.profileSection}>
                    <View style={styles.profileInitials}>
                        <Text style={styles.initialsText}>{getInitials(student.name)}</Text>
                    </View>
                    <TouchableOpacity style={styles.dropdownButton}>
                        <Text style={styles.dropdownText}>{student.name}</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.dashboard}>
                <Text style={styles.dashboardTitle}>Student Dashboard</Text>
                <View style={styles.tiles}>
                    <TouchableOpacity style={styles.tile}>
                        <Text style={styles.tileTitle}>History</Text>
                        <Text>View your previous bookings</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.tile}>
                        <Text style={styles.tileTitle}>Notifications</Text>
                        <Text>Upcoming meetings with professors</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.tile} onPress={() => navigation.navigate('BookAppointment')}>
                        <Text style={styles.tileTitle}>Quick Access</Text>
                        <Text>Book a new appointment</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.tile} onPress={() => navigation.navigate('RescheduleAppointment')}>
                        <Text style={styles.tileTitle}>Reschedule Appointment</Text>
                        <Text>Cancel or change time of your bookings</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
        paddingHorizontal: 15,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        backgroundColor: '#7b0000',
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    title: {
        fontSize: 28,
        color: 'white',
        flex: 1,
    },
    searchBar: {
        flex: 1,
        position: 'relative',
        marginLeft: 15,
    },
    searchInput: {
        width: '100%',
        padding: 10,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'white',
        color: '#333',
        fontSize: 16,
    },
    suggestionsDropdown: {
        position: 'absolute',
        top: 40,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        borderRadius: 8,
        maxHeight: 200,
        zIndex: 1000,
        borderColor: 'black', // Added for visualization
        borderWidth: 1, // Added for visualization
    },
    suggestionItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    profileInitials: {
        backgroundColor: '#ff5a00',
        borderRadius: 50,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    initialsText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
    },
    dropdownButton: {
        backgroundColor: 'transparent',
        borderColor: 'white',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
    },
    dropdownText: {
        color: 'white',
        fontSize: 18,
    },
    dashboard: {
        alignItems: 'center',
        marginTop: 20,
    },
    dashboardTitle: {
        fontSize: 24,
        marginBottom: 20,
    },
    tiles: {
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: 15,
    },
    tile: {
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        padding: 15,
        borderRadius: 12,
        width: '45%',
        alignItems: 'center',
        marginBottom: 15,
    },
    tileTitle: {
        fontSize: 20,
        marginTop: 0,
        textAlign: 'center',
    },
    errorText: {
        color: 'red',
        fontSize: 14,
        textAlign: 'center',
        marginTop: 10,
    },
});

export default StudentProfile;
