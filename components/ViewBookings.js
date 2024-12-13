import React, { useEffect, useState } from 'react';
import { View, Text, FlatList,TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ViewBookings = ({navigation}) => {

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                const response = await fetch('http://10.0.2.2:5000/get_professor_bookings', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await response.json();
                if (response.ok) {
                    setBookings(data);
                } else {
                    Alert.alert('Error', data.message);
                }
            } catch (error) {
                Alert.alert('Error', 'Failed to fetch bookings.');
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    const renderBooking = ({ item }) => {
        console.log('Booking Item:', item); // Debug log
        return (
            <TouchableOpacity
                style={styles.bookingTile}
                onPress={() => navigation.navigate('AddComments', { booking: item })}
            >
                <Text style={styles.bookingDetail}>Student: {item.student_name}</Text>
                <Text style={styles.bookingDetail}>Date: {item.date}</Text>
                <Text style={styles.bookingDetail}>Time: {item.time}</Text>
            </TouchableOpacity>
        );
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>My Bookings</Text>
            {bookings.length > 0 ? (
                <FlatList
                    data={bookings}
                    renderItem={renderBooking}
                    keyExtractor={(item, index) => index.toString()}
                />
            ) : (
                <Text>No bookings found.</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
    bookingTile: { padding: 15, backgroundColor: '#f0f0f0', borderRadius: 8, marginBottom: 10 },
    bookingDetail: { fontSize: 16 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default ViewBookings;
