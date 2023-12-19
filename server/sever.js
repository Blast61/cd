const app = express();
const PORT = 3000;
const path = require("path");

//parse incoming data
app.use(express.json());

app.use(express.static("index.html"));

//Global Error Handler
app.use((err, req, res, next) => {
  const def = {
    message: `Caught unkown err`,
    status: 500,
    log: {
      error: `Check server logs for more details`,
    },
  };
  const errorObj = Object.assign(def, err);
  return res.status(errorObj.status).json({ log: errorObj.log });
});
//Exposing the port
app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
