var pool = require("./connection");
var express = require('express');
var app = express();
var path = require('path');
var bodyparser = require('body-parser');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));
const connection = require('./connection');


app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

app.get("/home", (req, res) => {
    res.sendFile("login.html", { root: __dirname });
});

app.post("/contact", (req, res) => {
    console.log(req.body);

    var logemail = req.body.Email_address;  
    var logpassword = req.body.password;  

    pool.getConnection(function(error, connection) {
        if (error) {
            console.error("Error getting database connection:", error);
            return res.status(500).send("Error getting database connection");
        }

        var sql = "SELECT * FROM aregister WHERE Email = ? AND Password = ?";
        connection.query(sql, [logemail, logpassword], function(err, result) {
            if (err) {
                console.error("Error executing SQL query:", err);
                connection.release(); // Release the connection back to the pool
                return res.status(500).send("Error executing SQL query");
            }
            
            if (result.length === 1) {
                // User found, authenticate the user
                // Insert the email and password into the login table
                var insertLoginQuery = "INSERT INTO login (Email, Password) VALUES (?, ?)";
                connection.query(insertLoginQuery, [logemail, logpassword], function(err, result) {
                    if (err) {
                        console.error("Error inserting into login table:", err);
                        connection.release(); // Release the connection back to the pool
                        return res.status(500).send("Error inserting into login table");
                    }
                    
                    // Redirect to dashboard upon successful login
                    res.redirect("/dashboards");
                });
            } else {
                // User not found or incorrect password, redirect back to login page with error message
                res.redirect("error=invalid_credentials");
            }

            connection.release(); // Release the connection back to the pool
        });
    });
});

app.post('/register', function(req, res) {
    console.log(req.body);

    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;

    // Perform any necessary validation

    pool.getConnection(function(error, connection) {
        if (error) {
            console.error("Error getting database connection:", error);
            return res.status(500).send("Error getting database connection");
        }

        // Insert new user data into the aregister table
        var insertUserQuery = "INSERT INTO aregister (Username, Email, Password) VALUES (?, ?, ?)";
        connection.query(insertUserQuery, [username, email, password], function(err, result) {
            if (err) {
                console.error("Error executing SQL query:", err);
                connection.release(); // Release the connection back to the pool
                return res.status(500).send("Error executing SQL query");
            }

            // Check if user was successfully registered in aregister table
            if (result.affectedRows > 0) {
                // Insert email and password into the login table
                var insertLoginQuery = "INSERT INTO login (Email, Password) VALUES (?, ?)";
                connection.query(insertLoginQuery, [email, password], function(err, result) {
                    connection.release(); // Release the connection back to the pool
                    if (err) {
                        console.error("Error executing SQL query:", err);
                        return res.status(500).send("Error executing SQL query");
                    }
                    
                    // Check if email and password were successfully inserted into the login table
                    if (result.affectedRows > 0) {
                        // Registration successful
                        res.status(200).send("User registered successfully.");
                    } else {
                        // Failed to insert email and password into the login table
                        res.status(500).send("Failed to register user.");
                    }
                });
            } else {
                // Registration failed
                res.status(500).send("Failed to register user.");
            }
        });
    });
});

app.get("/forms", (req, res) => {
    res.sendFile("form.html", { root: __dirname });
});

app.post("/form", (req, res) => {
    var Representative_Name = req.body.Representative_Name;
    var Lead_Name = req.body.Lead_Name;
    var Dob = req.body.Dob;
    var Email = req.body.Email;
    var Mobile_Number = req.body.Mobile_Number;
    var Address = req.body.Address;
    var Mode_of_Contact = req.body.Mode_of_Contact;
    var Type_of_loan = req.body.Type_of_loan;
    
    pool.getConnection(function(error, connection) {
        if (error) {
            console.error('Error getting database connection:', error);
            return res.status(500).send('Error getting database connection');
        }
    
        var sql = 'INSERT INTO leads (Representative_Name, Lead_Name, Dob, Email, Mobile_Number, Address, Mode_of_Contact, Type_of_loan) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        var values = [Representative_Name, Lead_Name, Dob, Email, Mobile_Number, Address, Mode_of_Contact, Type_of_loan];
    
        connection.query(sql, values, function(err, result) {
            connection.release();
    
            if (err) {
                console.error('Error executing SQL query:', err);
                return res.status(500).send('Error executing SQL query');
            }
    
            console.log('Lead added successfully');
            res.status(200).json({ message: 'Lead added successfully' });
        });
    });
});
app.get("/dashboards", (req, res) => {
    res.sendFile("dashboard.html", { root: __dirname });
});

app.post("/dashboard", (req, res) => {
    console.log(req.body);
    res.send("Received POST request for /dashboard");
});
app.get("/indexx", (req, res) => {
    res.sendFile("index.html", { root: __dirname });
});

app.post("/index", (req, res) => {
    console.log(req.body);
    res.send("Received POST request for /index");
});

app.get("/accesss", (req, res) => {
    res.sendFile("access.html", { root: __dirname });
});

app.post("/access", (req, res) => {
    console.log(req.body);
    res.send("Received POST request for /access");
});
app.get("/products", (req, res) => {
    res.sendFile("product.html", { root: __dirname });
});

app.post("/product", (req, res) => {
    console.log(req.body);
    res.send("Received POST request for /product");
});
app.get("/contactts", (req, res) => {
    res.sendFile("ulogin.html", { root: __dirname });
});

app.post("/contactt", (req, res) => {
    console.log(req.body);

    var logemail = req.body.Email_address;  
    var logpassword = req.body.password;  

    pool.getConnection(function(error, connection) {
        if (error) {
            console.error("Error getting database connection:", error);
            return res.status(500).send("Error getting database connection");
        }

        var sql = "SELECT * FROM uregister WHERE Email = ? AND Password = ?";
        connection.query(sql, [logemail, logpassword], function(err, result) {
            if (err) {
                console.error("Error executing SQL query:", err);
                connection.release(); // Release the connection back to the pool
                return res.status(500).send("Error executing SQL query");
            }
            
            if (result.length === 1) {
                // User found, authenticate the user
                // Insert the email and password into the login table
                var insertLoginQuery = "INSERT INTO ulogin (Email, Password) VALUES (?, ?)";
                connection.query(insertLoginQuery, [logemail, logpassword], function(err, result) {
                    if (err) {
                        console.error("Error inserting into login table:", err);
                        connection.release(); // Release the connection back to the pool
                        return res.status(500).send("Error inserting into login table");
                    }
                    
                    // Redirect to dashboard upon successful login
                    res.redirect("/front");
                });
            } else {
                // User not found or incorrect password, redirect back to login page with error message
                res.redirect("error=invalid_credentials");
            }

            connection.release(); // Release the connection back to the pool
        });
    });
});

app.post('/registerr', function(req, res) {
    console.log(req.body);

    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;

    // Perform any necessary validation

    pool.getConnection(function(error, connection) {
        if (error) {
            console.error("Error getting database connection:", error);
            return res.status(500).send("Error getting database connection");
        }

        // Insert new user data into the aregister table
        var insertUserQuery = "INSERT INTO uregister (Username, Email, Password) VALUES (?, ?, ?)";
        connection.query(insertUserQuery, [username, email, password], function(err, result) {
            if (err) {
                console.error("Error executing SQL query:", err);
                connection.release(); // Release the connection back to the pool
                return res.status(500).send("Error executing SQL query");
            }

            // Check if user was successfully registered in aregister table
            if (result.affectedRows > 0) {
                // Insert email and password into the login table
                var insertLoginQuery = "INSERT INTO ulogin (Email, Password) VALUES (?, ?)";
                connection.query(insertLoginQuery, [email, password], function(err, result) {
                    connection.release(); // Release the connection back to the pool
                    if (err) {
                        console.error("Error executing SQL query:", err);
                        return res.status(500).send("Error executing SQL query");
                    }
                    
                    // Check if email and password were successfully inserted into the login table
                    if (result.affectedRows > 0) {
                        // Registration successful
                        res.status(200).send("User registered successfully.");
                    } else {
                        // Failed to insert email and password into the login table
                        res.status(500).send("Failed to register user.");
                    }
                });
            } else {
                // Registration failed
                res.status(500).send("Failed to register user.");
            }
        });
    });
});

app.get("/eloans", (req, res) => {
    res.sendFile("eloan.html", { root: __dirname });
});

app.post("/eloan", (req, res) => {
    console.log(req.body); // This line logs the received data to the console
    
    // Extract data from the request body
    var { Student_Name, Father_Or_Guardian_Name, E_Mail, DOB, Marital_Status, Gender, Category, Highest_Education } = req.body;

    // Now, you need to insert this data into your database
    pool.getConnection(function(error, connection) {
        if (error) {
            console.error("Error getting database connection:", error);
            return res.status(500).send("Error getting database connection");
        }

        // Define your SQL query to insert data into the database
        var sql = "INSERT INTO eloan (Student_Name, Father_Or_Guardian_Name, E_Mail, DOB, Marital_Status, Gender, Category, Highest_Education) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

        // Execute the SQL query with the provided data
        connection.query(sql, [Student_Name, Father_Or_Guardian_Name, E_Mail, DOB, Marital_Status, Gender, Category, Highest_Education], function(err, result) {
            connection.release(); // Release the connection back to the pool
            
            if (err) {
                console.error("Error executing SQL query:", err);
                return res.status(500).send("Error executing SQL query");
            }

            // Check if the data was successfully inserted into the database
            if (result.affectedRows > 0) {
                // Data inserted successfully
                res.status(200).send("Data inserted successfully.");
            } else {
                // Failed to insert data
                res.status(500).send("Failed to insert data.");
            }
        });
    });
});

app.get("/submits", (req, res) => {
    res.sendFile("submit.html", { root: __dirname });
});

app.post("/submit", (req, res) => {
    console.log(req.body);
    res.send("Received POST request for /submit");
});
app.get("/logins", (req, res) => {
    res.sendFile("newlogin.html", { root: __dirname });
});

app.post("/login", (req, res) => {
    console.log(req.body);
    res.send("Received POST request for /login");
});
app.get("/signups", (req, res) => {
    res.sendFile("newlogin.html", { root: __dirname });
});

app.post("/signup", (req, res) => {
    console.log(req.body);
    res.send("Received POST request for /signup");
});

app.get("/profile", (req, res) => {
    res.sendFile("profile.html", { root: __dirname });
});

app.post("/profile", (req, res) => {
    console.log(req.body);
    res.send("Received POST request for /profile");
});

app.get("/uprofile", (req, res) => {
    res.sendFile("uprofile.html", { root: __dirname });
});

app.post("/uprofile", (req, res) => {
    console.log(req.body);
    res.send("Received POST request for /uprofile");
});
app.get("/campaign", (req, res) => {
    res.sendFile("campaign.html", { root: __dirname });
});

app.post("/campaign", (req, res) => {
    console.log(req.body);
    res.send("Received POST request for /campaign");
});

app.get("/social", (req, res) => {
    res.sendFile("social.html", { root: __dirname });
});

app.post("/social", (req, res) => {
    console.log(req.body);
    res.send("Received POST request for /social");
});

app.get("/call", (req, res) => {
    res.sendFile("call.html", { root: __dirname });
});

app.post("/call", (req, res) => {
    console.log(req.body);
    res.send("Received POST request for /call");
});

app.get("/view", (req, res) => {
    res.sendFile("view.html", { root: __dirname });
});

app.post("/view", (req, res) => {
    console.log(req.body);
    res.send("Received POST request for /view");
});
app.get("/lead", (req, res) => {
    res.sendFile("lead.html", { root: __dirname });
});

app.post("/lead", (req, res) => {
    console.log(req.body);
    res.send("Received POST request for /lead");
});

app.get("/leform", (req, res) => {
    res.sendFile("leform.html", { root: __dirname });
});

app.post("/leform", (req, res) => {
    var Representative_Name = req.body.Representative_Name;
    var Lead_Name = req.body.Lead_Name;
    var dob = req.body.dob;
    var Email = req.body.Email;
    var Mobile_Number = req.body.Mobile_Number;
    var Address = req.body.Address;
    var Mode_of_Contact = req.body.Mode_of_Contact;
    var Type_of_loan = req.body.Type_of_loan;
    
    pool.getConnection(function(error, connection) {
        if (error) {
            console.error('Error getting database connection:', error);
            return res.status(500).send('Error getting database connection');
        }
    
        var sql = 'INSERT INTO leads (Representative_Name, Lead_Name, Dob, Email, Mobile_Number, Address, Mode_of_Contact, Type_of_loan) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        var values = [Representative_Name, Lead_Name, dob, Email, Mobile_Number, Address, Mode_of_Contact, Type_of_loan];
    
        connection.query(sql, values, function(err, result) {
            connection.release();
    
            if (err) {
                console.error('Error executing SQL query:', err);
                return res.status(500).send('Error executing SQL query');
            }
    
            console.log('Lead added successfully');
            res.status(200).json({ message: 'Lead added successfully' });
        });
    });
});


app.get("/task", (req, res) => {
    res.sendFile("task.html", { root: __dirname });
});

app.post("/task", (req, res) => {
    console.log(req.body);
    res.send("Received POST request for /task");
});

app.get("/emicalculator", (req, res) => {
    res.sendFile("emicalculator.html", { root: __dirname });
});

app.post("/emicalculator1", (req, res) => {
    console.log(req.body);
    res.send("Received POST request for /emicalculator");
});
app.get("/emicalculator1", (req, res) => {
    res.sendFile("emicalculator1.html", { root: __dirname });
});

app.post("/emicalculator1", (req, res) => {
    console.log(req.body);
    res.send("Received POST request for /emicalculator1");
});

app.get("/contact", (req, res) => {
    res.sendFile("contact.html", { root: __dirname });
});

app.post("/contact", (req, res) => {
    console.log(req.body);
    res.send("Received POST request for /contact");
});

app.get("/calender", (req, res) => {
    res.sendFile("calender.html", { root: __dirname });
});

app.post("/calender", (req, res) => {
    console.log(req.body);
    res.send("Received POST request for /calender");
});
app.get("/front", (req, res) => {
    res.sendFile("front.html", { root: __dirname });
});

app.post("/front", (req, res) => {
    console.log(req.body);
    res.send("Received POST request for /front");
});
app.get("/about", (req, res) => {
    res.sendFile("about.html", { root: __dirname });
});

app.post("/about", (req, res) => {
    console.log(req.body);
    res.send("Received POST request for /about");
});

app.get("/homee", (req, res) => {
    res.sendFile("home.html", { root: __dirname });
});

app.post("/homee", (req, res) => {
    console.log(req.body);
    res.send("Received POST request for /homee");
});

app.get("/hform", (req, res) => {
    res.sendFile("hform.html", { root: __dirname });
});

app.post("/hform", (req, res) => {
    console.log(req.body);
    res.send("Received POST request for /hform");
});

app.get("/education", (req, res) => {
    res.sendFile("education.html", { root: __dirname });
});

app.post("/education", (req, res) => {
    console.log(req.body);
    res.send("Received POST request for /education");
});

app.get("/gold", (req, res) => {
    res.sendFile("gold.html", { root: __dirname });
});

app.post("/gold", (req, res) => {
    console.log(req.body);
    res.send("Received POST request for /gold");
});

app.get("/tnc", (req, res) => {
    res.sendFile("tnc.html", { root: __dirname });
});

app.post("/tnc", (req, res) => {
    console.log(req.body);
    res.send("Received POST request for /tnc");
});

app.get("/gform", (req, res) => {
    res.sendFile("gform.html", { root: __dirname });
});

app.post("/gform", (req, res) => {
    console.log(req.body);
    res.send("Received POST request for /gform");
});

app.get("/consent", (req, res) => {
    res.sendFile("consent.html", { root: __dirname });
});

app.post("/consent", (req, res) => {
    console.log(req.body);
    res.send("Received POST request for /consent");
});

app.get("/vehicle", (req, res) => {
    res.sendFile("vehicle.html", { root: __dirname });
});

app.post("/vehicle", (req, res) => {
    console.log(req.body);
    res.send("Received POST request for /vehicle");
});
app.get("/property", (req, res) => {
    res.sendFile("property.html", { root: __dirname });
});

app.post("/property", (req, res) => {
    console.log(req.body);
    res.send("Received POST request for /property");
});

app.get("/pform", (req, res) => {
    res.sendFile("pform.html", { root: __dirname });
});

app.post("/pform", (req, res) => {
    console.log(req.body);
    res.send("Received POST request for /pform");
});

app.get("/personal", (req, res) => {
    res.sendFile("personal.html", { root: __dirname });
});

app.post("/personal", (req, res) => {
    console.log(req.body);
    res.send("Received POST request for /personal");
});

app.get("/peform", (req, res) => {
    res.sendFile("peform.html", { root: __dirname });
});

app.post("/peform", (req, res) => {
    console.log(req.body);
    res.send("Received POST request for /peform");
});

app.get("/vform", (req, res) => {
    res.sendFile("vform.html", { root: __dirname });
});

app.post("/vform", (req, res) => {
    console.log(req.body);
    res.send("Received POST request for /vform");
});
app.get("/nhform", (req, res) => {
    res.sendFile("nhform.html", { root: __dirname });
});

app.post("/nhform", (req, res) => {
    console.log(req.body);
    res.send("Received POST request for /nhform");
});

app.get("/neform", (req, res) => {
    res.sendFile("neform.html", { root: __dirname });
});

app.post("/neform", (req, res) => {
    console.log(req.body);
    res.send("Received POST request for /neform");
});

app.get("/npform", (req, res) => {
    res.sendFile("npform.html", { root: __dirname });
});

app.post("/npform", (req, res) => {
    console.log(req.body);
    res.send("Received POST request for /npform");
});

app.get("/nvform", (req, res) => {
    res.sendFile("nvform.html", { root: __dirname });
});

app.post("/nvform", (req, res) => {
    console.log(req.body);
    res.send("Received POST request for /nvform");
});
app.get("/ngform", (req, res) => {
    res.sendFile("ngform.html", { root: __dirname });
});

app.post("/ngform", (req, res) => {
    console.log(req.body);
    res.send("Received POST request for /ngform");
});

app.get("/lead1", (req, res) => {
    res.sendFile("lead1.html", { root: __dirname });
});

app.post("/lead1", (req, res) => {
    console.log(req.body);
    res.send("Received POST request for /lead1");
});

app.get("/lead2", (req, res) => {
    res.sendFile("totallead.html", { root: __dirname });
});

app.post("/lead2", (req, res) => {
    console.log(req.body);
    res.send("Received POST request for /lead2");
});

app.get("/call1", (req, res) => {
    res.sendFile("call1.html", { root: __dirname });
});

app.post("/call1", (req, res) => {
    console.log(req.body);
    res.send("Received POST request for /call1");
});

app.get("/campaign1", (req, res) => {
    res.sendFile("campaign1.html", { root: __dirname });
});

app.post("/campaign1", (req, res) => {
    console.log(req.body);
    res.send("Received POST request for/campaign1");
});

app.get("/event1", (req, res) => {
    res.sendFile("event1.html", { root: __dirname });
});

app.post("/event1", (req, res) => {
    console.log(req.body);
    res.send("Received POST request for/event1");
});

app.get("/monthly1", (req, res) => {
    res.sendFile("monthly1.html", { root: __dirname });
});

app.post("/monthly1", (req, res) => {
    console.log(req.body);
    res.send("Received POST request for/monthly1");
});

app.get("/social1", (req, res) => {
    res.sendFile("social1.html", { root: __dirname });
});

app.post("/social1", (req, res) => {
    console.log(req.body);
    res.send("Received POST request for/social1");
});

app.get("/weekly1", (req, res) => {
    res.sendFile("weekly.html", { root: __dirname });
});

app.post("/weekly1", (req, res) => {
    console.log(req.body);
    res.send("Received POST request for/weekly1");
});

app.get("/submit1", (req, res) => {
    res.sendFile("submit1.html", { root: __dirname });
});

app.post("/submit1", (req, res) => {
    console.log(req.body);
    res.send("Received POST request for /submit1");
});

app.get("/ceform", (req, res) => {
    res.sendFile("ceform.html", { root: __dirname });
});

app.post("/ceform", (req, res) => {
    console.log(req.body);
    res.send("Received POST request for /ceform");
});

// Define endpoint to fetch count of IDs from uregister table
app.get('/getCount', (req, res) => {
    connection.query('SELECT COUNT(id) AS idCount FROM uregister', (error, results) => {
      if (error) {
        console.error('Error fetching data from MySQL: ' + error.stack);
        res.status(500).send('Internal Server Error');
        return;
      }
      res.json({ count: results[0].idCount });
    });
  });

  // Define endpoint to fetch count of IDs from leads table
app.get('/getCount1', (req, res) => {
    connection.query('SELECT COUNT(id) AS idCount FROM leads', (error, results) => {
      if (error) {
        console.error('Error fetching data from MySQL: ' + error.stack);
        res.status(500).send('Internal Server Error');
        return;
      }
      res.json({ count: results[0].idCount });
    });
  });

app.get('/data', function(req, res) {
    pool.query('SELECT id,Username,email,date_added FROM uregister', function(error, results) {
        if (error) {
            console.error('Error fetching data from database:', error);
            res.status(500).send('Error fetching data from database');
        } else {
            res.json(results);
        }
    });
});


app.get('/data1', function(req, res) {
    pool.query('SELECT id, Representative_Name, Lead_Name, Email, Mode_of_Contact FROM leads ORDER BY id DESC LIMIT 5', function(error, results) {
        if (error) {
            console.error('Error fetching data from database:', error);
            res.status(500).send('Error fetching data from database');
        } else {
            res.json(results);
        }
    });
});

app.get('/data11', function(req, res) {
    pool.query('SELECT id, Representative_Name, Lead_Name, Email, Mode_of_Contact FROM leads ORDER BY id DESC', function(error, results) {
        if (error) {
            console.error('Error fetching data from database:', error);
            res.status(500).send('Error fetching data from database');
        } else {
            res.json(results);
        }
    });
});

// Define endpoint to fetch total count of IDs from both tables
app.get('/getTotalLeadsCount', (req, res) => {
    connection.query('SELECT (SELECT COUNT(id) FROM uregister) + (SELECT COUNT(id) FROM leads) AS totalCount', (error, results) => {
        if (error) {
            console.error('Error fetching total leads count from MySQL: ' + error.stack);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.json({ totalCount: results[0].totalCount });
    });
});

app.get('/mergedData', function(req, res) {
    var query = `
        SELECT ROW_NUMBER() OVER (ORDER BY id) AS lead_id, name, email
        FROM (
            SELECT id, Lead_Name AS name, Email AS email
            FROM leads
            UNION ALL
            SELECT id, Username AS name, Email AS email
            FROM uregister
        ) AS merged_data`;

    pool.query(query, function(error, results) {
        if (error) {
            console.error('Error fetching merged data from database:', error);
            res.status(500).send('Error fetching merged data from database');
        } else {
            res.json(results);
        }
    });
});

app.get("/payment", (req, res) => {
    res.sendFile("payment.html", { root: __dirname });
});

app.post("/payment", (req, res) => {
    console.log(req.body);
    res.send("Received POST request for /payment");
});











module.exports = app;
