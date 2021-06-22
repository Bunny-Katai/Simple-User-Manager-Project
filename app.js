const express = require('express');
const fs = require('fs');
const jsonFile = require('./usersList.json');
const path = require('path');
const { v4: uuidv4 } = require('uuid');


const app = express();

app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')))

app.set('views','./views' );
app.set('view engine', 'pug');

app.get('/', (req, res)=> {
    let users;
    fs.readFile('./usersList.json', (error, data) => {
        if (error) {
            throw error;
        }
        users = JSON.parse(data);
        res.render('index', { users: users });
    });
});

app.get('/create', (req, res) => {
    res.render('form');
})
        
app.get('/users/:uuid', (req,res) => {
    fs.readFile('./usersList.json', (error, data) => {
        if (error) {
            throw error;
        }
        let users = JSON.parse(data);
        let user = users.find(
            _user => _user.uuid === req.params.uuid
        );
        res.render('edit', { user: user });
    })
})

app.post('/users/:uuid', (req, res) => {
    const update = {
        uuid: req.params.uuid,
        userId: req.body.userId,
        name: req.body.name,
        email: req.body.email,
        age: req.body.age
    };

    fs.readFile('./usersList.json', (error, data) => {
        if (error) {
            throw error;
        }
        const users = JSON.parse(data);
        users.splice(users.findIndex(_user => _user.uuid === req.params.uuid), 1);
        users.push(update);
        fs.writeFile('./usersList.json', JSON.stringify(users), () => {
            res.redirect('/');
        })
    });
});

app.get('/delete/:uuid', (req, res) => {
    fs.readFile('./usersList.json', (error, data) => {
        if (error) {
            throw error;
        }
        const users = JSON.parse(data);
        users.splice(users.findIndex(_user => _user.uuid === req.params.uuid), 1);
        fs.writeFile('./usersList.json', JSON.stringify(users), () => {
            res.redirect('/');
        });
    });
});

app.post('/create', (req, res) => {
    const user = {
        uuid: uuidv4(),
        userId: req.body.userId,
        name: req.body.name,
        email: req.body.email,
        age: req.body.age
    };

    fs.readFile('./usersList.json', (error, data)=> {
        if (error) {
            throw error;
        }
        const users = JSON.parse(data);
        users.push(user);
        fs.writeFile('./usersList.json', JSON.stringify(users), () => {
            res.redirect('/')
        });
    });
});

app.all('*', (req, res) => {
    res.redirect('/');
})

app.listen(3005 , () => {
    console.log('Listening on port 3005')
})