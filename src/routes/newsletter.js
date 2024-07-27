const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const subscribersFilePath = path.join(__dirname, '../data/subscribers.json');

// Utility function to read subscribers from file
const readSubscribers = () => {
    const data = fs.readFileSync(subscribersFilePath, 'utf-8');
    return JSON.parse(data);
};

// Utility function to write subscribers to file
const writeSubscribers = (subscribers) => {
    fs.writeFileSync(subscribersFilePath, JSON.stringify(subscribers, null, 2), 'utf-8');
};

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
router.post('/', (req, res) => {
    const { email } = req.body;
    const subscribers = readSubscribers();
    if (subscribers.includes(email)) {
        return res.status(400).send('Email already subscribed.');
    }
    subscribers.push(email);
    writeSubscribers(subscribers);
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
router.delete('/:email', (req, res) => {
    const { email } = req.params;
    let subscribers = readSubscribers();
    if (!subscribers.includes(email)) {
        return res.status(404).send('Email not found.');
    }
    subscribers = subscribers.filter(subscriber => subscriber !== email);
    writeSubscribers(subscribers);
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
router.get('/:email', (req, res) => {
    const { email } = req.params;
    const subscribers = readSubscribers();
    if (subscribers.includes(email)) {
        return res.status(200).send('Email is subscribed.');
    }
    res.status(404).send('Email not subscribed.');
});

module.exports = router;
