import { z } from 'zod';

export const taskSchema = z.object({
    title: z.string().min(1, "Název úkolu je povinný a nesmí být prázdný"),
});

export const updateTaskSchema = z.object({
    title: z.string().min(1, "Název nesmí být prázdný").optional(),
    completed: z.boolean().optional(),
});