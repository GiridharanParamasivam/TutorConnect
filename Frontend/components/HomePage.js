import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import SignUpModal from './SignUpModal';
import LoginModal from './LoginModal';
import SearchBar from './SearchBar'; // Ensure SearchBar is compatible with React Native
import ViewingHistory from './ViewingHistory';

const HomePage = () => {
    const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    const openSignUpModal = () => setIsSignUpModalOpen(true);
    const closeSignUpModal = () => setIsSignUpModalOpen(false);

    const openLoginModal = () => setIsLoginModalOpen(true);
    const closeLoginModal = () => setIsLoginModalOpen(false);

    return (
        <View style={styles.homepage}>
            <View style={styles.navbar}>
                <Text style={styles.logo}>Tutor Connect</Text>
                <View style={styles.buttons}>
                    <TouchableOpacity onPress={openLoginModal} style={styles.button}>
                        <Text style={styles.buttonText}>Log In</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={openSignUpModal} style={styles.button}>
                        <Text style={styles.buttonText}>Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.mainContent}>
                <Text style={styles.heading}>Enter your Subject to get started</Text>
                <SearchBar /> {/* Add the SearchBar component here */}
                <TouchableOpacity>
                    <Text style={styles.linkText}>I'd like to look up a professor by name</Text>
                </TouchableOpacity>
            </View>
            {/* <View style={styles.viewingHistoryContainer}>
                <ViewingHistory />
            </View> */}
            {/* Modals for Sign Up and Log In */}
            <Modal visible={isSignUpModalOpen} transparent={true} animationType="slide">
                <SignUpModal closeModal={closeSignUpModal} />
            </Modal>
            <Modal visible={isLoginModalOpen} transparent={true} animationType="slide">
                <LoginModal closeModal={closeLoginModal} />
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    homepage: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    },
    navbar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#8B0000',
    },
    logo: {
        fontSize: 24,
        color: 'white',
        fontWeight: 'bold',
    },
    buttons: {
        flexDirection: 'row',
    },
    button: {
        backgroundColor: 'white',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 5,
        marginLeft: 10,
    },
    buttonText: {
        color: '#8B0000',
        fontWeight: 'bold',
    },
    mainContent: {
        alignItems: 'center',
        padding: 20,
    },
    heading: {
        fontSize: 20,
        color: '#8B0000',
        marginBottom: 15,
        textAlign: 'center',
    },
    linkText: {
        color: '#8B0000',
        textDecorationLine: 'underline',
        marginTop: 20,
    },
});

export default HomePage;
