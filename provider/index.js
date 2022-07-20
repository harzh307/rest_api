const express = require("express");
const app = express();
const Joi = require("joi");
const list = require("./courses");
const cors = require("cors");
const mongoose = require("mongoose");

// mongoose
//   .connect("mongodb://localhost/api")
//   .then(() => console.log("success mongo connection"))
//   .catch((err) => console.log(err));
const dbUrl =
  "mongodb+srv://harzhpatel:harsh!4945@cluster0.lug6i.mongodb.net/?retryWrites=true&w=majority";
mongoose
  .connect(dbUrl)
  .then(() => console.log("success mongo connection"))
  .catch((err) => console.log(err));

const courseScheme = new mongoose.Schema({
  username: String,
});

const Course = mongoose.model("Courses", courseScheme);

const silence = new Course({ username: "hello world" });

console.log(silence.username);

app.use(express.json());
const corsOpts = {
  origin: "*",

  methods: ["GET", "POST"],

  allowedHeaders: ["Content-Type"],
};

app.use(cors(corsOpts));

const courses = list;

app.get("/", (req, res) => {
  res.send("Hello");
});

app.get("/api/courses", (req, res) => {
  res.send({ data: courses });
});

const validateCourse = (course) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });
  return schema.validate(course.body);
};

app.get("/api/courses/:id", (req, res) => {
  const course = courses.find((x) => x.id === parseInt(req.params.id));
  if (!course) {
    res.status(404).send("Given id is not available");
  }
  res.send(course);
});

app.post(
  "/api/courses",
  (req, res) => {
    const result = validateCourse(req.body);
    if (result.error) {
      res.status(400).send(result.error.details[0].message);
    }
    const course = {
      id: courses.length + 1,
      name: req.body.name,
    };
    res.send({ courses, course });
  },
  (req, res) => {
    console.log({ req, res });
  }
);

app.put("/api/courses/:id", (req, res) => {
  const course = courses.find((x) => x.id === parseInt(req.params.id));
  if (!course) {
    res.status(404).send("Given id is not available");
  }
  const { error } = validateCourse(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
  }
  course.name = req.body.name;
  res.send(course);
  /*
  -look up the course
  -if not exist git 404
  -validate
  -if invalid , 400 - bad request
  -update course
  */
});

const port = process?.env?.PORT || 3000;

app.listen(port, () => {
  console.log(`listening on ${port}`);
});
