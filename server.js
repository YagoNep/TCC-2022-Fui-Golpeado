import express from 'express';
import url from 'url';
import path from 'path';
import fileupload from 'express-fileupload';
import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth2';
import session from 'express-session';
import 'dotenv/config';
import {
    profile
} from 'console';
import database from './database.js';
import fs from "fs";
import fetch from "node-fetch";

var userProfile;

//se não estiver logado ele não permite acesso, redirecionando para a página de login novamente
function isLoggedIn(req, res, next) {
    req.user ? next() : res.redirect('/login');
}

const app = express();
var __filename = url.fileURLToPath(
    import.meta.url);
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
    resave: false,
    saveUninitialized: true,
    secret: 'calvo'
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new GoogleStrategy({
        clientID: process.env.clientID,
        clientSecret: process.env.clientSecret,
        callbackURL: "http://localhost:8080/google/callback",
        passReqToCallback: true
    },
    function (request, accessToken, refreshToken, profile, done) {
        userProfile = profile;
        return done(null, userProfile);
    }
));

passport.serializeUser((user, done) => {
    done(null, user)
});

passport.deserializeUser((user, done) => {
    done(null, user)
});

app.post('/', isLoggedIn, (req, res) => {
    if (req.files) {
        var file = req.files.file
        var filename = file.name
        if (req.files.file.mimetype !== "image/jpg" && req.files.file.mimetype !== "image/png") {
            throw new Error("Only supports jpg and png file format");
        }
    }

    file.mv('./site/img/' + req.user.id + "/" + filename, function (err) {
        if (err) {
            res.send(err)
        }
    })
});

app.post('/relato', isLoggedIn, async (req, res) => {
    let {
        titulo,
        descricao,
        app,
        uf,
        state,
        city
    } = req.body;
    let usuario = req.user.id;
    let dia = Date.now();

    let date_ob = new Date(dia);
    let date = date_ob.getDate();
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();

    let dias = (year + "/" + month + "/" + date);
    let deucerto = false;

    console.log(city);
    let verify = await database.getCidadeSelecionada(city);
    if (verify == ![]) {
        const link = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`

        await fetch(link)
            .then(res => res.json())
            .then(cities => {
                for (const cityf of cities) {
                    if (city == cityf.id) {
                        database.cadastraCidade(city, cityf.nome, uf);
                        deucerto = true;
                    }
                }
            })
    } else {
        deucerto = true;
    }
    if (deucerto) {
        descricao = descricao.replace(/\r/g, " ");
        descricao = descricao.replace(/\n/g, " ");
        descricao = descricao.replace(/  +/g, " ");
        titulo = titulo.replace(/ +/g, " ");
        let numero = await database.insertRelato(titulo, descricao, dias, app, city, usuario);
        if (req.files) {
            if (req.files.file.length == undefined) {
                fs.mkdir("./site/img/" + usuario + "/" + numero.numero, {
                    recursive: true
                }, function (err) {
                    if (err) {
                        res.send(err);
                    }
                });
                var file = req.files.file
                var filename = file.name
                file.mv('./site/img/' + req.user.id + "/" + numero.numero + "/" + filename, function (err) {
                    if (err) {
                        res.send(err)
                    }
                })
                await database.cadastraImagem(filename, numero.numero);
            }
            if (req.files.file.length) {
                fs.mkdir("./site/img/" + usuario + "/" + numero.numero, {
                    recursive: true
                }, function (err) {
                    if (err) {
                        res.send(err);
                    }
                });
                for (let i = 0; i < req.files.file.length; i++) {
                    if (i > 2) {
                        break;
                    }
                    var file = req.files.file[i]
                    var filename = file.name
                    file.mv('./site/img/' + req.user.id + "/" + numero.numero + "/" + filename, function (err) {
                        if (err) {
                            res.send(err)
                        }
                    })
                    await database.cadastraImagem(filename, numero.numero);
                }
            }
        }
        let vars = await database.getRelatoSelecionado(numero.numero);
        res.status(201).redirect('/teste');
    }
})

app.get('/relatoselect/:id', isLoggedIn, async (req, res) => {
    res.send(await database.getRelatoSelecionado(req.params.id));
});

app.get('/cidadeselect/:id', isLoggedIn, async (req, res) => {
    res.send(await database.getCidadeSelecionada(req.params.id));
});

app.get('/relatosimg', isLoggedIn, async (req, res) => {
    res.send(await database.getRelatosImg());
});

app.get('/teste', isLoggedIn, (req, res) => {
    res.header('Content-Type', 'text/html');
    res.sendFile(__dirname + '/site/views/inicio.html', function (err) {
        if (err) {
            return res.status(err.status).end();
        } else {
            return res.status(200).end();
        }
    });
});

app.get('/', (req, res) => {
    res.header('Content-Type', 'text/html');
    res.sendFile(__dirname + '/site/views/login.html', function (err) {
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

app.get('/relatos', isLoggedIn, async (req, res) => {
    res.send(await database.getRelatosImg());
});

app.get('/relatosimg', isLoggedIn, async (req, res) => {
    let relatos = await database.getRelatos();
    let c = [];
    for(let i=1; i<=relatos.length; i++){
        let a = await database.getImagensSelecionadas(i);
        if(a != ![]){
            c.push(a);
        }
    }
    // console.log(c[1])
    // console.log(c[1][1].Nome_Imagem)
    res.send(c);
});

app.get('/login', (req, res) => {
    res.header('Content-Type', 'text/html');
    res.sendFile(__dirname + '/site/views/login.html', function (err) {
        if (err) {
            return res.status(err.status).end();
        } else {
            return res.status(200).end();
        }
    });
});

app.get('/google',
    passport.authenticate('google', {
        scope: ['email', 'profile']
    }));

app.get('/google/callback',
    passport.authenticate('google', {
        successRedirect: '/verify',
        failureRedirect: '/google/failure'
    })
);

app.get('/google/failure', async (req, res) => {
    res.send("Deu errado!", function (err) {
        if (err) {
            return res.status(err.status).end();
        } else {
            return res.status(200).end();
        }
    });
});

app.get('/verify', isLoggedIn, async (req, res) => {
    const idUser = userProfile.id;
    let verify = await database.getUsuarioSelecionado(idUser);
    if (verify == ![]) {
        let cadastrar = await database.cadastraUsuario(idUser);
        fs.mkdir("./site/img/" + idUser, {
            recursive: true
        }, function (err) {
            if (err) {
                console.log(err)
            } else {
                console.log("New directory successfully created.")
            }
        });
        if (cadastrar.numero = !0) {
            res.redirect('/inicio');
        } else {
            res.redirect('/deupau')
        }
    } else {
        res.redirect('/inicio');
    }
});

app.get('/logout', (req, res) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});

app.get('/user', isLoggedIn, (req, res) => {
    res.send(userProfile);
});

app.get('/inicio', isLoggedIn, (req, res) => {
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
    res.sendFile(__dirname + '/index.html', function (err) {
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
    res.sendFile(__dirname + '/site/views/erro.html', function (err) {
        if (err) {
            return res.status(err.status).end();
        } else {
            return res.status(200).end();
        }
    });
});