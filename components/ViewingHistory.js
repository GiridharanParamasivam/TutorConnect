import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ViewingHistory = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchViewingHistory = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                if (!token) {
                    Alert.alert('Session Expired', 'Please login again.');
                    return;
                }
                const response = await fetch('http://10.0.2.2:5000/get_recent_views', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await response.json();
                if (response.ok) {
                    setHistory(data.recent_views || []);
                } else {
                    console.error('Error fetching recent views:', data.message);
                    Alert.alert('Error', data.message);
                }
            } catch (error) {
                console.error('Error fetching recent views:', error);
                Alert.alert('Error', 'Failed to fetch viewing history.');
            } finally {
                setLoading(false);
            }
        };

        fetchViewingHistory();
    }, []);

    const renderProfessor = ({ item }) => (
        <View style={styles.professorTile}>
            <Text style={styles.professorName}>{item.name}</Text>
            <Text style={styles.professorDetail}>Subjects: {item.subjects}</Text>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Recently Viewed Professors</Text>
            {history.length > 0 ? (
                <FlatList
                    data={history}
                    renderItem={renderProfessor}
                    keyExtractor={(item, index) => index.toString()}
                />
            ) : (
                <Text>No recently viewed professors.</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
    professorTile: { padding: 15, backgroundColor: '#f0f0f0', borderRadius: 8, marginBottom: 10 },
    professorName: { fontSize: 18, fontWeight: 'bold' },
    professorDetail: { fontSize: 16, color: '#555' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default ViewingHistory;
