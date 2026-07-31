import { db } from "@workspace/db";
import { appDataTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

export async function getAppData<T>(key: string): Promise<T | null> {
  const rows = await db
    .select()
    .from(appDataTable)
    .where(eq(appDataTable.key, key))
    .limit(1);

  if (rows.length === 0) {
    return null;
  }

  return rows[0].value as T;
}

export async function setAppData<T>(key: string, value: T): Promise<void> {
  await db
    .insert(appDataTable)
    .values({
      key,
      value,
    })
    .onConflictDoUpdate({
      target: appDataTable.key,
      set: {
        value,
        updatedAt: new Date(),
      },
    });
}