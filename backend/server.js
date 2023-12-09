const express = require("express");
const mysql = require('mysql');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));


const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Lordmarkpapa23!", 
    database: "signup",
    port: "3307"
})

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads'); // Specify the directory where uploaded files will be stored
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname); // Rename the file to avoid conflicts
    },
});
  
const upload = multer({ storage: storage });

app.post('/upload', upload.single('file'), (req, res) => {
    try {
      const file = req.file;
      if (!file) {
        return res.status(400).send('No file uploaded.');
      }
  
      // Access the file details using req.file
      const filePath = file.path;
      const originalName = file.originalname;
  
      // You can send back a response with the file details or save them in the database
      res.status(200).json({ filePath, originalName });
    } catch (error) {
      console.error('Error handling file upload:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  app.post('/bookEvent', upload.single('file'), (req, res) => {
    const {
      fname,
      lname,
      event_name,
      venue,
      numOf_people,
      start_date,
      end_date,
    } = req.body;
    
    const image_path = req.file ? req.file.filename : null;

    const sql = "INSERT INTO booked_events (`first_name`, `last_name`, `event_name`, `venue`, `numOf_people`, `start_date`, `end_date`, `image_path`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
      
    console.log(fname);
    db.query(
      sql,
      [fname, lname, event_name, venue, numOf_people, start_date, end_date, image_path],
      (err, result) => {
        console.log('Query result:', result);
        if (err) {
          console.error('Error inserting into database:', err.sqlMessage);
          return res.status(500).json({ error: 'Error booking event. Please try again.', details: err });
        }
        
        res.status(200).send('Event booked successfully!');
      }
    );
  });
  
app.post('/signup', (req, res) => {
    const sql = "INSERT INTO users ( `name`, `email`, `password`) VALUES (?)";
    const values = [
        req.body.name,
        req.body.email,
        req.body.password
    ]
    db.query(sql, [values], (err, data) => {
        if(err) {
            return res.json("Error");
        }
        return res.json(data);
    })
})
app.post('/login', (req, res) => {

    const sql = "SELECT * FROM users WHERE `email` = ? AND `password` = ? ";
    
    db.query(sql, [req.body.email, req.body.password], (err, data) => {
        if (err) {
            return res.json("Error");
        }
        console.log(req.body);
        console.log(data.length);
        if (data.length > 0) {
            if(req.body.email[0] === 'admin@gmail.com' && req.body.password[0] === '123'){
               return res.json({userType: "admin_access"}); 
            }else{
                return res.json({userType: "user"});
            }
        } else {
            return res.json("Failed");
        }
    });
});

app.get('/admin/users', (req, res) => {
    const sql = "SELECT * FROM booked_events";

    db.query(sql, (err, data) => {
        if (err) {
            return res.json("Error");
        }
        return res.json(data);
    });
});
app.post('/api/addEvent', (req, res) => {
    const { title, start, end } = req.body;
  
    // Assuming your SQL query for inserting data looks like this
    const sql = 'INSERT INTO events (`title` , `dates` ) VALUES (?, ?)';
    const values = [title, `${start} to ${end}`]; // Concatenate start and end dates or format as needed
    
    db.query(sql, values, (err, result) => {
      if (err) {
        console.error('Error:', err);
        return res.json({ success: false, message: 'Error adding event to the database' });
      }
  
      console.log('Event added to the database:', result);
      return res.json({ success: true, message: 'Event added to the database' });
    });
  });

app.get('/getBookedEvents', (req, res) => {
  const sql = "SELECT * FROM booked_events";

    db.query(sql, (err, data) => {
        if (err) {
        console.error('Error fetching booked events:', err);
        return res.status(500).json({ error: 'Error fetching booked events. Please try again.', details: err });
        }
        res.status(200).json(data);
    });
});


app.listen(8081, ()=> {
    console.log("listening");
})