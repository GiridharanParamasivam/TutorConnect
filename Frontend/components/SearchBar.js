import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SearchBar = () => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchSuggestions = async () => {
            console.log("Current query:", query);  // Check the value of query here
    
            if (query.length > 1) {
                try {
                    const response = await fetch(`http://10.0.2.2:5000/search_professor?query=${query}`);
                    
                    if (!response.ok) {
                        console.error('Error response:', response);
                        Alert.alert('Error', 'Failed to fetch suggestions');
                        return;
                    }
                    
                    const data = await response.json();
                    console.log("Response data:", data);  // Log the received data to confirm it's what you expect
                    setSuggestions(data);
                } catch (error) {
                    console.error('Network error fetching suggestions:', error);
                    Alert.alert('Error', 'Network error occurred. Please check your connection.');
                }
            } else {
                setSuggestions([]);
            }
        };
    
        fetchSuggestions();
    }, [query]);
    

    const handleSuggestionClick = (suggestion) => {
        console.log("Navigating to ProfessorPublicProfile with ID:", suggestion.id);
        setQuery(suggestion.name); // Fill the search bar with the selected name
        setSuggestions([]); // Clear suggestions
        navigation.navigate('ProfessorPublicProfile', { professorId: suggestion.id });
    };

    return (
        <View style={styles.searchBar}>
            <TextInput
                placeholder="Search professor"
                value={query}
                onChangeText={(text) => setQuery(text)}
                style={styles.searchInput}
            />
            {suggestions.length > 0 && (
                <FlatList
                    data={suggestions}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => handleSuggestionClick(item)}>
                            <Text style={styles.suggestionItem}>
                                {item.name} - {item.department} ({item.subjects})
                            </Text>
                        </TouchableOpacity>
                    )}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    searchBar: {
        padding: 10,
    },
    searchInput: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        paddingLeft: 8,
        borderRadius: 5,
    },
    suggestionItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
});

export default SearchBar;
