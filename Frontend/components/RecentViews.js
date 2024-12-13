import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RecentViews = () => {
    const [recentViews, setRecentViews] = useState([]);
    const [recommendations, setRecommendations] = useState([]);

    useEffect(() => {
        const fetchRecentViews = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                if (!token) {
                    Alert.alert('Session Expired', 'Please login again.');
                    return;
                }

                const response = await fetch('http://10.0.2.2:5000/recent_views', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await response.json();
                if (response.ok) {
                    setRecentViews(data);
                    fetchRecommendations(token);
                } else {
                    Alert.alert('Error', data.message || 'Failed to fetch recent views.');
                }
            } catch (error) {
                console.error('Error fetching recent views:', error);
                Alert.alert('Error', 'An error occurred while fetching recent views.');
            }
        };

        const fetchRecommendations = async (token) => {
            try {
                const response = await fetch('http://10.0.2.2:5000/recommend_professors', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await response.json();
                if (response.ok) {
                    setRecommendations(data);
                } else {
                    Alert.alert('Error', data.message || 'Failed to fetch recommendations.');
                }
            } catch (error) {
                console.error('Error fetching recommendations:', error);
            }
        };

        fetchRecentViews();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Recently Viewed Professors</Text>
            <FlatList
                data={recentViews}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.name}>{item.name}</Text>
                        <Text>{item.department}</Text>
                        <Text>{item.subjects}</Text>
                        <Text>Viewed on: {item.viewed_at}</Text>
                    </View>
                )}
                keyExtractor={(item) => item.id.toString()}
            />

            <Text style={styles.title}>Recommended Professors</Text>
            <FlatList
                data={recommendations}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.name}>{item.name}</Text>
                        <Text>{item.subjects}</Text>
                    </View>
                )}
                keyExtractor={(item) => item.id.toString()}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
    card: { padding: 10, backgroundColor: '#eee', borderRadius: 5, marginBottom: 10 },
    name: { fontSize: 18, fontWeight: 'bold' },
});

export default RecentViews;
