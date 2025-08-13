const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const aiRoutes = require('./routes/ai');
const mediaRoutes = require('./routes/media');
const config = require('./config');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api', aiRoutes);
app.use('/api', mediaRoutes);

const PORT = config.PORT || 4000;
app.listen(PORT, ()=> console.log('Server running on port', PORT));
