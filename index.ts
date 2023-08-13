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
        },
        message(ws, message) {
            const messageFromFrontend = message;
            const newMessage = messageFromFrontend + " from backend.";
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
