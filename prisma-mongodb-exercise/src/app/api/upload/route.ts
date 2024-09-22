// app/api/upload/route.ts

import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";

export async function POST(request: NextRequest) {
  const data = await request.formData();
  const file: File | null = data.get("file") as unknown as File;

  if (!file) {
    return NextResponse.json(
      { success: false, message: "No file uploaded" },
      { status: 400 }
    );
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // With the file data in the buffer, you can do whatever you want with it.
  // For this example, we'll just write it to the filesystem in a new location
  const path = join(process.cwd(), "public", "uploads", file.name);
  await writeFile(path, buffer);
  console.log(`File uploaded to ${path}`);

  const filePath = `/uploads/${file.name}`;

  return NextResponse.json({ success: true, filePath });
}

export async function GET() {
  return NextResponse.json(
    { message: "This endpoint only supports POST requests for file uploads." },
    { status: 405 }
  );
}
