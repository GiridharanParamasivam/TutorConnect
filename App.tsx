import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';
import StudentProfile from './components/StudentProfile';
import ProfessorProfile from './components/ProfessorProfile';
import ProfessorPublicProfile from './components/ProfessorPublicProfile';
import BookingAppointment from './components/BookingAppointment';
import ViewBookings from './components/ViewBookings';
import RecentViews from './components/RecentViews';
import StudentDetails from './components/StudentDetails';

const Stack = createNativeStackNavigator();

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkSession = async () => {
            try {
                const session = await AsyncStorage.getItem('userSession');
                if (session) {
                    console.log(session);
                    const { role } = JSON.parse(session);
                    setIsLoggedIn(true);
                    setUserRole(role);
                }
            } catch (error) {
                console.error('Error checking session:', error);
            }
            setLoading(false);
        };
        checkSession();
    }, []);

    if (loading) {
        return null; // Optional: Add a splash/loading screen here
    }

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName={isLoggedIn ? (userRole === 'student' ? 'StudentProfile' : 'ProfessorProfile') : 'Home'}>
                <Stack.Screen name="Home" component={HomePage} />
                <Stack.Screen name="Login" component={LoginPage} />
                <Stack.Screen name="Sign Up" component={SignUpPage} />
                <Stack.Screen name="StudentProfile" component={StudentProfile} />
                <Stack.Screen name="ProfessorProfile" component={ProfessorProfile} />
                <Stack.Screen name="ProfessorPublicProfile" component={ProfessorPublicProfile} />
                <Stack.Screen name="BookAppointment" component={BookingAppointment} />
                <Stack.Screen name="ViewBookings" component={ViewBookings} />
                <Stack.Screen name="RecentViews" component={RecentViews} />
                <Stack.Screen name="StudentDetails" component={StudentDetails} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default App;
