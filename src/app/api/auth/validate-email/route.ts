import { NextResponse } from 'next/server';

const allowedEmails = process.env.ALLOWED_EMAILS?.split(',') || [];

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ authorized: false }, { status: 400 });
    }

    const isAuthorized = allowedEmails.includes(email);
    return NextResponse.json({ authorized: isAuthorized });
  } catch (error) {
    console.error('Error validating email:', error);
    return NextResponse.json({ authorized: false }, { status: 500 });
  }
} 