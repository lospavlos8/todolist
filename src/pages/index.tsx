import { useState, useEffect } from 'react';

export default function Home() {
    const [tasks, setTasks] = useState<any[]>([]);
    const [inputValue, setInputValue] = useState('');

    const fetchTasks = async (url = '/api/tasks') => {
        const res = await fetch(url);
        const data = await res.json();
        setTasks(data);
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const addTask = async () => {
        if (!inputValue) return;
        await fetch('/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: inputValue }),
        });
        setInputValue('');
        fetchTasks();
    };

    const deleteTask = async (id: number) => {
        await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
        fetchTasks();
    };

    const toggleTask = async (task: any) => {
        await fetch(`/api/tasks/${task.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completed: !task.completed }),
        });
        fetchTasks();
    };

    const editTask = async (task: any) => {
        const newTitle = prompt("Zadej novy nazev:", task.title);
        if (newTitle && newTitle !== task.title) {
            await fetch(`/api/tasks/${task.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: newTitle }),
            });
            fetchTasks();
        }
    };

    const showDetail = async (id: number) => {
        const res = await fetch(`/api/tasks/${id}`);
        const data = await res.json();
        alert(`ID: ${data.id}\nNazev: ${data.title}\nHotovo: ${data.completed}`);
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <h1>Todolist</h1>
            <div style={{ marginBottom: '10px' }}>
                <button onClick={() => fetchTasks('/api/tasks')}>Vse</button>
                <button onClick={() => fetchTasks('/api/tasks?finished=true')}>Hotove</button>
                <button onClick={() => fetchTasks('/api/tasks?finished=false')}>Nehotove</button>
            </div>
            <div>
                <input value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="Zadej ukol..." />
                <button onClick={addTask}>Pridat</button>
            </div>
            <ul>
                {tasks.map(task => (
                    <li key={task.id}>
                        <input type="checkbox" checked={task.completed} onChange={() => toggleTask(task)} />
                        <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
              {task.title}
            </span>
                        <button onClick={() => showDetail(task.id)} style={{ marginLeft: '10px' }}>Detail</button>
                        <button onClick={() => editTask(task)} style={{ marginLeft: '10px' }}>Upravit</button>
                        <button onClick={() => deleteTask(task.id)} style={{ marginLeft: '10px' }}>Smazat</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}