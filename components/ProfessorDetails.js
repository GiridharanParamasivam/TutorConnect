import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

const ProfessorDetails = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { professorId } = route.params;
    const [professor, setProfessor] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const logView = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                if (!token) return;
    
                await fetch(`http://10.0.2.2:5000/log_view/${professorId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });
            } catch (error) {
                console.error('Error logging professor view:', error);
            }
        };
    
        logView();
    }, [professorId]);
    

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Loading professor details...</Text>
            </View>
        );
    }

    if (!professor) {
        return (
            <View style={styles.errorContainer}>
                <Text>Failed to load professor details. Please try again later.</Text>
                <Button title="Go Home" onPress={() => navigation.navigate('Home')} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Professor Details</Text>
                <Button title="Home" onPress={() => navigation.navigate('Home')} />
            </View>
            <View style={styles.content}>
                <Text style={styles.name}>{professor.name}</Text>
                <Text style={styles.detail}>Department: {professor.department}</Text>
                <Text style={styles.detail}>Subjects: {professor.subjects}</Text>
                <Text style={styles.detail}>Experience: {professor.experience} years</Text>
                <Text style={styles.detail}>Academic Achievements: {professor.academics}</Text>
                <Text style={styles.detail}>
                    Average Rating: {professor.average_rating} ({professor.rating_count} reviews)
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f4f4f4',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    content: {
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        elevation: 3,
    },
    name: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    detail: {
        fontSize: 18,
        marginBottom: 5,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ProfessorDetails;
