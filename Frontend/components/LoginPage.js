// src/components/LoginPage.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const LoginPage = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            {/* Add your form here */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0', // Optional: set a background color
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
});

export default LoginPage;
