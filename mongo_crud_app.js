import express from 'express';
import mongoose from 'mongoose';

// MongoDB connection
mongoose.connect('mongodb://user:password@127.0.0.1:27019/S-Mongo?authSource=admin', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

const movieSchema = new mongoose.Schema({
  title: String,
  genre: String,
  rating: Number
});

// Create a model from the schema
const movieCollection = mongoose.model('Movie', movieSchema);

const app = express();
app.use(express.json());

// Create a new movie
app.post('/movies', async (req, res) => {
  const { title, genre, rating } = req.body;
  try {
    const result = await movieCollection.insertOne({ title, genre, rating });
    res.status(201).send(result.ops[0]);
  } catch (err) {
    res.status(400).send('Error: ' + err.message);
  }
});

// Read all movies
app.get('/movies', async (req, res) => {
  try {

  } catch (err) {
    res.status(400).send('Error: ' + err.message);
  }
});

// Update a movie
app.put('/movies/:id', async (req, res) => {
  try {

  } catch (err) {
    res.status(400).send('Error: ' + err.message);
  }
});

app.put('/movies/:id', async (req, res) => {
  const { id } = req.params;
  const { title, genre, rating } = req.body;

  try {
    const result = await movieCollection.updateOne( //db.movie
      { _id: new MongoClient.ObjectID(id) }, 
      { $set: { title, genre, rating } }
    );
    if (result.matchedCount === 0) {
      res.status(404).send('Movie not found');
    } else {
      res.status(200).send('Movie updated');
    }
  } catch (err) {
    res.status(400).send('Error: ' + err.message);
  }
});

// Update a movie
app.put('/movies/:id', async (req, res) => {
  const { id } = req.params;
  const { title, genre, rating } = req.body;

  try {
    const movie = await Movie.findByIdAndUpdate(id, { title, genre, rating }, { new: true });
    res.status(200).send(movie);
  } catch (err) {
    res.status(400).send('Error: ' + err.message);
  }
});

// Delete a movie
app.delete('/movies/:id', async (req, res) => {

  try {

  } catch (err) {
    res.status(400).send('Error: ' + err.message);
  }
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
