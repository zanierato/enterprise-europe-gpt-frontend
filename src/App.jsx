
import { useState } from "react";

export default function EnterpriseEuropeGPT() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(
        "https://enterprise-europe-backend.onrender.com/chat",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: input }),
        }
      );

      const data = await response.json();
      setMessages((prev) => [...prev, { role: "bot", content: data.message }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "Errore nella risposta. Riprova." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4">Enterprise Europe GPT</h1>
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-md p-4 flex flex-col">
        <div className="flex-1 overflow-y-auto mb-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={\`p-2 my-1 rounded-xl max-w-[80%] \${msg.role === "user"
                  ? "bg-blue-100 self-end"
                  : "bg-gray-200 self-start"
              }\`}
            >
              {msg.content}
            </div>
          ))}
          {loading && <div className="text-gray-500">Scrivendo...</div>}
        </div>
        <div className="flex gap-2">
          <input
            className="flex-1 border rounded-xl p-2"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Scrivi qui..."
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-xl"
            onClick={sendMessage}
          >
            Invia
          </button>
        </div>
      </div>
    </div>
  );
}
