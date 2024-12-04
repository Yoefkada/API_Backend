const app = require("./app");
const errorHandler = require("./middleware/errorHandler");

app.use("/api", require("./routes/notes"));
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
