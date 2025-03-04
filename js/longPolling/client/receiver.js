const {Readable} = require("stream")

const host = process.env.HOST || "127.0.0.1"
const port = process.env.PORT || 3000

const errorCodesForRetry = ["UND_ERR_SOCKET", "ECONNRESET", "ETIMEDOUT"];

const pollForMessage = async () => {
        const response = await fetch(`http://${host}:${port}/receive`);
        if (response.status != 200) {
            throw new Error("Got an error while contacting the server. Status Code: "+response.status);
        }
        const data = await response.json()

        if(!data.hasValue) {
            return null;
        }

        return data.messages;
}

const fetchMessages = new Readable({
    async read(size) {
        let messages = null;
        while(!messages) {
            try {
            messages = await pollForMessage();
            } catch (e) {
                console.error(e);
                if (!errorCodesForRetry.includes(e.cause?.code)) {
                    break;
                }
            }
            if(messages) {
                messages.forEach(msg => {
                    this.push(msg);
                });
            }
        }
    }
})

fetchMessages.pipe(process.stdout)