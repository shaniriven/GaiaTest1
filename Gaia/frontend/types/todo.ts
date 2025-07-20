export type Task = {
  id: string;
  text: string;
  done: boolean;
};

export type TodoList = {
  list_id: string;
  trip_id: string;
  user_id: string;
  title: string;
  color: string;
  tasks: Task[];
};

export type Trip = {
  _id: string;
  name: string;
  // add other fields as needed
}; 