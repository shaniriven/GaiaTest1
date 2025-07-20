import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import CustomTripButton from "../components/CustomTripButton";
import TodoListCard from "../components/TodoListCard";
import { TodoList } from "../types/todo";
import { useUser } from "@clerk/clerk-expo";
import config from "../config";

const COLORS = ["#F8D7DA", "#D6EAF8", "#D4EFDF", "#FCF3CF", "#F5CBA7", "#D2B4DE"];

type Trip = { _id: string; name: string };

const TodoListsScreen: React.FC = () => {
  const { user } = useUser();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTripId, setSelectedTripId] = useState<string>("");
  const [selectedTripName, setSelectedTripName] = useState<string>("");
  const [todoLists, setTodoLists] = useState<TodoList[]>([]);
  const [loading, setLoading] = useState(false);
  const [newListTitle, setNewListTitle] = useState("");
  const [newListColor, setNewListColor] = useState(COLORS[0]);

  // Fetch all trip IDs and names from plans
  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);
    console.log("[FETCH] /user_trips", { user_id: user.id });

    fetch(`${config.api_url}/user_trips?user_id=${user.id}`)
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      })
      .then((data: Trip[]) => {
        console.log("[RESPONSE] /user_trips", data);
        setTrips(data);
        if (data.length > 0) {
          setSelectedTripId(data[0]._id);
          setSelectedTripName(data[0].name);
        }
      })
      .catch((err) => {
        console.error("[ERROR] /user_trips:", err);
        Alert.alert("Failed to fetch trips", err.message);
      })
      .finally(() => setLoading(false));
  }, [user?.id]);

  // Fetch to-do lists
  useEffect(() => {
    if (!selectedTripId || !user?.id) return;
    setLoading(true);
    console.log("[FETCH] /todo_lists", { user_id: user.id, trip_id: selectedTripId });

    fetch(`${config.api_url}/documents/todo_lists?user_id=${user.id}&trip_id=${selectedTripId}`)
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      })
      .then((data) => {
        console.log("[RESPONSE] /todo_lists", data);
        setTodoLists(data);
      })
      .catch((err) => {
        console.error("[ERROR] /todo_lists:", err);
        Alert.alert("Failed to fetch todo lists", err.message);
      })
      .finally(() => setLoading(false));
  }, [selectedTripId, user?.id]);

  // Add new list
  const addNewList = () => {
    if (!newListTitle.trim() || !user?.id || !selectedTripId) return;
    setLoading(true);
    const payload = {
      user_id: user.id,
      trip_id: selectedTripId,
      trip_name: selectedTripName,
      title: newListTitle.trim(),
      color: newListColor,
    };
    console.log("[POST] /todo_list", payload);

    fetch(`${config.api_url}/documents/todo_list`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      })
      .then((data) => {
        console.log("[RESPONSE] /todo_list", data);
        setTodoLists((prev) => [data, ...prev]);
        setNewListTitle("");
        setNewListColor(COLORS[0]);
      })
      .catch((err) => {
        console.error("[ERROR] /todo_list:", err);
        Alert.alert("Failed to add list", err.message);
      })
      .finally(() => setLoading(false));
  };

  // Update list
  const handleUpdateList = (updatedList: TodoList) => {
    setLoading(true);
    const payload = {
      title: updatedList.title,
      color: updatedList.color,
      tasks: updatedList.tasks,
    };
    console.log("[PATCH] /todo_list/" + updatedList.list_id, payload);

    fetch(`${config.api_url}/documents/todo_list/${updatedList.list_id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      })
      .then((data) => {
        console.log("[RESPONSE] /todo_list/" + updatedList.list_id, data);
        setTodoLists((prev) => prev.map((l) => (l.list_id === data.list_id ? data : l)));
      })
      .catch((err) => {
        console.error("[ERROR] PATCH:", err);
        Alert.alert("Failed to update list", err.message);
      })
      .finally(() => setLoading(false));
  };

  // Delete list
  const handleDeleteList = (listId: string) => {
    setLoading(true);
    console.log("[DELETE] /todo_list/" + listId);

    fetch(`${config.api_url}/documents/todo_list/${listId}`, { method: "DELETE" })
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      })
      .then((data) => {
        console.log("[RESPONSE] /todo_list/" + listId, data);
        setTodoLists((prev) => prev.filter((l) => l.list_id !== listId));
      })
      .catch((err) => {
        console.error("[ERROR] DELETE:", err);
        Alert.alert("Failed to delete list", err.message);
      })
      .finally(() => setLoading(false));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>to do lists</Text>

      {/* Trip Selector */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tripSelector}
        contentContainerStyle={styles.tripSelectorContent}
      >
        {trips.map((trip, index) => (
          <View key={trip._id || `trip-${index}`} style={styles.tripButtonWrapper}>
            <CustomTripButton
              title={trip.name || trip._id}
              onPress={() => {
                setSelectedTripId(trip._id);
                setSelectedTripName(trip.name);
              }}
              pastTripButton={selectedTripId === trip._id}
              className={selectedTripId === trip._id ? "bg-black" : ""}
              textClassName={selectedTripId === trip._id ? "text-white" : "text-black"}
            />
          </View>
        ))}
      </ScrollView>

      {/* Add New List */}
      <View style={styles.addListContainer}>
        <TextInput
          value={newListTitle}
          onChangeText={setNewListTitle}
          placeholder="choose title"
          style={styles.addListInput}
        />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.colorPicker}>
          {COLORS.map((color) => (
            <TouchableOpacity
              key={color}
              style={[
                styles.colorSwatch,
                {
                  backgroundColor: color,
                  borderWidth: newListColor === color ? 2 : 0,
                },
              ]}
              onPress={() => setNewListColor(color)}
            />
          ))}
        </ScrollView>
        <TouchableOpacity onPress={addNewList} style={styles.addListButton}>
          <Text style={{ color: "#fff", fontWeight: "700" }}>Add</Text>
        </TouchableOpacity>
      </View>

      {/* Todo Lists */}
      {loading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={todoLists}
          keyExtractor={(item) => item.list_id.toString()}
          renderItem={({ item }) => (
            <View style={styles.todoListCardWrapper}>
              <TodoListCard
                list={item}
                onUpdate={handleUpdateList}
                onDelete={() => handleDeleteList(item.list_id)}
              />
            </View>
          )}
          contentContainerStyle={styles.listsContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  header: { fontSize: 22, fontWeight: "700", textAlign: "center", marginVertical: 10 },
  tripSelector: { marginBottom: 12, maxHeight: 48 },
  tripSelectorContent: { alignItems: "center", paddingHorizontal: 4 },
  tripButtonWrapper: {
    marginRight: 10,
    minWidth: 80,
  },
  listsContainer: { paddingBottom: 100, paddingTop: 8 },
  todoListCardWrapper: {
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    borderRadius: 16,
    backgroundColor: "#fff",
    marginHorizontal: 2,
  },
  addListContainer: {
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 12,
    marginBottom: 18,
    marginTop: 8,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  addListInput: {
    borderColor: "#49735A",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 38,
    marginBottom: 8,
    backgroundColor: "#fff",
  },
  colorPicker: {
    flexDirection: "row",
    marginBottom: 8,
  },
  colorSwatch: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 8,
    borderColor: "#49735A",
  },
  addListButton: {
    backgroundColor: "#49735A",
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: "center",
    marginTop: 4,
  },
});

export default TodoListsScreen;
