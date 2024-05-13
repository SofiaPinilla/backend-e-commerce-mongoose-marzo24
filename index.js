const express = require("express")
const { dbConnection } = require("./config/config")
const app = express()
const PORT = 3002

dbConnection()

app.use(express.json())

app.use("/products",require("./routes/products"))
app.use("/users", require("./routes/users"))
app.use("/orders",require("./routes/orders"))

app.listen(PORT,()=> console.log(`Servidor levantado en el puerto ${PORT}`))