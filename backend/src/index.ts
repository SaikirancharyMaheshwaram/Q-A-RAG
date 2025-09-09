import app from "./server";
const PORT = process.env.PORT!;
app.listen(PORT, () => console.log(`server is listening on port ${PORT}`));
