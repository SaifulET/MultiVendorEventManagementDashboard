import { Image, Send } from "lucide-react"
import { useState } from "react"

const messagesMock = [
  {
    id: 1,
    name: "Ellie smith",
    title: "Handyman, Phoenix",
    time: "11:04",
    messages: [
      {
        id: 1,
        type: "received",
        time: "10:16",
        content:
          "Vel et commodo et scelerisque aliquam. Sed libero, non praesent felis, sem eget venenatis neque. Massa tincidunt tempor et nisl eu maximus lectus. Amet lobortis auctor et egestas enim. Rhoncus cras nunc lectus morbi dui sem diam. Sed gravida eget semper vulputate vitae.",
        image: "https://via.placeholder.com/100x60",
      },
      {
        id: 2,
        type: "sent",
        time: "11:04",
        content: "Ok lets do it!",
      },
      {
        id: 3,
        type: "received",
        time: "12:37",
        content: "Donec lobortis mattis pellentesque nisl nibh eu.",
      },
    ],
  },
  {
    id: 2,
    name: "John Doe",
    title: "Electrician, Dallas",
    time: "09:30",
    messages: [
      {
        id: 1,
        type: "received",
        time: "09:15",
        content: "Hello! I can help you with your electrical work.",
      },
      {
        id: 2,
        type: "sent",
        time: "09:30",
        content: "Great! When can you start?",
      },
    ],
  },
  {
    id: 3,
    name: "Sarah Johnson",
    title: "Plumber, Austin",
    time: "14:22",
    messages: [
      {
        id: 1,
        type: "received",
        time: "14:20",
        content: "I'm available for the plumbing job this weekend.",
      },
      {
        id: 2,
        type: "sent",
        time: "14:22",
        content: "Perfect! What time works best for you?",
      },
    ],
  },
]

const AllMessages = () => {
  const [conversations, setConversations] = useState(messagesMock)
  const [selected, setSelected] = useState(messagesMock[0])
  const [newMessage, setNewMessage] = useState("")
  const [selectedImage, setSelectedImage] = useState(null)

  const getCurrentTime = () => {
    const now = new Date()
    return now.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleSendMessage = () => {
    if (!newMessage.trim() && !selectedImage) return
    if (!selected) return

    const currentTime = getCurrentTime()
    const messageId = Date.now()

    const newMsg = {
      id: messageId,
      type: "sent",
      time: currentTime,
      content: newMessage.trim(),
      image: selectedImage,
    }

    const updatedConversations = conversations.map((conv) => {
      if (conv.id === selected.id) {
        return {
          ...conv,
          messages: [...conv.messages, newMsg],
          time: currentTime,
        }
      }
      return conv
    })

    const updatedSelected = {
      ...selected,
      messages: [...selected.messages, newMsg],
      time: currentTime,
    }

    setConversations(updatedConversations)
    setSelected(updatedSelected)
    setNewMessage("")
    setSelectedImage(null)

    setTimeout(() => simulateReply(updatedSelected.id), Math.random() * 3000 + 2000)
  }

  const simulateReply = (conversationId) => {
    const replies = [
      "Thanks for your message!",
      "I'll get back to you soon.",
      "That sounds good to me.",
      "Let me check my schedule.",
      "Perfect! I'll be there.",
      "Can we discuss this further?",
      "I understand your requirements.",
      "When would be a good time?",
    ]

    const randomReply = replies[Math.floor(Math.random() * replies.length)]
    const currentTime = getCurrentTime()
    const messageId = Date.now()

    const replyMsg = {
      id: messageId,
      type: "received",
      time: currentTime,
      content: randomReply,
    }

    const updatedConversations = conversations.map((conv) => {
      if (conv.id === conversationId) {
        return {
          ...conv,
          messages: [...conv.messages, replyMsg],
          time: currentTime,
        }
      }
      return conv
    })

    setConversations(updatedConversations)

    if (selected && selected.id === conversationId) {
      setSelected({
        ...selected,
        messages: [...selected.messages, replyMsg],
        time: currentTime,
      })
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage()
    }
  }

  const handleSelectConversation = (conversation) => {
    const updatedConversation = conversations.find((conv) => conv.id === conversation.id)
    setSelected(updatedConversation || conversation)
  }

  return (
    <div className="min-h-screen mx-auto">
      <div
        style={{ boxShadow: "0px 1px 6px 0px rgba(0, 0, 0, 0.24)" }}
        className="w-full mx-auto mt-20 rounded-md flex h-[900px] "
      >
        <div className="w-1/3 border-r">
          <div className="p-4 text-lg font-semibold text-white bg-[#71abe0] rounded-t-md">Inbox</div>
          {conversations.length === 0 ? (
            <div className="p-4 text-sm text-center text-gray-500">
              You don't have any messages yet. They'll appear here once you do.
            </div>
          ) : (
            <div>
              {conversations.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => handleSelectConversation(chat)}
                  className={`flex items-center gap-2 p-4 border-b cursor-pointer hover:bg-gray-100 ${
                    selected?.id === chat.id ? "bg-blue-50 border-l-4 border-l-sky-500" : ""
                  }`}
                >
                  <img src="https://i.pravatar.cc/40" alt="Avatar" className="w-10 h-10 rounded-full" />
                  <div className="flex-1">
                    <div className="font-semibold">{chat.name}</div>
                    <div className="text-sm text-gray-500">{chat.title}</div>
                    <div className="text-xs text-gray-400 truncate">
                      {chat.messages[chat.messages.length - 1]?.content}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-400">{chat.time}</span>
                    <div className="flex justify-end mt-1">
                      <span className="text-xs text-sky-600">{chat.messages.length}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col justify-between w-2/3">
          {selected ? (
            <>
              <div className="flex items-center gap-2 p-4 border-b bg-gray-50">
                <img src="https://i.pravatar.cc/40" alt="Avatar" className="w-10 h-10 rounded-full" />
                <div className="flex-1">
                  <div className="font-semibold">{selected.name}</div>
                  <div className="text-sm text-gray-500">{selected.title}</div>
                </div>
                <span className="w-2 h-2 ml-2 bg-green-500 rounded-full" title="Online"></span>
              </div>

              <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-gray-50">
                {selected.messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.type === "sent" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-xs p-3 rounded-lg text-sm ${
                        msg.type === "sent"
                          ? "bg-sky-500 text-white rounded-br-none"
                          : "bg-white text-gray-800 rounded-bl-none shadow-sm"
                      }`}
                    >
                      <p>{msg.content}</p>
                      {msg.image && (
                        <img
                          src={msg.image || "/placeholder.svg"}
                          alt="Attached"
                          className="w-40 h-auto mt-2 rounded"
                        />
                      )}
                      <div
                        className={`mt-1 text-xs text-right ${msg.type === "sent" ? "text-sky-100" : "text-gray-400"}`}
                      >
                        {msg.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {selectedImage && (
                <div className="px-4 pb-2">
                  <img
                    src={selectedImage}
                    alt="Preview"
                    className="w-32 h-auto rounded-lg shadow"
                  />
                </div>
              )}

              <div className="relative flex flex-col gap-2 p-4 bg-white border-t sm:flex-row sm:items-center sm:gap-3">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 w-full p-3 text-sm border rounded-full focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                />

                <label className="absolute flex items-center justify-center w-10 h-10 bg-gray-100 border border-gray-300 rounded-full cursor-pointer right-24 hover:bg-gray-200">
                  <Image/>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => setSelectedImage(event.target.result);
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="hidden"
                  />
                </label>

                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() && !selectedImage}
                  className="absolute px-4 py-3 text-sm text-blue-600 transition-colors border border-gray-300 rounded-full right-5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                 <Send/>
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center flex-1 p-4 text-sm text-center text-gray-500 bg-gray-50">
              <div>
                <div className="mb-4 text-4xl">💬</div>
                <div>Select a conversation to start chatting</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AllMessages
