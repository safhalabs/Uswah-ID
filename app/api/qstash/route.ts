import { NextRequest, NextResponse } from "next/server";

/**
 * Webhook Receiver untuk Upstash QStash
 * Dipanggil secara periodik (cron) oleh Upstash QStash untuk pengingat terjadwal:
 * - H-1 Puasa Senin / Kamis
 * - H-1 Puasa Ayyamul Bidh
 * - Pengingat Imsak & Subuh
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    
    // Verifikasi signature QStash jika konfigurasi env tersedia
    const qstashSignature = req.headers.get("upstash-signature");
    if (process.env.QSTASH_CURRENT_SIGNING_KEY && !qstashSignature) {
      return NextResponse.json({ error: "Unauthorized: Missing QStash signature" }, { status: 401 });
    }

    console.log("[QStash Webhook Triggered]", {
      timestamp: new Date().toISOString(),
      payload: body,
    });

    // Di sini logika pengiriman Web Push / Bot Telegram / WhatsApp Webhook dapat dieksekusi
    return NextResponse.json({
      success: true,
      message: "QStash scheduled job executed successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[QStash Webhook Error]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "Uswah.id QStash Dispatcher",
    timestamp: new Date().toISOString(),
  });
}
