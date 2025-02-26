import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(req) {
    try {
        const formData = await req.formData();
        const name = formData.get('name');
        const title = formData.get('title');
        const body = formData.get('body');
        const truncate = formData.get('truncate');

        if (truncate) {
            await db.none('TRUNCATE TABLE posts RESTART IDENTITY');
            return NextResponse.json({ msg: "Table cleared." });
        } else {
            if (!title || !body) {
                return NextResponse.json({ error: 'Title and Body are required' }, { status: 400 });
            }

            const result = await db.one(
                'INSERT INTO posts (name, title, body) VALUES ($1, $2, $3) RETURNING id, created_at',
                [name, title, body]
            );

            return NextResponse.json({ ...result, name, title, body }, { status: 201 });
        }
    } catch (error) {
        console.error('Error inserting post:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET() {
    try {
        const result = await db.any('SELECT * FROM posts ORDER BY created_at DESC');

        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error('Error fetching posts:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
