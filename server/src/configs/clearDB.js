import { exit } from "node:process"
import colors from "colors"
import db from "./connectionDB"

const clearDB = async () => {
    try {
        await db.sync({ force: true })
        colors.bgYellow.bold("¡Database data clear successfully!")
        exit(0)
    } catch (e) {
        console.log(e)
        exit(1)
    }
}

if (process.argv[2] === "--clear") {
    clearDB()
}