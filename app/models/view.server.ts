import { prisma } from "~/db.server";
import type { View } from "@prisma/client";
import { getUserId } from "~/session.server";
import { getClientIPAddress } from "remix-utils";

export async function logView(slug: string, request: Request) {
  const userId = await getUserId(request);
  if (userId) {
    // check for existing logged in view record
    if (await prisma.view.findFirst({ where: { slug, userId } })) {
      return;
    }
  }
  const agent = request.headers.get("User-Agent") || "";

  const ip = getClientIPAddress(request) || "";
  // Check for existing anonymous view record
  if (
    agent &&
    ip &&
    (await prisma.view.findFirst({ where: { slug, agent, ip } }))
  ) {
    return;
  }

  const payload: Pick<View, "slug" | "agent" | "ip"> = {
    slug,
    agent,
    ip,
  };

  console.log("logging view", { slug, userId, agent, ip });

  return prisma.view.create({
    data: {
      ...payload,
      userId: userId || undefined,
    },
  });
}
