const http = require("http");

const port = 3000;

const requestHandler = (request, response) => {
  response.end("Hello, this is a simple HTTP server!");
};

const server = http.createServer(requestHandler);

server.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});
