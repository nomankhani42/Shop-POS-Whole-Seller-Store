import ImageKit from "imagekit";
import { NextRequest, NextResponse } from "next/server";

export const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY as string,  // Ensure it's a string
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string,
    urlEndpoint: process.env.IMAGEKIT_URL as string,
});

export async function GET(request: NextRequest): Promise<NextResponse> {
    try {
        const authParams = imagekit.getAuthenticationParameters();
        return NextResponse.json(authParams);
    } catch (error) {
        return NextResponse.json({ error: "Failed to get authentication parameters" }, { status: 500 });
    }
}
