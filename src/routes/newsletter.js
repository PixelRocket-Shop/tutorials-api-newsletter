const express = require('express');
const { MongoClient } = require('mongodb');
const router = express.Router();

// MongoDB connection URI
const uri = process.env.MONGODB_URI;

let client, db, subscribersCollection;

async function connectDB() {
    if (!client || !client.isConnected()) {
        client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        db = client.db('newsletter'); // Database name
        subscribersCollection = db.collection('subscribers');
    }
}

// Utility function to read subscribers from MongoDB
async function readSubscribers() {
    await connectDB();
    return await subscribersCollection.find().toArray();
}

// Utility function to write subscribers to MongoDB
async function writeSubscribers(email) {
    await connectDB();
    return await subscribersCollection.insertOne({ email });
}

// Utility function to delete a subscriber from MongoDB
async function deleteSubscriber(email) {
    await connectDB();
    return await subscribersCollection.deleteOne({ email });
}

/**
 * @swagger
 * /newsletter:
 *   post:
 *     summary: Sign up for the newsletter
 *     description: Add a new subscriber to the newsletter.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *     responses:
 *       200:
 *         description: Successfully signed up.
 *       400:
 *         description: Email already subscribed.
 */
router.post('/', async (req, res) => {
    const { email } = req.body;
    const subscribers = await readSubscribers();
    if (subscribers.find(subscriber => subscriber.email === email)) {
        return res.status(400).send('Email already subscribed.');
    }
    await writeSubscribers(email);
    res.status(200).send('Successfully signed up.');
});

/**
 * @swagger
 * /newsletter/{email}:
 *   delete:
 *     summary: Unsubscribe from the newsletter
 *     description: Remove a subscriber from the newsletter.
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully unsubscribed.
 *       404:
 *         description: Email not found.
 */
router.delete('/:email', async (req, res) => {
    const { email } = req.params;
    const result = await deleteSubscriber(email);
    if (result.deletedCount === 0) {
        return res.status(404).send('Email not found.');
    }
    res.status(200).send('Successfully unsubscribed.');
});

/**
 * @swagger
 * /newsletter/{email}:
 *   get:
 *     summary: Check if email is subscribed
 *     description: Check if an email is already subscribed to the newsletter.
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Email is subscribed.
 *       404:
 *         description: Email not subscribed.
 */
router.get('/:email', async (req, res) => {
    const { email } = req.params;
    const subscribers = await readSubscribers();
    if (subscribers.find(subscriber => subscriber.email === email)) {
        return res.status(200).send('Email is subscribed.');
    }
    res.status(404).send('Email not subscribed.');
});

module.exports = router;
