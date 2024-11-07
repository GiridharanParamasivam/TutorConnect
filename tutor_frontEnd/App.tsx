import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginPage from '.././components/LoginPage';
import SignUpPage from '.././components/SignUpPage';
import StudentProfile from '.././components/StudentProfile';
import ProfessorProfile from '.././components/ProfessorProfile';
import ProfessorPublicProfile from '.././components/ProfessorPublicProfile';
import BookingAppointment from '.././components/BookingAppointment';
import ViewBookings from '.././components/ViewBookings'; // Import the new component
import HomePage from './../components/HomePage';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomePage} />
        <Stack.Screen name="Login" component={LoginPage} />
        <Stack.Screen name="Sign Up" component={SignUpPage} />
        <Stack.Screen name="Student Profile" component={StudentProfile} />
        <Stack.Screen name="Professor Profile" component={ProfessorProfile} />
        <Stack.Screen name="Professor Public Profile" component={ProfessorPublicProfile} />
        <Stack.Screen name="Book Appointment" component={BookingAppointment} />
        <Stack.Screen name="View Bookings" component={ViewBookings} /> {/* Add the new route here */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
