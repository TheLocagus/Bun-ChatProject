const chatHistory = [
    {
        id: "1",
        author: "User1",
        message: "Witaj. Jak nazywa się pszczoła bez czoła?",
        time: "02.09.2023 22:50",
    },
    {
        id: "2",
        author: "OpenAI",
        message:
            "Witam. Nie ma takiego gatunku pszczoły która nie posiada czoła. Proszę sformułuj pytanie inaczej.",
        time: "02.09.2023 22:51",
    },
    {
        id: "3",
        author: "User1",
        message: "Psz.",
        time: "02.09.2023 22:52",
    },
    {
        id: "4",
        author: "OpenAI",
        message: "Nie rozumiem. Sformułuj pytanie inaczej.",
        time: "02.09.2023 22:53",
    },
];

Bun.serve({
    fetch(req, server) {
        if (server.upgrade(req)) {
            server.upgrade(req, {
                data: {
                    message: "123",
                },
            });
        }
        return new Response("Upgrade failed :(", { status: 500 });
    },
    websocket: {
        open(ws) {
            ws.subscribe("input-page");
            ws.publish("input-page", "Utworzono subscribe input");
            const initialMessage = JSON.stringify(chatHistory);
            ws.send(initialMessage);
        },
        message(ws, message) {
            const messageFromFrontend = message;
            const newMessage = messageFromFrontend;
            ws.publish("input-page", newMessage);
            ws.send(newMessage);
        },
        close(ws) {
            const msg = `Closed page`;
            ws.unsubscribe("input-page");
            ws.publish("input-page", msg);
        },
    }, // handlers
});

const socket = new WebSocket("ws://localhost:3000/chat");

socket.addEventListener("message", (event) => {
    console.log(event.data);
});
