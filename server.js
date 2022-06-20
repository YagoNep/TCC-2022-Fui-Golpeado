import express from 'express';
import url from 'url';
import path from 'path';
import fileupload from 'express-fileupload';
import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth2';
import session from 'express-session';

//se não estiver logado ele não permite acesso, redirecionando para a página de login novamente
function isLoggedIn(req, res, next) {
    req.user ? next() : res.header('Content-Type', 'text/html');
    res.sendFile(__dirname + '/site/views/login.html');
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
    clientID:     "983696481079-fed246nudrtjucuvstrael5bd8bq1hcj.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "http://localhost:8080/google/callback",
    passReqToCallback   : true
  },
  function(request, accessToken, refreshToken, profile, done) {
    return done(null, profile);
  }
));

passport.serializeUser((user, done) =>{
    done(null, user)
});

passport.deserializeUser((user,done)=>{
    done(null, user)
});

app.get('/', (req, res) => {
    res.header('Content-Type', 'text/html');
    res.sendFile(__dirname + '/site/views/login.html');
});
app.get('/login', (req, res) => {
    res.header('Content-Type', 'text/html');
    res.sendFile(__dirname + '/site/views/login.html');
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
    res.send("Deu errado")
});
app.get('/logout', (req, res) =>{
    req.logout(function(err){
        if(err) {return next (err);}
        res.redirect('/');
    });
});
app.get('/inicio', isLoggedIn, (req, res) =>{
    res.header('Content-Type', 'text/html');
    res.sendFile(__dirname + '/index.html');
});
app.get('*', (req, res) => {
    res.header('Content-Type', 'text/html');
    res.sendFile(__dirname + '/site/views/erro.html');
});