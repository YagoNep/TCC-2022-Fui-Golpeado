import express from 'express';
import url from 'url';
import path from 'path';
import fileupload from 'express-fileupload';
import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth2';
import session from 'express-session';
import 'dotenv/config';
import { profile } from 'console';
import database from './database.js';

var userProfile;

//se não estiver logado ele não permite acesso, redirecionando para a página de login novamente
function isLoggedIn(req, res, next) {
    req.user ? next() : res.redirect('/login');
}

const app = express();
var __filename = url.fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);

app.listen(8080, () => console.log('Servidor rodando!'));

app.use((req, res, next) => {
    console.log(req.url);
    next();
});

app.use(fileupload());
app.use(express.json());
app.use(express.static(__dirname + '/site'));
app.use(session({
    resave:false,
    saveUninitialized: true,
    secret: 'calvo'
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new GoogleStrategy({
    clientID:     process.env.clientID,
    clientSecret: process.env.clientSecret,
    callbackURL: "http://localhost:8080/google/callback",
    passReqToCallback   : true
  },
  function(request, accessToken, refreshToken, profile, done) {
    userProfile = profile;
    return done(null, userProfile);
  }
));

passport.serializeUser((user, done) =>{
    done(null, user)
});

passport.deserializeUser((user,done)=>{
    done(null, user)
});

//colocar no banco de dados o path da imagem?
//cecchin deu a ideia de criar uma tabela de fotos, com ID da foto, ID do relato e nome da foto, daí ela seria salva numa pasta com o ID do cara, e as fotos poderiam ter qualquer nome
app.post('/', isLoggedIn, (req, res) =>{
    if (req.files) {
        console.log(req.files)
        var file = req.files.file
        var filename = file.name
        var nome = filename.split(".");
        var nomerealzao = nome[1];
        var nomerealzaozao = req.user.id + "." + nomerealzao; 
        console.log(nomerealzaozao);
    }

    file.mv('./site/img/'+nomerealzaozao, function (err) {
        if(err){
            res.send(err)
        }
        else {
            res.send("File Uploaded")
        }
    })
});

app.get('/', (req, res) => {
    res.header('Content-Type', 'text/html');
    res.sendFile(__dirname + '/site/views/login.html', function(err){
        if (err) {
            return res.status(err.status).end();
        } else {
            return res.status(200).end();
        }
    });
});

app.get('/app', isLoggedIn, async (req, res) => {
    res.send(await database.getAplicativos());
});

app.get('/imagem', isLoggedIn, (req, res) =>{
    let foto = '/img/' + req.user.id + ".jpg";
    console.log(foto);
    res.send([{foto: foto}]);
});

app.get('/login', (req, res) => {
    res.header('Content-Type', 'text/html');
    res.sendFile(__dirname + '/site/views/login.html', function(err){
        if (err) {
            return res.status(err.status).end();
        } else {
            return res.status(200).end();
        }
    });
});

app.get('/google',
    passport.authenticate('google', { scope: ['email', 'profile'] }
));

app.get('/google/callback',
    passport.authenticate( 'google', {
        successRedirect: '/inicio',
        failureRedirect: '/google/failure'
    })
);

app.get('/google/failure', async (req, res) =>{
    res.send("Deu errado!", function(err){
        if (err) {
            return res.status(err.status).end();
        } else {
            return res.status(200).end();
        }
    });
});

app.get('/logout', (req, res) =>{
    req.logout(function(err){
        if(err) {return next (err);}
        res.redirect('/');
    });
});

app.get('/user', (req, res) =>{
    res.send(userProfile);
});

app.get('/inicio', isLoggedIn, (req, res) =>{
    // if (req.user.id == "113860311129940378030"){                      //pra deixar uma página de admin!!!!!
    // res.header('Content-Type', 'text/html');
    // res.sendFile(__dirname + '/site/views/erro.html', function(err){
    //     if (err) {
    //         return res.status(err.status).end();
    //     } else {
    //         return res.status(200).end();
    //     }
    // });
    // }
    // else{
    res.header('Content-Type', 'text/html');
    res.sendFile(__dirname + '/index.html', function(err){
        if (err) {
            return res.status(err.status).end();
        } else {
            return res.status(200).end();
        }
    });
    // }
});

app.get('*', (req, res) => {
    res.header('Content-Type', 'text/html');
    res.sendFile(__dirname + '/site/views/erro.html', function(err){
        if (err) {
            return res.status(err.status).end();
        } else {
            return res.status(200).end();
        }
    });
});