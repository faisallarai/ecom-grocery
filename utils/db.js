import mongoose from 'mongoose';

const connect = () => {
  if (mongoose.connections[0].readyState === 1) {
    console.log('Already connected');
    return;
  }

  mongoose.connect(
    process.env.MONGODB_URL,
    {
      useCreateIndex: true,
      useFindAndModify: false,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    (err) => {
      if (err) throw err;
      console.log('Connected to mongodb');
    }
  );
};

const db = {
  connect,
};

export default db;
