const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN ?? "";
const TELEGRAM_ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID ?? "";

export const telegramConfigured = Boolean(TELEGRAM_BOT_TOKEN && TELEGRAM_ADMIN_CHAT_ID);

function telegramApi(method: string, payload: Record<string, unknown>) {
  if (!telegramConfigured) {
    return Promise.resolve({ ok: false } as const);
  }

  const body = JSON.stringify(payload);
  return fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    // Pastikan ini dijalankan di Node.js runtime
    // Di Next.js API route sudah dijamin nodejs.
  }).then((res) => res.json() as Promise<{ ok: boolean; description?: string }>);
}

export async function notifyNewRegistration(data: {
  childName: string;
  parentName: string;
  phone: string;
  program: string;
  schedule: string;
}) {
  const text = [
    "📝 Pendaftaran Baru",
    "",
    `Ananda : ${data.childName}`,
    `Orang Tua : ${data.parentName}`,
    `WA : ${data.phone}`,
    `Program : ${data.program}`,
    `Jadwal : ${data.schedule}`,
    "",
    "Cek di /admin → tab Pendaftaran untuk detail lengkap.",
  ].join("\n");

  try {
    const result = await telegramApi("sendMessage", {
      chat_id: TELEGRAM_ADMIN_CHAT_ID,
      text,
      disable_web_page_preview: true,
    });

    if (!result.ok) {
      console.error("[telegram] failed:", result.description);
    }
  } catch (err) {
    console.error("[telegram] error:", err);
  }
}
