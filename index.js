const express = require('express');
const session = require('express-session');
const cors = require('cors');
// const setupAssociations = require('./models/associations');
// const sequelize = require('./config/database');
const sequelize = require('./config/database');
// console.log('sequelize',sequelize);
const app = express();
app.use(cors({
    credentials: true, // Allow cookies to be sent with requests
}));

sequelize.sync()
    .then(()=>{
        console.log('Database synced');
    })
    .catch((err)=>{
        console.error('Error synchronizing the database:',err);
    })

app.use(session({
    secret: '123456abc',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false, // Set to true if using HTTPS
        httpOnly: true, // Helps mitigate XSS
        maxAge: 1000 * 60 * 60 * 24 // Cookie expiry time (1 day)
    },
}));

// After defining all models
// setupAssociations();

const blogRoutes = require('./routes/blogRouter');
const userRoutes = require('./routes/userRoutes');

const port = 3000;

// Middleware to parse JSON
app.use(express.json());

app.use('/blog', blogRoutes)
app.use('/users', userRoutes);

// sequelize.sync()
//     .then(() => {
//         console.log('Database synced');
//     })
//     .catch(err => {
//         console.error('Error syncing the database:', err);
//     });

app.listen(port, () => {
    console.log('server started on port: ' + port);
})