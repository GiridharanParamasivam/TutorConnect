// src/components/SignUpPage.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SignUpPage = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sign Up</Text>
            {/* Add your form here */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f9f9f9', // Background color
    },
    title: {
        fontSize: 24,
        marginBottom: 24, // Spacing below the title
        color: '#333', // Title color
    },
});

export default SignUpPage;
