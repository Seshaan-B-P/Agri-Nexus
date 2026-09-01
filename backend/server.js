const app = require("./app");
require("dotenv").config();

const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;


// Connect to MongoDB
connectDB();

//Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
