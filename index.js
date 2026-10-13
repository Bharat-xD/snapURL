const express = require('express');
const path = require('path');
const {connectToMongoDB} = require('./connect');
const urlRouter = require('./routes/route')
const staticRoute = require('./routes/staticRouter')
const URL = require('./models/model');
const app = express();
const PORT = 8001;

connectToMongoDB('mongodb://localhost:27017/short-url')
    .then(() => console.log("MongoDB connected Successfully!!"))
    .catch((err) => console.log("MongoDB connection error:", err));

app.set('view engine', 'ejs');
app.set("views", path.resolve("./views"))

app.use(express.json());
app.use(express.urlencoded({ extended: false} ));



app.use("/url", urlRouter);
app.use("/", staticRoute);


app.get('/url/:shortId', async (req, res) => {
    const shortId = req.params.shortId;

    const entry = await URL.findOneAndUpdate(
        { shortId },
        {
            $push: {
                visitHistory: {
                    timestamp: Date.now(),
                },
            },
        },
        { new: true }
    );

    if (!entry) {
        return res.status(404).send('Short URL not found');
    }

    return res.redirect(entry.redirectURL);
});


app.listen(PORT, () => console.log(`Server started at PORT: ${PORT}`));