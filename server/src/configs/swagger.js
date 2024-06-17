import swaggerJSDoc from "swagger-jsdoc"

const options = {
    swaggerDefinition: {
        openapi: "3.0.2",
        tags: [
            {
                name: "Receipt Administrator",
                description: "API for operations related to Receipt Administrator"
            }
        ],
        info: {
            title: "Receipt Administrator - REST API Node.js / Express",
            version: "1.0.0",
            description: "API Docs for Receipt Administrator"
        }
    },
    apis: [
        "./src/routes/receipt.route.js",
        "./src/routes/token.route.js",
        "./src/routes/user.route.js"
    ]
}

const swaggerSpec = swaggerJSDoc(options)
const swaggerUiOptions = {
    customSiteTitle: "REST API Documentation - Receipt Administrator"
}
export default swaggerSpec
export {
    swaggerUiOptions
}