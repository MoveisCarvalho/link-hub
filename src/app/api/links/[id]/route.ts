import { NextResponse } from 'next/server';
import Link from '@/models/Link';
import connectDB from '@/app/lib/mongodb';

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;
        const body = await request.json();
        const updatedLink = await Link.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        });

        if (!updatedLink) {
            return NextResponse.json({ success: false, error: 'Link não encontrado' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: updatedLink }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;
        const deletedLink = await Link.findByIdAndDelete(id);

        if (!deletedLink) {
            return NextResponse.json({ success: false, error: 'Link não encontrado' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: {} }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}