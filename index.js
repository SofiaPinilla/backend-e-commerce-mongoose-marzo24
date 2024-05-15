const express = require("express");
const { dbConnection } = require("./config/config");
const { handleTypeError } = require("./middleware/errors");
const app = express();
require("dotenv").config();

const PORT = process.env.PORT || 3000;

dbConnection();

app.use(express.json());

app.use("/products", require("./routes/products"));
app.use("/users", require("./routes/users"));
app.use("/orders", require("./routes/orders"));

app.use(handleTypeError);

app.listen(PORT, () => console.log(`Servidor levantado en el puerto ${PORT}`));
