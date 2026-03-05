import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { updateTaskSchema } from '../../../utils/validation';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const taskId = Number(req.query.id);


    if (isNaN(taskId)) {
        return res.status(400).json({ error: "Neplatné ID úkolu" });
    }

    if (req.method === 'PUT') {
        const validation = updateTaskSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ error: validation.error.format() });
        }

        try {
            const updatedTask = await prisma.task.update({
                where: { id: taskId },
                data: validation.data,
            });
            return res.status(200).json(updatedTask);
        } catch (error: any) {
            if (error.code === 'P2025') {
                return res.status(404).json({ error: "Úkol pro úpravu nebyl nalezen" });
            }
            return res.status(500).json({ error: "Chyba databáze při úpravě" });
        }
    }

    if (req.method === 'DELETE') {
        try {
            await prisma.task.delete({
                where: { id: taskId },
            });
            return res.status(200).json({ message: "Úkol byl smazán" });
        } catch (error: any) {
            if (error.code === 'P2025') {
                return res.status(404).json({ error: "Úkol pro smazání nebyl nalezen" });
            }
            return res.status(500).json({ error: "Chyba databáze při mazání" });
        }
    }

    res.setHeader('Allow', ['PUT', 'DELETE']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
}