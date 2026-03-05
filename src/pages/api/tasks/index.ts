import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { taskSchema } from '../../../../utils/validation';


const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const tasks = await prisma.task.findMany();
            return res.status(200).json(tasks);
        } catch (error) {
            return res.status(500).json({ error: "Chyba databáze při načítání úkolů" });
        }
    }

    if (req.method === 'POST') {

        const validation = taskSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ error: validation.error.format() });
        }

        try {
            const newTask = await prisma.task.create({
                data: { title: validation.data.title },
            });
            return res.status(201).json(newTask);
        } catch (error) {
            return res.status(500).json({ error: "Chyba serveru při ukládání do DB" });
        }
    }


    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
}