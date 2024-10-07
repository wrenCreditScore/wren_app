import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import bodyParser from "body-parser";
import 'dotenv/config'
import swaggerUi from 'swagger-ui-express'

import partnerRouter from './routes/api/partner'
import authRouter from './routes/api/auth'
import userRouter from './routes/api/user'
import walletRouter from './routes/api/wallet'
import portfolioRouter from './routes/api/portfolio'
import {swaggerSpec} from './app/utils/swagger'

const PORT = process.env.PORT || 3000


const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

const spacs = swaggerSpec

app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(spacs)
)
 
const BaseUrl = '/api/v1';

app.use(`${BaseUrl}/user`, userRouter)
app.use(`${BaseUrl}/user/wallets`, walletRouter)
app.use(`${BaseUrl}/user/portfolio`, portfolioRouter)
app.use(`${BaseUrl}/auth`, authRouter)
app.use(`${BaseUrl}/partner`, partnerRouter)

app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`))