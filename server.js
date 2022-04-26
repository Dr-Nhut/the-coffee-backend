const app = require("./app");
const config = require("./app/config");
const mongoose = require("mongoose");

mongoose.connect(config.db.uri) 
    .then(() => {
        console.log("Contacted to the database!");
    })
    .catch ((error) => {
        console.log("Cannot connect to the database!", error);
    });


const PORT = config.app.port;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});