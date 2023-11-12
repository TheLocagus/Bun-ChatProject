import { ChatHistoryDTO, generateId } from "./utils";

const chatHistory: ChatHistoryDTO[] = [
    {
        id: "1",
        author: "User",
        text: "Dzień dobry ChatGPT!",
        time: 1694376329000,
    },
    {
        id: "2",
        author: "User",
        text: "Odpowiedz mi na pytanie, Co znaczy skrót a11y?",
        time: 1694376329000,
    },
    {
        id: "3",
        author: "AI",
        text: "Witaj użytkownik! Skrót a11y oznacza - accessibility. A na początku, Y na końcu oraz 11 znaków pomiędzy. Czy masz jeszcze jakieś pytanie?",
        time: 1694376329000,
    },
    {
        id: "42",
        author: "User",
        text: "Bardzo ładnie. Dziękuję!",
        time: 1694376999990,
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
            const newMessage = JSON.stringify(messageFromFrontend);
            const newId = generateId(chatHistory);

            const dtoObject: [ChatHistoryDTO] = [
                {
                    id: newId,
                    author: "User",
                    text: newMessage,
                    time: new Date().getTime(),
                },
            ];

            ws.publish("input-page", JSON.stringify(dtoObject));
            ws.send(JSON.stringify(dtoObject));

            const gptTypingStart = ["typing"];
            const gptTypingEnd = ["finished-typing"];

            ws.send(JSON.stringify(gptTypingStart));

            //TODO: implement OpenAI response

            setTimeout(() => {
                ws.send(JSON.stringify(gptTypingEnd));
            }, 3000);
        },
        close(ws) {
            const msg = `Closed page`;
            ws.unsubscribe("input-page");
            ws.publish("input-page", msg);
        },
    },
});

const socket = new WebSocket("ws://localhost:3000/chat");

socket.addEventListener("message", (event) => {
    console.log("message event");
});
