const express = require("express");
const drinks = require("../controllers/coffee.controller");

module.exports = (app) => {
    const router = express.Router();

    router.get("/", drinks.findAll);

    router.post("/", drinks.create);

    router.delete("/", drinks.deleteAll);

    router.get("/cart", drinks.addToCart);

    router.get("/:id", drinks.findOne);

    router.put("/:id", drinks.update);

    router.delete("/:id", drinks.delete);

    app.use("/api/drinks", router);
};