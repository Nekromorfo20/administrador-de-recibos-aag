import colors from "colors"
import db from "./connectionDB"

const clearDB = async () => {
    try {
        await db.sync({ force: true, alter: true })
        colors.bgYellow.bold("¡Database data clear successfully!")
        process.exit(0)
    } catch (e) {
        console.log(e)
        process.exit(1)
    }
}

if (process.argv[2] === "--clear") {
    clearDB()
}