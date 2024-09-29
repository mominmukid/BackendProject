const express = require('express');
const app = express();
const port = 3001;

let data=[1,2,3,4,5,6]

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/data', (req, res) => {
    res.json(data);
})

app.post('/data/:number', (req, res) => {
   const number = parseInt(req.params.number)   ;
   data.push(number);
   res.send(`Number ${number} has been added to the data`);
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

