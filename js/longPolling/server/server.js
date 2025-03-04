const express = require('express');

const app = express();
app.use(express.text());
const port = process.env.PORT || 3000
const host = process.env.HOST || "0.0.0.0"

const longPollingTimeout = process.env.PollingTimeout || 300000;


let messages = []

let sendResponseCB = null;

const fetchMessages = () => new Promise((resolve) => {
    if(messages.length != 0) {
        resolve(messages);
        messages = [];
    }

    sendResponseCB = (message) => {
        clearTimeout(timeoutId);
        sendResponseCB = null;
        resolve(message);
    }
    let timeoutId = setTimeout(() => {
        sendResponseCB = null;
        resolve(null);
    }, longPollingTimeout);
})

app.get('/receive', async (req, res) => {
    const messages = await fetchMessages();
    if(!messages) {
        return res.json({hasValue: false, messages: null})
    }
    res.json({hasValue: true, messages})
})

app.post('/send', (req, res) => {
    if(!req.body) {
        return res.status(400).send();
    }

    messages.push(req.body);
    sendResponseCB?.();
    res.send();
})

app.listen(port, host, () => {
    console.log(`Started listening on ${host}:${port} with Polling timeout of ${longPollingTimeout} ms.`);
})

