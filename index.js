require('dotenv').config();

const { PORT = 3001 , WEATHER_KEY } = process.env;

const express = require('express');
const server = express();

const axios = require('axios');

const morgan = require('morgan');
server.use(morgan('dev'));

const Quote = require('inspirational-quotes');

console.log(Quote.getQuote())

const cowsay = require('cowsay');

// const WEATHER_KEY = process.env.WEATHER_KEY;

console.log(WEATHER_KEY)

console.log(cowsay.say({
  text: "MooOooOoO!"
}));

server.get('/cowspiration', (req, res) => {
  const { text, author } = Quote.getQuote();

  const cow = cowsay.say({
    text: `${ text }\n\n- ${ author }`,
    W: 80,
});

res.send({ cow })
});


server.get('/hello', (req, res, next) => {
    res.send(`
    <html>
    <head></head>
    <body>
      <h3>Hello!</h3>
    </body>
    </html>
    `)
  });

  server.use(express.static('public'));

const bodyParser = require('body-parser');

server.use(bodyParser.json());
  server.use(bodyParser.urlencoded({ extended: false }));


  
server.post('/job-search', async (req, res) => {
  try {
    const { description, fulltime} = req.body;

    const URL = `https://jobs.github.com/positions.json?${
      description ? `description=${ description}&`: ''
    }${
      fulltime ? 'fulltime=true' : '' 
    
    }`;

    const { data } = await axios.get(URL);

    res.send({ results: data});
  }catch (error) {
     res.send({ error });
   }
}); 


server.get('/weather', async (req, res) => {
  try {
    const { lat , lon} = req.query;
    const URL = `https://api.openweathermap.org/data/2.5/onecall?lat=${ lat }&lon=${ lon }&appid=${ WEATHER_KEY }`;
    
    const { data } =await axios.get(URL);
    console.log('>>>>>>>>>data', data)

    res.send({results: data});
  
   }catch (error) {
    
    console.error(error)
    res.send({error})
  }

 })


server.listen(PORT, () => {
  console.log('I am listening...');
});


