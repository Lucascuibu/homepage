// api/hello.js
export default function handler(req, res) {
    res.status(200).json({ message: 'Hello from Serverless Function!' });
  }
console.log('Hello from Serverless Function!');