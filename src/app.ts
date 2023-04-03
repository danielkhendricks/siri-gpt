import express from 'express'
import axios from 'axios'
import { config } from 'dotenv'

config()

const app = express()

app.use(express.json())

app.post('/siri', async (req, res) => {
  const { text } = req.body
  // console.log(text)
  // Use the text from the Siri command to generate a response using the Chat GPT API
  const response = await generateResponse(text)

  //res.set('Content-Type', 'text/plain')
  res.json({ response })
})

async function generateResponse(content: string) {
  const url = 'https://api.openai.com/v1/chat/completions'
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    }
  }

  const requestData = {
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'user', content }
    ],
    temperature: 0.7
  }

  const response = await axios.post(url, requestData, config) as { data: PromptResponse }
  const data = response.data

  const generatedText = data.choices[0].message.content
  // console.log(generatedText)
  return generatedText
}

const port = 5489

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
