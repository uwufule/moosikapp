import Mongoose from 'mongoose';
import Song from './song-model';

Mongoose.connect('mongodb+srv://root:qhRfNgzxOQWGwA0E@cluster-0-apz1k.mongodb.net/db', { useNewUrlParser: true });

export default {
  Song,
};
