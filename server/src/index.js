const express = require('express');
const cors    = require('cors');

const route = require('./routes/route');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health-check', (req, res) => {
  try {
    res.status(200).json({message: "API running!"});
  } catch (error) {
    res.status(error.status).json(error);
  }
})

app.use('/api', route);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API server listening on PORT:${PORT}`);
});

module.exports = app;
