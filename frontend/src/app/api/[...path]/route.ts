import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const BACKEND_BASE = process.env.NEXT_PUBLIC_BACKEND_BASE;
console.log("Backend base URL:", BACKEND_BASE);

export async function GET(request: NextRequest) {
  return proxyRequest(request, "GET");
}

export async function POST(request: NextRequest) {
  return proxyRequest(request, "POST");
}

async function proxyRequest(request: NextRequest, method: "GET" | "POST") {
  // ✅ Extract the path from the full URL, remove "/api"
  const clientPath = request.nextUrl.pathname.replace(/^\/api/, "");
  const targetUrl = `${BACKEND_BASE}${clientPath}`;
  const contentType = request.headers.get("content-type") || "";

  try {
    const headers: Record<string, string> = {
      "Content-Type": contentType,
    };

    const options: RequestInit = {
      method,
      headers,
    };

    if (method === "POST") {
      if (contentType.includes("application/json")) {
        options.body = JSON.stringify(await request.json());
      } else if (contentType.includes("multipart/form-data")) {
        options.body = await request.formData();
      }
    }

    const backendRes = await fetch(targetUrl, options);
    const responseContentType = backendRes.headers.get("content-type") || "";

    if (responseContentType.includes("application/json")) {
      const json = await backendRes.json();
      return NextResponse.json(json, { status: backendRes.status });
    }

    const text = await backendRes.text();
    return new NextResponse(text, { status: backendRes.status });
  } catch (err) {
    console.error(`❌ Proxy error for ${method} ${clientPath}:`, err);
    return NextResponse.json({ error: "Proxy failed", detail: `${err}` }, { status: 500 });
  }
}
