import express from "express";
import { customAlphabet } from "nanoid";

const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";
const app = express();

let db = {};

app.use(logger)
app.use(express.static("public"));

app.set('trust proxy', 1);


app.post("/shorten", (req, res) => {
  const link = req.query.link;
  const nanoid = customAlphabet(alphabet, 7);
  const host = req.protocol + '://' + req.get('host');
  const id = nanoid();
  db[id] = { id: id, link: link };
  res.set('Content-Type', 'application/json');
  res.send({ link: `${host}/${id}` });
});

app.get("/db", (req, res) => {
  res.send(db);
});

app.get("/:id", (req, res) => {
  const id = req.params.id;
  try {
    res.redirect(db[id].link)
  } catch (error) {
    res.status(404).send({error:"invalid id or id not found"})
  }
});

function logger(req, res, next) {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(
      `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`
    );
  });

  next();
}


app.listen(3000, () => {
  console.log('Server running on port 3000');
});
