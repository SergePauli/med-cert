// скрипт запуска сервера на Node.js
const express = require("express")
const path = require("path")
const app = express()
const PORT_LISTEN = 3000

app.use(express.static(path.join(__dirname, "build")))

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"))
})

app.listen(PORT_LISTEN)
console.log(`Сервер приложения запущен и принимает http запросы на ${PORT_LISTEN} порту.`)
console.log("для остановки используйте CTRL+C....")
