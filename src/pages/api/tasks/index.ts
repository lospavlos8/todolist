import { promises as fs } from 'fs';
import path from 'path';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const dataPath = path.join(process.cwd(), 'data', 'tasks.json');
    const fileContents = await fs.readFile(dataPath, 'utf8');
    const tasks = JSON.parse(fileContents);

    if (req.method === 'GET') {
        const { finished } = req.query;
        if (finished === 'true') return res.status(200).json(tasks.filter((t: any) => t.completed === true));
        if (finished === 'false') return res.status(200).json(tasks.filter((t: any) => t.completed === false));
        return res.status(200).json(tasks);
    } else if (req.method === 'POST') {
        if (!req.body.title) return res.status(400).json({ error: 'Chybi nazev' });
        const newTask = { id: Date.now(), title: req.body.title, completed: false };
        tasks.push(newTask);
        await fs.writeFile(dataPath, JSON.stringify(tasks, null, 2));
        res.status(201).json(newTask);
    }
}