import prisma from "../config/db.js";

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 200;
const MAX_MESSAGE_LENGTH = 1000;

function normalizeNeoId(value) {
  if (!value || typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed || trimmed.toLowerCase() === "global") {
    return null;
  }

  return trimmed;
}

async function getChannels(req, res) {
  try {
    const grouped = await prisma.chatMessage.groupBy({
      by: ["neoId"],
      _count: { _all: true },
      _max: { createdAt: true },
    });

    const channels = grouped.map((item) => ({
      id: item.neoId ? `neo-${item.neoId}` : "global",
      name: item.neoId ? `Asteroid ${item.neoId}` : "Global",
      neoId: item.neoId,
      count: item._count._all,
      lastMessageAt: item._max.createdAt,
    }));

    const hasGlobal = channels.some((channel) => channel.neoId === null);
    if (!hasGlobal) {
      channels.unshift({
        id: "global",
        name: "Global",
        neoId: null,
        count: 0,
        lastMessageAt: null,
      });
    }

    channels.sort((a, b) => {
      if (a.neoId === null) return -1;
      if (b.neoId === null) return 1;

      const aTime = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
      const bTime = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
      return bTime - aTime;
    });

    return res.status(200).json({ channels });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to load channels", error: error.message });
  }
}

async function getMessages(req, res) {
  const neoId = normalizeNeoId(req.query.neoId);
  const limitRaw = parseInt(req.query.limit, 10);
  const limit = Number.isFinite(limitRaw)
    ? Math.min(Math.max(limitRaw, 1), MAX_LIMIT)
    : DEFAULT_LIMIT;

  try {
    const messages = await prisma.chatMessage.findMany({
      where: { neoId },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return res.status(200).json({ messages: messages.reverse() });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to load messages", error: error.message });
  }
}

async function postMessage(req, res) {
  const text = typeof req.body.message === "string" ? req.body.message.trim() : "";
  const neoId = normalizeNeoId(req.body.neoId);

  if (!text) {
    return res.status(400).json({ message: "Message cannot be empty" });
  }

  if (text.length > MAX_MESSAGE_LENGTH) {
    return res.status(400).json({ message: "Message is too long" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { name: true, email: true },
    });

    const saved = await prisma.chatMessage.create({
      data: {
        userId: req.user.id,
        username: user?.name || user?.email || "User",
        neoId,
        message: text,
      },
    });

    return res.status(201).json({ message: saved });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to send message", error: error.message });
  }
}

export { getChannels, getMessages, postMessage };
