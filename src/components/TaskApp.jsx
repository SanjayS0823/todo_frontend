import { useEffect, useState } from 'react';
import { api } from '../services/api';

export default function TaskApp() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

const fetchTasks = async () => {
  try {
    const res = await api.get('/');
    console.log('✅ API Response:', res.data); // 👈 check what you get
    setTasks(Array.isArray(res.data) ? res.data : []); // 👈 safety check
  } catch (err) {
    console.error('❌ Error fetching tasks:', err);
    setTasks([]);
  }
};


  useEffect(() => {
    fetchTasks();
  }, []);

const addTask = async (e) => {
  e.preventDefault();
  try {
    console.log("📤 Sending:", { title }); // check what’s being sent
    const res = await api.post('/', { title });
    console.log("✅ Added:", res.data);
    setTasks([res.data, ...tasks]);
    setTitle('');
  } catch (err) {
    console.error("❌ Error adding task:", err);
  }
};



  const toggle = async (id) => {
    try {
      const task = tasks.find(t => t._id === id);
      const res = await api.put(`/${id}`, { completed: !task.completed });
      setTasks(tasks.map(t => t._id === id ? res.data : t));
    } catch (err) {
      console.error('Error toggling task:', err);
    }
  };

  const del = async (id) => {
    try {
      await api.delete(`/${id}`);
      setTasks(tasks.filter(t => t._id !== id));
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  const startEdit = (id, currentTitle) => {
    setEditingId(id);
    setEditTitle(currentTitle);
  };

  const saveEdit = async (id) => {
    try {
      const res = await api.put(`/${id}`, { title: editTitle }); // ✅ match backend field
      setTasks(tasks.map(t => t._id === id ? res.data : t));
      setEditingId(null);
      setEditTitle('');
    } catch (err) {
      console.error('Error saving edit:', err);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: 'auto' }}>
      <h1>To-Do List</h1>

      {/* Add Task */}
      <form onSubmit={addTask}>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="New task..."
          required
        />
        <button type="submit">Add</button>
      </form>

      {/* Task List */}
      <ul>
        {tasks.map(t => (
          <li key={t._id}>
            <input
              type="checkbox"
              checked={t.completed}
              onChange={() => toggle(t._id)}
            />

            {editingId === t._id ? (
              <>
                <input
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                />
                <button onClick={() => saveEdit(t._id)}>Save</button>
              </>
            ) : (
              <>
                <span style={{ textDecoration: t.completed ? 'line-through' : '' }}>
                  {t.title} {/* ✅ corrected from t.text */}
                </span>
                <button onClick={() => startEdit(t._id, t.title)}>EDIT</button>
              </>
            )}
            <button onClick={() => del(t._id)}>DELETE</button>
          </li>
        ))}
      </ul>
    </div>
  );
}