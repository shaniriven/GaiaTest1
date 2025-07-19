import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList } from "react-native";
import { TodoList, Task } from "../types/todo";
import { Ionicons } from "@expo/vector-icons";

interface TodoListCardProps {
  list: TodoList;
  onUpdate: (updatedList: TodoList) => void;
  onDelete: () => void;
}

const TodoListCard: React.FC<TodoListCardProps> = ({ list, onUpdate, onDelete }) => {
  const [input, setInput] = useState("");

  const addTask = () => {
    if (!input.trim()) return;
    const newTask: Task = {
      id: Date.now().toString(),
      text: input.trim(),
      done: false,
    };
    onUpdate({ ...list, tasks: [...list.tasks, newTask] });
    setInput("");
  };

  const toggleTask = (id: string) => {
    onUpdate({
      ...list,
      tasks: list.tasks.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      ),
    });
  };

  const removeTask = (id: string) => {
    onUpdate({ ...list, tasks: list.tasks.filter((task) => task.id !== id) });
  };

  return (
    <View style={[styles.card, { backgroundColor: list.color }]}> 
      <View style={styles.headerRow}>
        <Text style={styles.title}>{list.title}</Text>
        <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
          <Ionicons name="trash-outline" size={20} color="#888" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={list.tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskRow}>
            <TouchableOpacity onPress={() => toggleTask(item.id)}>
              <Ionicons
                name={item.done ? "checkbox-outline" : "square-outline"}
                size={22}
                color={item.done ? "#49735A" : "#888"}
              />
            </TouchableOpacity>
            <Text style={[styles.taskText, item.done && styles.taskTextDone]}>{item.text}</Text>
            <TouchableOpacity onPress={() => removeTask(item.id)}>
              <Ionicons name="close" size={18} color="#888" />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No tasks yet.</Text>}
      />
      <View style={styles.inputRow}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Add a new task"
          style={styles.input}
        />
        <TouchableOpacity onPress={addTask} style={styles.addButton}>
          <Ionicons name="add" size={22} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    marginBottom: 8,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
  },
  deleteButton: {
    padding: 4,
  },
  taskRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  taskText: {
    fontSize: 16,
    marginLeft: 8,
    flex: 1,
  },
  taskTextDone: {
    textDecorationLine: "line-through",
    color: "#888",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  input: {
    flex: 1,
    borderColor: "#49735A",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 38,
    backgroundColor: "#fff",
  },
  addButton: {
    backgroundColor: "#49735A",
    marginLeft: 8,
    padding: 8,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  empty: {
    textAlign: "center",
    color: "#aaa",
    marginTop: 10,
  },
});

export default TodoListCard; 