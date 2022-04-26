const express = require("express");
const coffees = require("../controllers/coffee.controller");

module.exports = (app) => {
    const router = express.Router();

    router.get("/", coffees.findAll);

    router.post("/", coffees.create);

    router.delete("/", coffees.deleteAll);

    router.get("/:id", coffees.findOne);

    router.put("/:id", coffees.update);

    router.delete("/:id", coffees.delete);

    app.use("/api/coffees", router);
};