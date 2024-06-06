import colors from "colors"
import server from "./server"

const port = process.env.PORT || 4100
server.listen(port, () => {
    console.log(colors.cyan.bold(`¡Server deployed successfully on http://localhost:${port}!`))
})