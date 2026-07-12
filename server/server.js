import "dotenv/config"
import dbconnect from "./config/db.connect.js"
import app from "./app.js"

const startServer = async () => {
    try {
        const connection = await dbconnect.getConnection()
        connection.release()
        console.log("database connect")

        const PORT = process.env.PORT || 3002

        const httpServer = app.listen(PORT, () => {
            console.log(`server is running on ${PORT} port`)
        })

        httpServer.on("error", (err) => {
            if (err.code === "EADDRINUSE") {
                console.error(
                    `Port ${PORT} is already in use. Stop the other process or change PORT in .env`
                )
            } else {
                console.error("Server failed to start:", err.message)
            }
            process.exit(1)
        })
    } catch (error) {
        console.error("database not connection", error.message)
        process.exit(1)
    }
}

startServer()
