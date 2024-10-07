import swaggerjsdoc from 'swagger-jsdoc'

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Wren API",
            version: "1.0.0",
            description: "The Wren API enables access to blockchain-based creditworthiness assessments. It provides functionality to generate and retrieve Wren Trust Scores based on Solana blockchain activity, offering a verifiable measure of user trustworthiness in the Web3 ecosystem.",
            contact: {
                name: "Wren Dev Team",
                url: "https://wren.dev",
                email: "wren@gmail.com"
            }
        },
        servers: [
            {
                url: 'https://4555-196-216-220-211.ngrok-free.app/api/v1'
            }
        ]
    },
    apis: ["./routes/api/*.ts"] // Update this path
}

export const swaggerSpec = swaggerjsdoc(options)