// frontend/src/screens/SearchScreen.tsx
import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import config from "../../../../config";
const api_url = config.api_url;

const SearchScreen = () => {
  const [userName, setUserName] = useState("");
  const [startDate, setStartDate] = useState("2025-01-01");
  const [endDate, setEndDate] = useState("2025-01-05");
  const [destination, setDestination] = useState("");
  const [hobbiesInput, setHobbiesInput] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    // Convert comma-separated hobbies to an array.
    const hobbies = hobbiesInput
      .split(",")
      .map((hobby) => hobby.trim())
      .filter(Boolean);
    if (!destination || !userName) {
      Alert.alert("Please enter both a destination and your name.");
      return;
    }
    setLoading(true);
    const payload = {
      user_name: userName, // New field
      start_date: startDate,
      end_date: endDate,
      destination,
      hobbies,
    };

    try {
      const url = `${api_url}/trip/newTrip/`;
      console.log(url);
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error during fetch:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Your Name:</Text>
      <TextInput
        style={styles.input}
        value={userName}
        onChangeText={setUserName}
        placeholder="John Doe"
      />

      <Text style={styles.label}>Start Date (YYYY-MM-DD):</Text>
      <TextInput
        style={styles.input}
        value={startDate}
        onChangeText={setStartDate}
        placeholder="2025-01-01"
      />

      <Text style={styles.label}>End Date (YYYY-MM-DD):</Text>
      <TextInput
        style={styles.input}
        value={endDate}
        onChangeText={setEndDate}
        placeholder="2025-01-05"
      />

      <Text style={styles.label}>Destination:</Text>
      <TextInput
        style={styles.input}
        value={destination}
        onChangeText={setDestination}
        placeholder="Berlin"
      />

      <Text style={styles.label}>Hobbies (comma-separated):</Text>
      <TextInput
        style={styles.input}
        value={hobbiesInput}
        onChangeText={setHobbiesInput}
        placeholder="art, museum, cafes"
      />

      <Button title="Plan Trip" onPress={handleSearch} disabled={loading} />

      {loading && <Text>Loading...</Text>}
      {result && (
        <View style={styles.resultContainer}>
          <Text>Result:</Text>
          <Text>{JSON.stringify(result, null, 2)}</Text>
        </View>
      )}
    </View>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: "#fff",
  },
  label: {
    marginTop: 10,
    fontWeight: "bold",
  },
  input: {
    height: 40,
    borderColor: "#aaa",
    borderWidth: 1,
    paddingHorizontal: 10,
    marginTop: 5,
  },
  resultContainer: {
    marginTop: 20,
  },
});