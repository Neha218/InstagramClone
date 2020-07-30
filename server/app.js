const express = require("express");
const connectDB = require("./config/db");
const app = express();

connectDB();

require("./models/User");
require("./models/Post");

app.use(express.json());
app.use(require("./routes/auth"));
app.use(require("./routes/post"));
app.use(require("./routes/user"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on the port ${PORT}`));
