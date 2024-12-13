import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';

const Recommendations = ({ navigation }) => {
    const [recommendations, setRecommendations] = useState([]);
    const [error, setError] = useState(null);

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
                setRecommendations(data);
                setError(null);
            } else {
                setError(data.message || 'No recommendations available.');
            }
        } catch (error) {
            console.error('Error fetching recommendations:', error);
            setError('An error occurred while fetching recommendations.');
        }
    };

    useEffect(() => {
        fetchRecommendations();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Recommended Professors</Text>
            {error && <Text style={styles.errorText}>{error}</Text>}
            {recommendations.length > 0 ? (
                <FlatList
                    data={recommendations}
                    renderItem={({ item }) => (
                        <View style={styles.item}>
                            <Text style={styles.name}>{item.name}</Text>
                            <Text style={styles.subjects}>{item.subjects}</Text>
                        </View>
                    )}
                    keyExtractor={(item) => item.id.toString()}
                />
            ) : (
                <Text style={styles.noDataText}>No recommendations found.</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    item: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#ddd' },
    name: { fontSize: 18, fontWeight: 'bold' },
    subjects: { fontSize: 14, color: '#666' },
    errorText: { color: 'red', marginBottom: 10 },
    noDataText: { fontSize: 16, color: '#666', textAlign: 'center' },
});

export default Recommendations;
