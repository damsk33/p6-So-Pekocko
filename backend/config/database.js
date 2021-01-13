const mongoose = require('mongoose');
const MONGO_URL_LOCAL = process.env.MONGO_URL || 'mongodb+srv://damsk33:P6Sopekocko@cluster0.c2vpu.mongodb.net/<dbname>?retryWrites=true&w=majority';

mongoose.connect(MONGO_URL_LOCAL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
})
  .then(() => {
    console.log('Successfully connected to MongoDB!');
  })
  .catch((error) => {
    console.log('Unable to connect to MongoDB!');
    console.error(error);
  });
