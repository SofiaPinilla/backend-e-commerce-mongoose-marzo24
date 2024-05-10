const express = require("express")
const { dbConnection } = require("./config/config")
const app = express()
const PORT = 3002

dbConnection()

app.use(express.json())

app.use("/products",require("./routes/products"))

app.listen(PORT,()=> console.log(`Servidor levantado en el puerto ${PORT}`))