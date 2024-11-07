import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';
import StudentProfile from './components/StudentProfile';
import ProfessorProfile from './components/ProfessorProfile';
import ProfessorPublicProfile from './components/ProfessorPublicProfile';
import BookingAppointment from './components/BookingAppointment';
import ViewBookings from './components/ViewBookings'; // Import the new component

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="HomePage">
        <Stack.Screen name="Home" component={HomePage} />
        <Stack.Screen name="Login" component={LoginPage} />
        <Stack.Screen name="Sign Up" component={SignUpPage} />
        <Stack.Screen name="StudentProfile" component={StudentProfile} />
        <Stack.Screen name="ProfessorProfile" component={ProfessorProfile} />
        <Stack.Screen name="ProfessorPublicProfile" component={ProfessorPublicProfile} />
        <Stack.Screen name="BookAppointment" component={BookingAppointment} />
        {/* <Stack.Screen name="ViewBookings" component={ViewBookings} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
