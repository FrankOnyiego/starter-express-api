const { createClient } = require('@supabase/supabase-js');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const supabaseUrl = 'https://pvhuagzgortrrspqzrmj.supabase.co/' //'https://tmbibeachgjbddijvtcu.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2aHVhZ3pnb3J0cnJzcHF6cm1qIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTM4OTUxODEsImV4cCI6MjAwOTQ3MTE4MX0.J152nqrrBKvHTx0inoUgGILB89Ebup_YLrW2HBbk5fw' //'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRtYmliZWFjaGdqYmRkaWp2dGN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTUyNzQwNTMsImV4cCI6MjAxMDg1MDA1M30.k2USg2yeAZFtC0fam46pdUbjemOtIMdEKYb8hjxKr2E'
const supabase = createClient(supabaseUrl, supabaseKey)

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get('/auth/google/callback', async (req, res) => {
  console.log('superbase running');
  const authorizationCode = req.query.code;
});


app.post('/chat',(req,res)=>{
    res.json({"response":"Response from the server"})
})

app.post('/updatedatabase',async (req,res)=>{
    // Assuming you have obtained an access token and stored it in a variable
    const { accessToken, email, client_id, refresh_token, token_uri, client_secret, scopes, expiry } = req.body;

   // Define the table name in your Supabase project where you want to insert the token
   const tableName = 'slack_app';
 
   // Insert the access token into the specified table
   try {
    const { data, error } = await supabase
    .from(tableName)
    .upsert(
      [{ email: email, accesstoken: accessToken/*, client_id: client_id, refresh_token: accessToken, token_uri: 'https://oauth2.googleapis.com/token', client_secret: client_secret, scopes: scopes, expiry: expiry*/ }],
      { onConflict: ['email'], returning: ['*'] } // Use 'email' for conflict resolution
    );
  
 
     if (error) {
       console.error('Error inserting access token:', error);
       return res.status(500).send('Error inserting access token');
     }
 
     console.log('Access token inserted successfully:', data);
     res.status(200).send('Access token inserted successfully');
   } catch (err) {
     console.error('Error:', err);
     res.status(500).send('Internal server error');
   }
});

app.get('/mainusers', async (req, res) => {
  try {
    // Fetch all data from the 'mainusers' table
    const { data, error } = await supabase.from('slack_app').select('*');

    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.listen(8000,(error)=>{
    console.log("listening on 8000");
});
