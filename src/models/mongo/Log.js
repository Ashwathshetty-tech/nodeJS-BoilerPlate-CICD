import mongoose from 'mongoose';

const logSchema = new mongoose.Schema(
  {
    method: String,
    url: String,
    headers: Object,
    body: Object,
    responseBody: Object,
    statusCode: Number,
    responseTime: Number,
    timestamp: { type: Date, default: Date.now }
  }
);


export const Log = mongoose.model('Log', logSchema);

Log.collection.createIndex({ timestamp: 1 }, { expireAfterSeconds: 604800 }); // 7 days = 604800 seconds

