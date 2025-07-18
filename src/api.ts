/// <reference types="vite/client" />

const API_URL = "https://api.dify.ai/v1/chat-messages";
const STOP_URL = (taskId: string) =>
  `https://api.dify.ai/v1/chat-messages/${taskId}/stop`;
const API_KEY = import.meta.env.VITE_DIFY_API_KEY;

export async function sendChatMessage({
  message,
  conversationId,
  user,
  onMessage,
  onTaskId,
}: {
  message: string;
  conversationId?: string;
  user?: any;
  onMessage: (text: string) => void;
  onTaskId?: (taskId: string) => void;
}) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      inputs: { text: message },
      conversation_id: conversationId,
      user,
      response_mode: "streaming",
    }),
  });
  if (!res.body) throw new Error("No response body");
  const reader = res.body.getReader();
  let buffer = "";
  let taskId = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = new TextDecoder().decode(value);
    buffer += chunk;
    // 处理 SSE 格式
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";
    for (const line of lines) {
      if (line.startsWith("data:")) {
        const data = JSON.parse(line.replace("data:", "").trim());
        if (data.task_id && !taskId) {
          taskId = data.task_id;
          onTaskId && onTaskId(taskId);
        }
        if (data.answer) {
          onMessage(data.answer);
        }
      }
    }
  }
}

export async function stopChatMessage(taskId: string) {
  const res = await fetch(STOP_URL(taskId), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
  });
  return res.json();
}
