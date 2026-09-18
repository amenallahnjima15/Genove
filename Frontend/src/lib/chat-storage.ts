export interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  sources?: { t: string; s: string }[];
  timestamp: number;
}

export interface Conversation {
  id: string;
  title: string;
  pageName?: string;
  createdAt: number;
  messages: Message[];
}

const STORAGE_KEY = "genove_savoir_chats";

export const getConversations = (): Conversation[] => {
  try {
    if (typeof window === "undefined" || typeof localStorage === "undefined") {
      return [];
    }
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Failed to read chats", e);
    return [];
  }
};

export const saveConversations = (conversations: Conversation[]) => {
  try {
    if (typeof window === "undefined" || typeof localStorage === "undefined") {
      return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
    // Trigger custom event so other components know storage changed
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("genove_chats_updated"));
    }
  } catch (e) {
    console.error("Failed to save chats", e);
  }
};

export const createConversation = (firstMessageText: string, pageName?: string): Conversation => {
  const conversations = getConversations();
  const newId = `chat-${Date.now()}`;
  const newConv: Conversation = {
    id: newId,
    title: firstMessageText,
    pageName,
    createdAt: Date.now(),
    messages: [],
  };
  saveConversations([newConv, ...conversations]);
  return newConv;
};

export const addMessageToConversation = (
  convId: string,
  sender: "user" | "ai",
  text: string,
  sources?: { t: string; s: string }[],
): Message => {
  const conversations = getConversations();
  const index = conversations.findIndex((c) => c.id === convId);

  const newMessage: Message = {
    id: `${sender}-${Date.now()}`,
    sender,
    text,
    sources,
    timestamp: Date.now(),
  };

  if (index !== -1) {
    conversations[index].messages.push(newMessage);
    // If it's the first user message, update title
    if (
      (conversations[index].title === "" || conversations[index].title === "Nouvelle discussion") &&
      sender === "user"
    ) {
      conversations[index].title = text;
    }
    saveConversations(conversations);
  } else {
    // Fallback if conversation doesn't exist
    const newConv: Conversation = {
      id: convId,
      title: sender === "user" ? text : "Nouvelle discussion",
      createdAt: Date.now(),
      messages: [newMessage],
    };
    saveConversations([newConv, ...conversations]);
  }

  return newMessage;
};

export const deleteConversation = (convId: string) => {
  const conversations = getConversations();
  const updated = conversations.filter((c) => c.id !== convId);
  saveConversations(updated);
};
