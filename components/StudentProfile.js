import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StudentDetails from './StudentDetails';
import { ScrollView } from 'react-native';


const StudentProfile = ({ navigation }) => {
    const [student, setStudent] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [error, setError] = useState(null);
    const [recommendations, setRecommendations] = useState([]);


    useEffect(() => {
        const fetchStudentProfile = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                if (!token) {
                    Alert.alert('Session Expired', 'Please login again.');
                    navigation.navigate('Home');
                    return;
                }

                const response = await fetch('http://10.0.2.2:5000/student_profile', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`, // Fixed template literal
                    },
                });

                const data = await response.json();
                if (response.ok) {
                    setStudent(data);
                } else {
                    Alert.alert('Error', data.message || 'Unable to fetch student profile.');
                    navigation.navigate('Home');
                }
            } catch (error) {
                Alert.alert('Error', error.message || 'An error occurred while fetching your profile.');
                navigation.navigate('Home');
            }
        };

        fetchStudentProfile();
    }, []);
    const fetchRecommendations = async () => {
        try {
            const response = await fetch('http://10.0.2.2:5000/recommend_subjects', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            const data = await response.json();
            if (response.ok) {
                setRecommendations(data); // Store recommendations
                setError(null);           // Clear any previous errors
            } else {
                setError(data.message || 'No recommendations found.');
            }
        } catch (error) {
            console.error('Error fetching recommendations:', error);
            setError('An error occurred while fetching recommendations.');
        }
    };
    useEffect(() => {
        fetchRecommendations();
    }, [searchQuery]);
        

    const handleLogout = async () => {
        try {
            await AsyncStorage.clear();
            Alert.alert('Logged Out', 'You have been successfully logged out.');
            navigation.navigate('Home');
        } catch (error) {
            console.error('Logout Error:', error);
            Alert.alert('Error', 'An error occurred during logout.');
        }
    };

    const handleSearchChange = async (query) => {
        setSearchQuery(query);
        if (query.length > 2) {
            try {
                const response = await fetch(`http://10.0.2.2:5000/search_professor?query=${query}`); // Fixed template literal
                const data = await response.json();

                if (response.ok) {
                    setSuggestions(data);
                    setError(null);
                } else {
                    setError('No results found.');
                }
            } catch (error) {
                setError('Error fetching data. Please try again later.');
            }
        } else {
            setSuggestions([]);
            setError(null);
        }
    };

    const handleSuggestionClick = async (professorId) => {
        if (!professorId) {
            Alert.alert('Error', 'Invalid professor ID.');
            return;
        }

        try {
            const response = await fetch(`http://10.0.2.2:5000/view_professor/${professorId}`, { // Fixed template literal
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                Alert.alert('Error', 'Failed to fetch professor details.');
                return;
            }

            const data = await response.json();
            navigation.navigate('ProfessorPublicProfile', { professorId, professorData: data });
        } catch (error) {
            console.error('Error viewing professor:', error);
            Alert.alert('Error', 'An unexpected error occurred while viewing the professor.');
        }
    };

    if (!student) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Smart Tutor</Text>
                    <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                        <Text style={styles.logoutText}>Logout</Text>
                    </TouchableOpacity>
                </View>
    
                <View style={styles.dashboard}>
                    <Text style={styles.dashboardTitle}>Student Dashboard</Text>
                    <View style={styles.tiles}>
                        <TouchableOpacity onPress={() => navigation.navigate('Notifications')} style={styles.tile}>
                            <Text>Notifications</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('BookAppointment')} style={styles.tile}>
                            <Text>Book Appointment</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('StudentDetails',{student})} style={styles.tile}>
                            <Text>StudentDetails</Text>
                        </TouchableOpacity>
                    </View>
                </View>
    
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
                                <TouchableOpacity
                                    onPress={() => handleSuggestionClick(item.id)}
                                    style={styles.suggestionItem}
                                >
                                    <Text>{item.name} - {item.subjects}</Text>
                                </TouchableOpacity>
                            )}
                            keyExtractor={(item) => item.id.toString()}
                            style={styles.suggestionsDropdown}
                        />
                    )}
                </View>
    
                <View style={styles.recommendationsSection}>
                    <Text style={styles.recommendationsTitle}>Recommended Professors</Text>
                    {error && <Text style={styles.errorText}>{error}</Text>}
                    {recommendations.length > 0 ? (
                        <FlatList
                            data={recommendations}
                            renderItem={({ item }) => (
                                <View style={styles.recommendationItem}>
                                    <Text style={styles.recommendationName}>{item.name}</Text>
                                    <Text style={styles.recommendationSubjects}>{item.subjects}</Text>
                                </View>
                            )}
                            keyExtractor={(item) => item.id.toString()}
                        />
                    ) : (
                        <Text style={styles.noRecommendations}>No recommendations available.</Text>
                    )}
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    // Existing styles
    container: { flex: 1, padding: 20 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    title: { fontSize: 24, fontWeight: 'bold' },
    logoutButton: { padding: 10, backgroundColor: 'red', borderRadius: 5 },
    logoutText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    dashboard: { marginTop: 20 },
    dashboardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
    
    // Updated styles for vertical stacking
    tiles: {
        flexDirection: 'column', // Change to column for vertical stacking
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        gap: 10, // Add spacing between tiles
    },
    tile: {
        padding: 20,
        backgroundColor: '#eee',
        borderRadius: 5,
        marginBottom: 10, // Add space between tiles
    },
    searchBar: { marginTop: 20 },
    searchInput: {
        width: '100%',
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ccc',
        marginBottom: 10,
    },
    suggestionsDropdown: {
        backgroundColor: '#fff',
        borderRadius: 5,
        borderColor: '#ccc',
        borderWidth: 1,
        maxHeight: 200,
    },
    suggestionItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' },
    errorText: { color: 'red', marginBottom: 10 },
    recommendationsSection: { marginTop: 30 },
recommendationsTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
recommendationItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
},
recommendationName: { fontSize: 16, fontWeight: 'bold' },
recommendationSubjects: { fontSize: 14, color: '#666' },
noRecommendations: { fontSize: 14, color: '#999', textAlign: 'center', marginTop: 10 },

});


export default StudentProfile;
