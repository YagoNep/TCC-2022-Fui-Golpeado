let auxpagina = 6;
let auxit = 0
let auxrelatos = [];

async function carregarRelatos() {
    fetch('/relatos')
    .then((res) => res.json())
    .then((res) => {
        auxrelatos = res;
        mostrarRelatos();})
}

// async function carregarRelatos() {
//     fetch('/relatosimg')
//     .then((res) => res.json()) //colocar width:100%, height:28rem (exemplo) e object-fit: cover; na imagem, alem de setar o height e width na tag img, qualquer coisa pega exemplo diferente no https://buscaportas.com.br/empresas/inffino-marcenaria/
//     .then((res) => {
//         console.log(res)})
// }

function carregarPerfil() {
    fetch('/user')
        .then((res) => res.json())
        .then((res) => {
            mostrarPerfil(res);
        })
}

function mostrarPerfil(res) {
    var fotoPerfil = document.getElementById('fotoPerfil');
    var nomePerfil = document.getElementById('nomePerfil');
    fotoPerfil.src = res.picture;
    nomePerfil.textContent = res.displayName;
}

carregarPerfil();

async function mostrarRelatos(){
    
    for(let i=auxit; i<auxpagina; i++){
        if(i<auxrelatos.length){
        console.log(auxrelatos[i]);
        criarcard(auxrelatos[i].ID_Relato, auxrelatos[i].Titulo, auxrelatos[i].Descricao);
        auxit++;
        }
}
        auxpagina+=6;
}

async function mostrarTodosRelatos(){
        auxpagina = auxrelatos.length;
        mostrarRelatos();
}

function criarcard(id, titulo, descricao){
var card = document.createElement("div");
card.className = "col-lg-6 col-md-6 mb-4";
card.setAttribute("value", id);
var card1 = document.createElement("div");
card1.className = "card bg-dark text-light h-100 p-5";
var card2 = document.createElement("div");
card2.className = "card-body";
var titulo1 = document.createElement("h4");
titulo1.textContent = titulo;
titulo1.className = "card-title";
var descricao1 = document.createElement("p");
descricao1.textContent = descricao.substring(0,175) + "...";
descricao1.className = "card-text";
var botao = document.createElement("a");
botao.className = "btn btn-primary mt-2";
botao.textContent = "Continuar Lendo";

card2.appendChild(titulo1);
card2.appendChild(descricao1);
card2.appendChild(botao);
card1.appendChild(card2);
card.appendChild(card1);

document.getElementById("teste").appendChild(card)
}

carregarRelatos();
document.querySelector("#plus").addEventListener("click", mostrarRelatos);
document.querySelector("#all").addEventListener("click", mostrarTodosRelatos);