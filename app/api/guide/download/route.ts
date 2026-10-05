import { NextResponse } from 'next/server';

// Google Drive File ID from: https://drive.google.com/file/d/1zYWgr0k_RMCgFjrqfcVu3pzS2_xbOZdK/view?usp=sharing
const GOOGLE_DRIVE_FILE_ID = '1zYWgr0k_RMCgFjrqfcVu3pzS2_xbOZdK';
const DIRECT_DOWNLOAD_URL = `https://drive.google.com/uc?export=download&id=${GOOGLE_DRIVE_FILE_ID}`;

export async function GET() {
  // Redirect user directly to the Google Drive download link
  return NextResponse.redirect(DIRECT_DOWNLOAD_URL, { status: 302 });
}
