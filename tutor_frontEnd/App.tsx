import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginPage from '.././components/LoginPage';
import SignUpPage from '.././components/SignUpPage';
import StudentProfile from '.././components/StudentProfile';
import ProfessorProfile from '.././components/ProfessorProfile';
import ProfessorPublicProfile from '.././components/ProfessorPublicProfile';
import BookingAppointment from '.././components/BookingAppointment';
import ViewBookings from '.././components/ViewBookings'; // Import the new component
import HomePage from '.././components/HomePage';
import RecentViews from '.././components/RecentViews';
import ProfessorDetails from '.././components/ProfessorDetails';
import Recommendations from '.././components/Recommendations';
import AddComments from '.././components/AddComments'

const Stack = createNativeStackNavigator();

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        setIsLoggedIn(!!token); // If token exists, set isLoggedIn to true
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setLoading(false); // Stop loading once the check is done
      }
    };

    checkSession();
  }, []);

  if (loading) {
    // Optional: Add a splash or loading screen here
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={isLoggedIn ? 'Student Profile' : 'Login'} // Direct to the profile if logged in
        screenOptions={{
          headerStyle: {
            backgroundColor: '#6200ea', // Example: A purple header
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen name="Home" component={HomePage} />
        <Stack.Screen name="Login" component={LoginPage} />
        <Stack.Screen name="Sign Up" component={SignUpPage} />
        <Stack.Screen name="Student Profile" component={StudentProfile} />
        <Stack.Screen name="Recommendations" component={Recommendations} />
        <Stack.Screen name="Professor Profile" component={ProfessorProfile} />
        <Stack.Screen name="Professor Public Profile" component={ProfessorPublicProfile} />
        <Stack.Screen name="Book Appointment" component={BookingAppointment} />
        <Stack.Screen name="View Bookings" component={ViewBookings} />
        <Stack.Screen name="RecentViews" component={RecentViews} />
        <Stack.Screen name="ProfessorDetails" component={ProfessorDetails} />
        <Stack.Screen name="AddComments" component={AddComments} />
        </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
