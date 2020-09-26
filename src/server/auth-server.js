const express = require('express');
const app = express();

const axios = require('axios');

const clientID = process.env.REACT_APP_CLIENT_ID;
const clientSecret = process.env.REACT_APP_CLIENT_SECRET;

app.get('/auth/user', (req, res) => {
  const requestToken = req.query.code;

  axios({
    method: 'post',
    url: `https://github.com/login/oauth/access_token?client_id=${clientID}&client_secret=${clientSecret}&code=${requestToken}`,
    headers: {
      accept: 'application/json',
    },
  }).then((response) => {
    const accessToken = response.data.access_token;
    console.log(response.data);

    res.redirect(`http://localhost:3000/?access_token=${accessToken}`);
  });
});

app.use(express.static(__dirname + '/public'));
app.listen(4000, () => {
  console.log('Server listening on port : 4000');
});
