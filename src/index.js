import app from "./app.js";

const PORT = 3000;
const hostName = "127.0.0.1";

app.listen(PORT, hostName, () => console.log("server started on: http://" + hostName + ":" + PORT));