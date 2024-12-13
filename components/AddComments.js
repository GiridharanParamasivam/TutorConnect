import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';

const AddComments = ({ route, navigation }) => {
    const { booking } = route.params; // Booking details passed via navigation
    const [comments, setComments] = useState('');

    const handleAddComments = async () => {
        if (!comments) {
            Alert.alert('Error', 'Please enter a comment.');
            return;
        }

        try {
            const response = await fetch('http://10.0.2.2:5000/add_meeting_comments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    professor_id: booking.professor_id,
                    comment: comments,
                    user: booking.student_email, // Assuming this is in the booking details
                }),
            });

            const data = await response.json();
            if (response.ok) {
                Alert.alert('Success', 'Comment added and student notified.');
                navigation.goBack(); // Go back to bookings list
            } else {
                Alert.alert('Error', data.message);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to add comment.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Add Comments</Text>
            <Text style={styles.label}>Student: {booking.student_name}</Text>
            <Text style={styles.label}>Date: {booking.date}</Text>
            <Text style={styles.label}>Time: {booking.time}</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter comments about the meeting"
                value={comments}
                onChangeText={setComments}
            />
            <Button title="Submit" onPress={handleAddComments} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
    label: { fontSize: 16, marginBottom: 5 },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 20,
        fontSize: 16,
    },
});

export default AddComments;
