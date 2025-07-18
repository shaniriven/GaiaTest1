import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Alert
} from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import config from '../config';

const api_url = config.api_url;

type Trip = { name: string; _id: string };
type Task = { id: string; text: string; done: boolean };

const TodoLists = () => {
  const { user } = useUser();
  const userId = user?.id;

  const [tripOptions, setTripOptions] = useState<Trip[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<string>('');
  const [selectedTripId, setSelectedTripId] = useState<string>('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [listId, setListId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [listExists, setListExists] = useState(false);

  useEffect(() => {
    if (userId) fetchUserTrips(userId);
  }, [userId]);

  useEffect(() => {
    if (userId && selectedTrip) fetchTodoList(userId, selectedTrip);
  }, [selectedTrip]);

  const fetchUserTrips = async (userId: string) => {
    try {
      const res = await fetch(`${api_url}/user_trips?user_id=${userId}`);
      const data = await res.json();
      setTripOptions(data);
      if (data.length > 0) {
        setSelectedTrip(data[0].name);
        setSelectedTripId(data[0]._id);
      }
    } catch {
      Alert.alert('Error', 'Could not fetch trips.');
    }
  };

  const fetchTodoList = async (userId: string, tripName: string) => {
    try {
      const res = await fetch(`${api_url}/todo_list?user_id=${userId}&trip_name=${encodeURIComponent(tripName)}`);
      const data = await res.json();
      if (data.exists) {
        const patchedTasks = data.tasks.map((t: any) =>
          t.id ? t : { ...t, id: Date.now().toString() + Math.random() }
        );
        setTasks(patchedTasks);
        setListId(data.list_id);
        setListExists(true);
      } else {
        setTasks([]);
        setListId(null);
        setListExists(false);
      }
    } catch {
      Alert.alert('Error', 'Could not load list.');
    }
  };

  const createNewList = async () => {
    const tripObj = tripOptions.find(t => t.name === selectedTrip);
    const tripId = tripObj?._id || selectedTripId;
    const newListId = Date.now().toString();

    const body = {
      user_id: userId,
      trip_id: tripId,
      trip_name: selectedTrip,
      list_id: newListId,
    };

    try {
      const response = await fetch(`${api_url}/todo_list`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      setListId(data.list_id);
      setTasks([]);
      setListExists(true);
    } catch {
      Alert.alert('Error', 'Failed to create list.');
    }
  };

  const updateList = async (updatedTasks: Task[]) => {
    if (!listId) return;
    try {
      const res = await fetch(`${api_url}/todo_list`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ list_id: listId, tasks: updatedTasks }),
      });
      const result = await res.json();
      if (result.message.includes('deleted')) {
        setTasks([]);
        setListId(null);
        setListExists(false);
        Alert.alert('Info', 'All tasks completed. List deleted.');
      }
    } catch {
      Alert.alert('Error', 'Could not update list.');
    }
  };

  const addTask = () => {
    if (!input.trim()) return;
    const newTask = {
      id: Date.now().toString() + Math.random(),
      text: input.trim(),
      done: true,
    };
    const newTasks = [...tasks, newTask];
    setTasks(newTasks);
    setInput('');
    updateList(newTasks);
  };

  const toggleTask = (id: string) => {
    const newTasks = tasks.map(task =>
      task.id === id ? { ...task, done: !task.done } : task
    );
    setTasks(newTasks);
    updateList(newTasks);
  };

  const removeTask = (id: string) => {
    const newTasks = tasks.filter(task => task.id !== id);
    setTasks(newTasks);
    updateList(newTasks);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>To-Do Lists</Text>

      <FlatList
        horizontal
        data={tripOptions}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.tripButton,
              item.name === selectedTrip && styles.tripSelected,
            ]}
            onPress={() => {
              setSelectedTrip(item.name);
              setSelectedTripId(item._id);
            }}
          >
            <Text style={item.name === selectedTrip ? styles.tripTextSelected : styles.tripText}>
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
        style={{ marginBottom: 20 }}
        showsHorizontalScrollIndicator={false}
      />

      {!listExists ? (
        <TouchableOpacity style={styles.createBtn} onPress={createNewList}>
          <Text style={styles.createBtnText}>Create New List</Text>
        </TouchableOpacity>
      ) : (
        <>
          <View style={styles.inputContainer}>
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Add a task"
              style={styles.input}
            />
            <TouchableOpacity onPress={addTask} style={styles.addButton}>
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={tasks}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => toggleTask(item.id)}
                onLongPress={() => removeTask(item.id)}
                style={[styles.todoItem, item.done === false && styles.todoItemDone]}
              >
                <Text style={[styles.todoText, item.done === false && styles.todoTextDone]}>
                  {item.text}
                </Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={<Text style={styles.empty}>No tasks yet.</Text>}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, paddingHorizontal: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: '600', marginBottom: 10, textAlign: 'center' },
  tripButton: {
    backgroundColor: '#eee', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginRight: 10,
  },
  tripSelected: { backgroundColor: '#49735A' },
  tripText: { color: '#000' },
  tripTextSelected: { color: '#fff', fontWeight: 'bold' },
  createBtn: {
    backgroundColor: '#49735A', padding: 14, borderRadius: 10, alignItems: 'center', marginBottom: 20,
  },
  createBtnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  inputContainer: { flexDirection: 'row', marginBottom: 20 },
  input: {
    flex: 1, borderColor: '#49735A', borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, height: 40,
  },
  addButton: {
    backgroundColor: '#49735A', marginLeft: 10, paddingHorizontal: 16, borderRadius: 8, justifyContent: 'center',
  },
  addButtonText: { color: '#fff', fontWeight: '600' },
  todoItem: {
    padding: 12, backgroundColor: '#F0F0F0', borderRadius: 8, marginBottom: 10,
  },
  todoItemDone: { backgroundColor: '#C9EACD' },
  todoText: { fontSize: 16 },
  todoTextDone: { textDecorationLine: 'line-through', color: '#888' },
  empty: { textAlign: 'center', color: '#aaa', marginTop: 20 },
});

export default TodoLists;
