import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Modal, Button, Alert, StyleSheet } from 'react-native';

const BookingAppointment = () => {
    const [professors, setProfessors] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedProfessor, setSelectedProfessor] = useState(null);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [showModal, setShowModal] = useState(false);

    const fetchProfessors = async (query = '') => {
        try {
            const token = await AsyncStorage.getItem('token'); // using AsyncStorage to get token
            const response = await fetch(`http://10.0.2.2:5000/list_professors?query=${query}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await response.json();
            if (response.ok) {
                setProfessors(data);
            } else {
                console.error('Error fetching professors:', data.message);
            }
        } catch (error) {
            console.error('Error fetching professors:', error);
        }
    };

    useEffect(() => {
        fetchProfessors();
    }, []);

    const handleSearchChange = (text) => {
        setSearchQuery(text);
        fetchProfessors(text);
    };

    const openModal = async (professor) => {
        setSelectedProfessor(professor);
        setShowModal(true);

        if (selectedDate) {
            const response = await fetch(`http://10.0.2.2:5000/get_time_slots/${professor.id}?date=${selectedDate}`);
            const data = await response.json();
            setAvailableSlots(data);
        }
    };

    const handleDateChange = async (date) => {
        setSelectedDate(date);
        if (selectedProfessor) {
            const response = await fetch(`http://10.0.2.2:5000/get_time_slots/${selectedProfessor.id}?date=${date}`);
            const data = await response.json();
            setAvailableSlots(data);
        }
    };

    const bookAppointment = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await fetch('http://10.0.2.2:5000/book_appointment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    professor_id: selectedProfessor.id,
                    date: selectedDate,
                    time: selectedSlot,
                }),
            });

            const data = await response.json();
            console.log(data)
            if (response.ok) {
                Alert.alert("Success", "Appointment booked successfully!");
                setShowModal(false);
            } else {
                console.error('Error booking appointment:', data.message);
            }
        } catch (error) {
            Alert.alert("Success", "Appointment booked successfully!"+error);
            console.error('Error booking appointment:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Book an Appointment</Text>
            <TextInput
                style={styles.searchInput}
                placeholder="Search by subject..."
                value={searchQuery}
                onChangeText={handleSearchChange}
            />
            <FlatList
                data={professors}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.professorCard}>
                        <Text style={styles.professorName}>{item.name}</Text>
                        <Text>Department: {item.department}</Text>
                        <Text>Subjects: {item.subjects}</Text>
                        <Text>
                            Average Rating: {item.average_rating !== undefined ? item.average_rating.toFixed(1) : 'N/A'} / 5
                        </Text>
                        <TouchableOpacity style={styles.bookButton} onPress={() => openModal(item)}>
                            <Text style={styles.bookButtonText}>Book Now</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />


            <Modal visible={showModal} transparent={true} animationType="slide">
                <View style={styles.modalBackground}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Book Appointment with {selectedProfessor?.name}</Text>
                        <Text>Select a date:</Text>
                        <TextInput
                            style={styles.dateInput}
                            placeholder="YYYY-MM-DD"
                            value={selectedDate}
                            onChangeText={handleDateChange}
                        />
                        <Text>Select a time slot:</Text>
                        <FlatList
                            data={availableSlots}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity onPress={() => setSelectedSlot(item.time)}>
                                    <Text style={selectedSlot === item.time ? styles.selectedSlot : styles.slot}>
                                        {item.time}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        />
                        <Button title="Confirm Booking" onPress={bookAppointment} />
                        <Button title="Cancel" onPress={() => setShowModal(false)} />
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        color: '#8B0000',
        marginBottom: 20,
        textAlign: 'center',
    },
    searchInput: {
        height: 40,
        borderColor: '#8B0000',
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 10,
        marginBottom: 20,
        textAlign: 'center',
    },
    professorCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        marginBottom: 15,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
    },
    professorName: {
        fontSize: 18,
        color: '#8B0000',
    },
    bookButton: {
        backgroundColor: '#8B0000',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 10,
    },
    bookButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        color: '#8B0000',
        marginBottom: 20,
    },
    dateInput: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        width: '100%',
        paddingHorizontal: 10,
        marginBottom: 15,
        textAlign: 'center',
    },
    slot: {
        padding: 10,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginVertical: 5,
        textAlign: 'center',
    },
    selectedSlot: {
        padding: 10,
        borderColor: '#8B0000',
        borderWidth: 1,
        borderRadius: 5,
        marginVertical: 5,
        backgroundColor: '#8B0000',
        color: '#fff',
        textAlign: 'center',
    },
});

export default BookingAppointment;
