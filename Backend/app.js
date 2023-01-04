process.on("uncaughtException", (exception) => {
  console.log(exception);
});
process.on("unhandledRejection", (rejection) => {
  console.log(rejection);
});

require("dotenv").config();
const cors = require("cors");
const express = require("express");
const app = express();

const PORT = 3000;

app.use(cors());
const patientsRouter = require("./routes/patients");

app.use(express.json({ limit: "25mb" }));
app.use("/patients", patientsRouter);

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});
