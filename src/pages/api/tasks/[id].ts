import { promises as fs } from 'fs';
import path from 'path';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const dataPath = path.join(process.cwd(), 'data', 'tasks.json');
    const taskId = Number(req.query.id);
    const fileContents = await fs.readFile(dataPath, 'utf8');
    let tasks = JSON.parse(fileContents);
    const taskIndex = tasks.findIndex((t: any) => t.id === taskId);

    if (taskIndex === -1) {
        return res.status(404).json({ error: 'Nenalezeno' });
    }

    if (req.method === 'GET') {
        res.status(200).json(tasks[taskIndex]);
    } else if (req.method === 'DELETE') {
        tasks = tasks.filter((t: any) => t.id !== taskId);
        await fs.writeFile(dataPath, JSON.stringify(tasks, null, 2));
        res.status(200).json({ message: 'Smazano' });
    } else if (req.method === 'PUT') {
        tasks[taskIndex] = { ...tasks[taskIndex], ...req.body };
        await fs.writeFile(dataPath, JSON.stringify(tasks, null, 2));
        res.status(200).json(tasks[taskIndex]);
    }
}