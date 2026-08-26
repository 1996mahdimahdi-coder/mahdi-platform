import { eq, and, ne } from "drizzle-orm";
import { db } from "@/db";
import { deviceTokens, users } from "@/db/schema";

let messaging: any = null;

async function getMessaging() {
  if (messaging) return messaging;

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const admin = await import("firebase-admin") as any;

    if (!admin.apps.length) {
      const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;
      if (!serviceAccount) {
        console.warn("[Push] FIREBASE_SERVICE_ACCOUNT not set — push disabled");
        return null;
      }

      const parsed = JSON.parse(serviceAccount);
      admin.initializeApp({
        credential: admin.credential.cert(parsed),
      });
    }

    messaging = admin.messaging();
    return messaging;
  } catch (e) {
    console.error("[Push] firebase-admin init failed:", e);
    return null;
  }
}

export async function registerDeviceToken(
  userId: number,
  token: string,
  platform: string = "android"
): Promise<{ success: boolean }> {
  try {
    const existing = await db
      .select()
      .from(deviceTokens)
      .where(eq(deviceTokens.token, token))
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(deviceTokens)
        .set({
          userId,
          platform,
          active: true,
          updatedAt: new Date(),
        })
        .where(eq(deviceTokens.token, token));
    } else {
      await db.insert(deviceTokens).values({
        userId,
        token,
        platform,
        active: true,
      });
    }

    return { success: true };
  } catch (e) {
    console.error("[Push] registerDeviceToken error:", e);
    return { success: false };
  }
}

export async function unregisterDeviceToken(
  token: string
): Promise<{ success: boolean }> {
  try {
    await db
      .update(deviceTokens)
      .set({ active: false, updatedAt: new Date() })
      .where(eq(deviceTokens.token, token));

    return { success: true };
  } catch (e) {
    console.error("[Push] unregisterDeviceToken error:", e);
    return { success: false };
  }
}

interface SendNotificationOptions {
  title: string;
  body: string;
  data?: Record<string, string>;
}

export async function sendPushNotification(
  options: SendNotificationOptions
): Promise<{ sent: number; errors: number }> {
  const msg = await getMessaging();
  if (!msg) return { sent: 0, errors: 0 };

  try {
    const rows = await db
      .select()
      .from(deviceTokens)
      .where(and(eq(deviceTokens.active, true), ne(deviceTokens.userId, 0)));

    if (rows.length === 0) return { sent: 0, errors: 0 };

    const tokens = rows.map((r) => r.token);
    const message = {
      notification: { title: options.title, body: options.body },
      data: options.data ?? {},
      tokens,
    };

    const response = await msg.sendEachForMulticast(message);

    const failedTokens: string[] = [];
    response.responses.forEach((r: any, i: number) => {
      if (!r.success) {
        failedTokens.push(tokens[i]);
        console.warn("[Push] Failed token:", tokens[i], r.error?.message);
      }
    });

    if (failedTokens.length > 0) {
      await db
        .update(deviceTokens)
        .set({ active: false, updatedAt: new Date() })
        .where(eq(deviceTokens.token, failedTokens[0]));

      for (const ft of failedTokens.slice(1)) {
        await db
          .update(deviceTokens)
          .set({ active: false, updatedAt: new Date() })
          .where(eq(deviceTokens.token, ft));
      }
    }

    return {
      sent: response.successCount,
      errors: response.failureCount,
    };
  } catch (e) {
    console.error("[Push] sendPushNotification error:", e);
    return { sent: 0, errors: 1 };
  }
}

export async function notifyNewCourse(course: {
  slug: string;
  title: string;
}): Promise<{ sent: number; errors: number }> {
  return sendPushNotification({
    title: "🎓 دورة جديدة في NABDA",
    body: course.title,
    data: { url: `/learn/courses/${course.slug}`, type: "course" },
  });
}

export async function notifyNewArticle(article: {
  slug: string;
  title: string;
}): Promise<{ sent: number; errors: number }> {
  return sendPushNotification({
    title: "📰 مقال جديد في NABDA",
    body: article.title,
    data: { url: `/blog/${article.slug}`, type: "article" },
  });
}
