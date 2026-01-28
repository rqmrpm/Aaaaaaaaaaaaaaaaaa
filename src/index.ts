import { SignJWT, jwtVerify } from 'jose';

export interface Env {
    USERS_KV: KVNamespace;
    CHAT_ROOM: DurableObjectNamespace;
    JWT_SECRET: string;
}

// --- Helper: JWT Management ---
const SECRET = new TextEncoder().encode("your-very-secure-secret-key"); // يفضل وضعها في Environment Variables

async function createToken(userId: string) {
    return await new SignJWT({ userId })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('24h')
        .sign(SECRET);
}

async function verifyToken(token: string) {
    try {
        const { payload } = await jwtVerify(token, SECRET);
        return payload.userId as string;
    } catch (e) {
        return null;
    }
}

// --- Main Worker ---
export default {
    async fetch(request: Request, env: Env): Promise<Response> {
        const url = new URL(request.url);

        // 1. CORS Headers
        const corsHeaders = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
        };

        if (request.method === "OPTIONS") {
            return new Response(null, { headers: corsHeaders });
        }

        // 2. Auth Endpoint (Simple Login/Register)
        if (url.pathname === "/api/auth" && request.method === "POST") {
            const { userId } = await request.json() as any;
            const token = await createToken(userId);
            // حفظ مستخدم جديد في KV إذا لم يكن موجوداً
            const exists = await env.USERS_KV.get(`user:${userId}`);
            if (!exists) {
                await env.USERS_KV.put(`user:${userId}`, JSON.stringify({
                    id: userId,
                    balance: 0,
                    joinedAt: new Date().toISOString()
                }));
            }
            return new Response(JSON.stringify({ token }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }

        // 3. WebSocket Endpoint (Signaling & Chat)
        if (url.pathname === "/ws") {
            const token = url.searchParams.get("token");
            const userId = token ? await verifyToken(token) : null;

            if (!userId) {
                return new Response("Unauthorized", { status: 401 });
            }

            const upgradeHeader = request.headers.get("Upgrade");
            if (!upgradeHeader || upgradeHeader !== "websocket") {
                return new Response("Expected Upgrade: websocket", { status: 426 });
            }

            // توجيه الاتصال إلى Durable Object
            const id = env.CHAT_ROOM.idFromName("global-lobby");
            const obj = env.CHAT_ROOM.get(id);
            return obj.fetch(request);
        }

        // 4. Wallet & Profile API
        if (url.pathname === "/api/me") {
            const authHeader = request.headers.get("Authorization");
            const token = authHeader?.split(" ")[1];
            const userId = token ? await verifyToken(token) : null;

            if (!userId) return new Response("Unauthorized", { status: 401, headers: corsHeaders });

            const userData = await env.USERS_KV.get(`user:${userId}`);
            return new Response(userData, { headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }

        return new Response("Cloudflare Worker Backend is Live 🚀", { headers: corsHeaders });
    },
};

// --- Durable Object: ChatRoom & Signaling ---
export class ChatRoom {
    state: DurableObjectState;
    sessions: Map<WebSocket, { userId: string }> = new Map();

    constructor(state: DurableObjectState) {
        this.state = state;
    }

    async fetch(request: Request) {
        const pair = new WebSocketPair();
        const [client, server] = Object.values(pair);

        await this.handleSession(server);

        return new Response(null, { status: 101, webSocket: client });
    }

    async handleSession(ws: WebSocket) {
        ws.accept();

        ws.addEventListener("message", async (msg) => {
            try {
                const data = JSON.parse(msg.data as string);
                
                // Signaling Logic (WebRTC) or Chat
                // نقوم بإرسال الرسالة للجميع أو لمستهدف معين (Target)
                this.broadcast(JSON.stringify({
                    type: data.type,
                    from: data.from,
                    payload: data.payload,
                    timestamp: Date.now()
                }), ws);

            } catch (e) {
                ws.send(JSON.stringify({ error: "Invalid Message Format" }));
            }
        });

        ws.addEventListener("close", () => {
            this.sessions.delete(ws);
        });
    }

    broadcast(message: string, sender: WebSocket) {
        for (const [ws] of this.sessions) {
            if (ws !== sender) {
                try {
                    ws.send(message);
                } catch (e) {
                    this.sessions.delete(ws);
                }
            }
        }
    }
}
