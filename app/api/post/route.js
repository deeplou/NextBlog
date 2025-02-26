import { NextResponse } from "next/server";
import db from '@/lib/db';

export async function POST(req) {
    try {
        const formData = await req.formData();
        const id = formData.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        const result = await db.one(
            'SELECT * FROM posts WHERE id=$1',
            [id]
        );

        return NextResponse.json(result);
    } catch (error) {
        console.error('Error inserting post:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
