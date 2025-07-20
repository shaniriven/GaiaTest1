import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import config from '../config';

const api_url = config.api_url;

const TodoLists = () => {
  const { user } = useUser();
  const userId = user?.id;

  const [trips, setTrips] = useState<any[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<any>(null);
  const [tasks, setTasks] = useState<{ text: string; done: boolean }[]>([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    if (userId) fetchUserTrips();
  }, [userId]);

  useEffect(() => {
    if (userId && selectedTrip?._id) fetchTasks();
  }, [selectedTrip]);

  const fetchUserTrips = async () => {
    try {
      const res = await fetch(`${api_url}/documents/todo/plans?creator=${userId}`);
      const data = await res.json();
      console.log("Trip data:", data);
      setTrips(data);
      if (data.length > 0) setSelectedTrip(data[0]);
    } catch {
      Alert.alert('Error', 'Could not fetch trips.');
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await fetch(`${api_url}/documents/todo/todos?user_id=${userId}&trip_id=${selectedTrip._id}`);
      const data = await res.json();
      setTasks(data.tasks || []);
    } catch {
      Alert.alert('Error', 'Could not fetch tasks.');
    }
  };

  const addTask = async () => {
    if (!input.trim()) return;
    try {
      // Try to add task
      const res = await fetch(`${api_url}/documents/todo/add_task`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creator: userId,
          trip_id: selectedTrip._id,
          task: input.trim(),
        }),
      });
  
      // If list doesn't exist, create it
      if (res.status === 404) {
        await fetch(`${api_url}/documents/todo/create`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            creator: userId,
            trip_id: selectedTrip._id,
            task: input.trim(),
          }),
        });
      }
  
      // Try adding the task again
      const retry = await fetch(`${api_url}/documents/todo/add_task`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creator: userId,
          trip_id: selectedTrip._id,
          task: input.trim(),
        }),
      });
  
      const result = await retry.json();
      if (retry.ok) {
        setTasks((prev) => [...prev, { text: input.trim(), done: false }]);
        setInput('');
      } else {
        Alert.alert('Error', result.message);
      }
    } catch {
      Alert.alert('Error', 'Could not add task.');
    }
  };
  

  const toggleTask = async (taskText: string) => {
    try {
      const updated = tasks.map((t) =>
        t.text === taskText ? { ...t, done: !t.done } : t
      );
      setTasks(updated);

      await fetch(`${api_url}/documents/todo/complete_task`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creator: userId,
          trip_id: selectedTrip._id,
          task: taskText,
        }),
      });

      const allDone = updated.every((t) => t.done);
      if (allDone) {
        Alert.alert('All tasks done!', 'Do you want to delete the list?', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Yes', onPress: () => deleteTodoList() },
        ]);
      }
    } catch {
      Alert.alert('Error', 'Could not update task.');
    }
  };

  const deleteTodoList = async () => {
    try {
      await fetch(`${api_url}/documents/todo/delete_list`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creator: userId,
          trip_id: selectedTrip._id,
        }),
      });
      setTasks([]);
    } catch {
      Alert.alert('Error', 'Could not delete list.');
    }
  };

  const removeTask = async (taskText: string) => {
    try {
      const updated = tasks.filter((t) => t.text !== taskText);
      setTasks(updated);

      await fetch(`${api_url}/documents/todo/delete_task`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creator: userId,
          trip_id: selectedTrip._id,
          task: taskText,
        }),
      });
    } catch {
      Alert.alert('Error', 'Could not remove task.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trip To-Do Lists</Text>

      <ScrollView horizontal style={styles.tripSelector} showsHorizontalScrollIndicator={false}>
        {trips.map((trip: any) => (
          <TouchableOpacity
            key={trip._id}
            style={[
              styles.tripChip,
              selectedTrip?._id === trip._id && styles.tripChipSelected,
            ]}
            onPress={() => setSelectedTrip(trip)}
          >
            <Text
              style={
                selectedTrip?._id === trip._id
                  ? styles.tripTextSelected
                  : styles.tripText
              }
            >
              {trip.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Add a new task"
          style={styles.input}
        />
        <TouchableOpacity onPress={addTask} style={styles.addButton}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.text}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => toggleTask(item.text)}
            onLongPress={() => removeTask(item.text)}
            style={[
              styles.todoItem,
              item.done && styles.todoItemDone,
            ]}
          >
            <Text
              style={[
                styles.todoText,
                item.done && styles.todoTextDone,
              ]}
            >
              {item.text}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No tasks yet.</Text>
        }
      />

      <Text style={styles.tipText}>Long press a task to delete it.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, paddingHorizontal: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: '600', marginBottom: 20, textAlign: 'center' },
  tripSelector: { flexGrow: 0, marginBottom: 10 },
  tripChip: {
    backgroundColor: '#eee', borderRadius: 25, paddingHorizontal: 16, paddingVertical: 8, marginRight: 10,
  },
  tripChipSelected: { backgroundColor: '#49735A' },
  tripText: { color: '#000' },
  tripTextSelected: { color: '#fff', fontWeight: '600' },
  inputContainer: { flexDirection: 'row', marginBottom: 20 },
  input: { flex: 1, borderColor: '#49735A', borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, height: 40 },
  addButton: { backgroundColor: '#49735A', marginLeft: 10, paddingHorizontal: 16, borderRadius: 8, justifyContent: 'center' },
  addButtonText: { color: '#fff', fontWeight: '600' },
  todoItem: { padding: 12, backgroundColor: '#F0F0F0', borderRadius: 8, marginBottom: 10 },
  todoItemDone: { backgroundColor: '#C9EACD' },
  todoText: { fontSize: 16 },
  todoTextDone: { textDecorationLine: 'line-through', color: '#888' },
  empty: { textAlign: 'center', color: '#aaa', marginTop: 20 },
  tipText: { textAlign: 'center', fontSize: 12, color: '#666', marginTop: 10 },
});

export default TodoLists;
