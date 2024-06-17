const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./database');
const cookieParser = require('cookie-parser');

const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(
  cors({
    origin: 'http://localhost:3000', // Allow requests from this origin
    credentials: true, // Allow cookies with credentials
  })
);
app.use(cookieParser()); // Use cookie-parser middleware

app.post('/validate-code', (req, res) => {
  const { companyCode } = req.body;

  db.get(
    'SELECT code FROM company_codes WHERE code = ?',
    [companyCode],
    (err, row) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (row) {
        res.cookie('companyCode', companyCode, {
          httpOnly: true,
          secure: false,
          maxAge: 90 * 24 * 60 * 60 * 1000,
        });
        return res.json({ valid: true });
      } else {
        return res.json({ valid: false });
      }
    }
  );
});

app.get('/check-login', (req, res) => {
  const companyCode = req.cookies.companyCode;
  if (companyCode) {
    res.json({ loggedIn: true, companyCode });
  } else {
    res.json({ loggedIn: false, companyCode });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
