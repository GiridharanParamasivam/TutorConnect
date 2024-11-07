// ViewingHistory.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';

const ViewingHistory = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch viewing history when the component mounts
        const fetchViewingHistory = async () => {
            try {
                const response = await axios.get('/viewing_history');
                setHistory(response.data || []);
            } catch (error) {
                console.error("Failed to fetch viewing history", error);
            } finally {
                setLoading(false);
            }
        };

        fetchViewingHistory();
    }, []);

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Recently Viewed Professors:</Text>
            {history.length > 0 ? (
                history.map((professor, index) => (
                    <Text key={index} style={styles.professorInfo}>
                        {professor.name} - {professor.department}
                    </Text>
                ))
            ) : (
                <Text>No recently viewed professors.</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    professorInfo: {
        fontSize: 16,
        marginBottom: 5,
    },
});

export default ViewingHistory;
