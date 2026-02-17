import { useState, useEffect } from 'react';

export default function Home() {
    const [tasks, setTasks] = useState<any[]>([]);

    const fetchTasks = async () => {
        const res = await fetch('/api/tasks');
        const data = await res.json();
        setTasks(data);
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <h1>Todolist</h1>
            <ul>
                {tasks.map(task => (
                    <li key={task.id}>
                        {task.title}
                    </li>
                ))}
            </ul>
        </div>
    );
}