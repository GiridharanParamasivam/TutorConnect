import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const StudentDetails = ({ route }) => {
    const { student } = route.params; // Retrieve student data passed from navigation
    
    if (!student) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Student Details</Text>
            <Text style={styles.detailItem}>
                <Text style={styles.label}>Name:</Text> {student.name}
            </Text>
            <Text style={styles.detailItem}>
                <Text style={styles.label}>Subjects:</Text> {student.subjects || 'Not provided'}
            </Text>
            <Text style={styles.detailItem}>
                <Text style={styles.label}>Profile Picture:</Text> {student.profile_picture || 'No picture available'}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    detailItem: { fontSize: 16, marginBottom: 10 },
    label: { fontWeight: 'bold' },
});

export default StudentDetails;
