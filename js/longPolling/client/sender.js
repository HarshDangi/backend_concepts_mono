const {Writable} = require('stream')
const host = process.env.HOST || "127.0.0.1"
const port = process.env.PORT || 3000

const transmissionStream = new Writable({
    write(chunk, _, callback) {
        const message = chunk.toString();
        if(message == "") {
            console.log("Can't send empty message.");
            callback();
            return;
        }
        console.log("sending..."+message);
        fetch(`http://${host}:${port}/send`, {
            method: 'POST',
            'Content-Type': 'text/plain',
            body: message
        }).then(res => {
            if(res.status != 200) {
                throw new Error("Can't send the message: got response code "+res.status);
            }
            callback();
        }).catch(err => {
            callback(err);
        })
    }
})

process.stdin.pipe(transmissionStream);