import { NextResponse } from 'next/server';
import Link from '@/models/Link';
import connectDB from '@/app/lib/mongodb';

export async function GET() {
    try {
        await connectDB();
        const links = await Link.find({}).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: links }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function POST(request: Request) {
    try {
        await connectDB();
        const body = await request.json();
        const newLink = await Link.create(body);
        return NextResponse.json({ success: true, data: newLink }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}