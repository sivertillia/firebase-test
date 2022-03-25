require('dotenv').config()
const express = require('express')
const admin = require('firebase-admin')
const PORT = process.env.PORT || 8000
const app = express()

const adminConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
}

admin.initializeApp({
  credential: admin.credential.cert(adminConfig),
  databaseURL: process.env.FIREBASE_DB_URL,
})

app.use((req, res, next) => {
  if (req.method === 'OPTIONS') next()
  next()
})

app.get('/:token', async (req, res) => {
  const { token } = req.params
  res.json({})
  await admin.messaging().sendMulticast({
    tokens: [token],
    data: {},
    webpush: {
      fcmOptions: {
        link: 'http://localhost:3000/',
      },
    },
    notification: {
      title: 'Test title',
      body: 'Test body',
    },
  })
})

app.listen(PORT, () => {
  console.log(`Start server: http://localhost:${PORT}/`)
})