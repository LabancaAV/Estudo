const express = require("express");
const server = express();
server.use(express.json());
const projects = [];
let numberOfRequests = 0;
//console.log(express);

function infoRequest(req, res, next) {
  console.time("Request");

  console.log(`Método: ${req.method}; URL: ${req.url}`);

  console.timeEnd("Request");

  return next();
}
server.use(infoRequest);

function numeroRequests(req, res, next) {
  numberOfRequests++;

  console.log(`Número de requisições ${numberOfRequests}`);

  return next();
}

server.use(numeroRequests);

function VerificaExistencia(req, res, next) {
  const { id } = req.params;

  const project = projects.find(p => p.id === id);

  if (!project) {
    return res.status(400).json({ erro: "Project does not exists." });
  }

  return next();
}

server.post("/projects", (req, res) => {
  const { id, title } = req.body;

  const project = {
    id,
    title,
    tasks: []
  };

  projects.push(project);

  return res.json(project);
});

server.get("/projects", (req, res) => {
  return res.json(projects);
});

server.put("/projects/:id", VerificaExistencia, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id === id);

  project.title = title;

  return res.json(project);
});

server.delete("/projects/:id", VerificaExistencia, (req, res) => {
  const { id } = req.params;

  const delporIndex = projects.find(p => p.id === id);

  projects.splice(delporIndex, 1);

  return res.send();
});

server.post("/projects/:id/tasks", VerificaExistencia, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id === id);

  project.tasks.push(title);

  return res.json(project);
});

server.listen(3001);
