const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cors = require('cors');
// const setupAssociations = require('./models/associations');
// const sequelize = require('./config/database');
const sequelize = require('./config/database');
// console.log('sequelize',sequelize);
const app = express();
app.use(cors());
app.use(cookieParser()); // Use cookie-parser to parse cookies

sequelize.sync()
    .then(()=>{
        console.log('Database synced');
    })
    .catch((err)=>{
        console.error('Error synchronizing the database:',err);
    })

// Session middleware setup
app.use(session({
    secret: '123456',
    // resave: false,
    saveUninitialized: true,
    // cookie: { secure: false }
    cookie: { maxAge: 30000 }
}))

const blogRoutes = require('./routes/blogRouter');
const userRoutes = require('./routes/userRoutes');

const port = 3000;

// Middleware to parse JSON
app.use(express.json());

app.use('/blog', blogRoutes)
app.use('/users', userRoutes);


app.listen(port, () => {
    console.log('server started on port: ' + port);
})