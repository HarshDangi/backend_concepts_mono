Contains 3 scripts
- sender.js -> a client that is going to send a message.
- receiver.js -> a client that is going to receive a message.
- server.js

The receiver maintains a long polling connection (timeout 30s) with the server.
The server will keep the messages sent by the receiver in memory untill client is available to read it.



ToDo:
1. Say server sends a response but before it could be received by the receiver, the connection drops. In such case we should not delete the messages from memory.
We should have an ACK mechanism to know that client has received the message.