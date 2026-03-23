import express from "express";
import { customAlphabet } from "nanoid";

const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";
const app = express();

let db = {};

const port = process.env.PORT || 8080;

app.use(logger);
import path from "path";


import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "../public")));

app.set("trust proxy", 1);

app.post("/shorten", (req, res) => {
  const link = req.query.link;
  const nanoid = customAlphabet(alphabet, 7);
  const host = req.protocol + "://" + req.get("host");
  const id = nanoid();
  db[id] = { id: id, link: link };
  res.set("Content-Type", "application/json");
  res.send({ link: `${host}/${id}` });
});

app.get("/db", (req, res) => {
  res.send(db);
});

app.get("/:id", (req, res) => {
  const id = req.params.id;
  try {
    res.on("finish", () => {
      const ip = req.ip;
      console.log(`${ip}`);
    });
    res.redirect(db[id].link);
  } catch (error) {
    res.status(404).send({ error: "invalid id or id not found" });
  }
});

function logger(req, res, next) {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(
      `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`,
    );
  });

  next();
}

// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });

export default app;