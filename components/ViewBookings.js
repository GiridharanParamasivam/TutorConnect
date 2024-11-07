import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, ActivityIndicator } from 'react-native';

const ViewBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const token = await AsyncStorage.getItem('token'); // Use AsyncStorage to get the token
            const response = await fetch('http://10.0.2.2:5000/get_professor_bookings', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await response.json();
            if (response.ok) {
                setBookings(data);
            } else {
                console.error('Error fetching bookings:', data.message);
                Alert.alert('Error', data.message);
            }
        } catch (error) {
            console.error('Error fetching bookings:', error);
            Alert.alert('Error', 'Failed to fetch bookings');
        } finally {
            setLoading(false);
        }
    };

    const renderBookingTile = ({ item }) => (
        <View style={styles.bookingTile}>
            <Text style={styles.studentName}>{item.student_name}</Text>
            <Text style={styles.bookingDetail}>Date: {item.date}</Text>
            <Text style={styles.bookingDetail}>Time: {item.time}</Text>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#ffffff" />
            </View>
        );
    }

    return (
        <View style={styles.viewBookingsContainer}>
            <Text style={styles.title}>My Bookings</Text>
            <FlatList
                data={bookings}
                renderItem={renderBookingTile}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={styles.bookingsList}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    viewBookingsContainer: {
        padding: 20,
        color: 'white',
        alignItems: 'center',
        backgroundColor: '#000', // Adjust to your preference
        flex: 1,
    },
    title: {
        fontSize: 24,
        color: 'white',
        marginBottom: 20,
    },
    bookingsList: {
        alignItems: 'center',
    },
    bookingTile: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        margin: 15,
        padding: 20,
        borderRadius: 12,
        width: 250,
        elevation: 5,
        alignItems: 'flex-start',
    },
    studentName: {
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold',
    },
    bookingDetail: {
        color: 'white',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000', // Adjust to your preference
    },
});

export default ViewBookings;
