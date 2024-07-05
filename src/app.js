import express from "express";
import cors from "cors";
import morgan from "morgan";
import db from "./utils/database.js";
import User from "./models/users.model.js";
import Role from "./models/roles.model.js";
import "dotenv/config";
import userRoutes from "./modules/users/user.routes.js";

const app = express();
const PORT = process.env.PORT ?? 8000;

//* testing db
db.authenticate()
  .then(() => console.log("Conexion Correcta"))
  .catch((err) => console.log(err));

//* models
User;
Role;

db.sync()
  .then(() => console.log("Base de datos sincronizada"))
  .catch((err) => console.log(err));

//* settings
app.use(cors(), morgan("tiny"), express.json());

//* routes
app.use(userRoutes);

//* health check
app.get("/", (req, res) => {
  res.send("OK");
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});