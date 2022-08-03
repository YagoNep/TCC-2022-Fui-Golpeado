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

//  async function carregarImagens() {
//      fetch('/relatosimg')
//      .then((res) => res.json()) //colocar width:100%, height:28rem (exemplo) e object-fit: cover; na imagem, alem de setar o height e width na tag img, qualquer coisa pega exemplo diferente no https://buscaportas.com.br/empresas/inffino-marcenaria/
//      .then((res) => {
//         for(let i=0; i<=1; i++){
//             var relatoimg = await 
//         }
//          console.log(res[1][1].fk_ID_Relato)})
//  }

//  carregarImagens();

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
var botao = document.createElement("button");
botao.setAttribute("id", id);
botao.setAttribute("data-bs-toggle", "modal");
botao.setAttribute("data-bs-target", "#staticBackdrop");
botao.className = "btn btn-primary mt-2";
botao.textContent = "Continuar Lendo";
botao.addEventListener("click", chamarModal);

card2.appendChild(titulo1);
card2.appendChild(descricao1);
card2.appendChild(botao);
card1.appendChild(card2);
card.appendChild(card1);

document.getElementById("teste").appendChild(card)
}

function chamarModal(){
    document.getElementById("img").style.opacity = "1";
    let id = 7;
    let modal = document.getElementById("staticBackdrop");
    let image = modal.querySelector(".modal img");
    let titulo = modal.querySelector(".modal h3");
    let filme = modal.querySelector(".modal .filme");
    let filmecurto = modal.querySelector(".modal .filmecurto");
    let tvshow = modal.querySelector(".modal .tvshow");
    let game = modal.querySelector(".modal .game");
    let park = modal.querySelector(".modal .park");
    let allies = modal.querySelector(".modal .allies");
    let enemies = modal.querySelector(".modal .enemies");
    let url = `https://api.disneyapi.dev/characters/${id}`;
    fetch(url)
    .then((res) => res.json())
    .then((res) => {
      image.setAttribute("src", res.imageUrl);
      titulo.textContent = "#" + res._id + " - " + res.name;
      filme.textContent = "• Filmes: " + tratarArray(res.films);
      filmecurto.textContent = "• Curtametragens: " + tratarArray(res.shortFilms);
      tvshow.textContent = "• TV Shows: " + tratarArray(res.tvShows);
      game.textContent = "• Games: " + tratarArray(res.videoGames);
      park.textContent = "• Atrações: " + tratarArray(res.parkAttractions);
      allies.textContent = "• Aliados: " + tratarArray(res.allies);
      enemies.textContent = "• Inimigos: " + tratarArray(res.enemies);
      })
    .catch(function (err){
      console.log(err);
    })
      
}

function tratarArray(dado){
    let retorno = "";
    if(dado.length == 0){
        return "N/A";
    }
    dado.forEach(function(element, index){
        retorno += element + (index != dado.length-1 ? ", " : ".");
    });
    return retorno;
}


carregarRelatos();
document.querySelector("#plus").addEventListener("click", mostrarRelatos);
document.querySelector("#all").addEventListener("click", mostrarTodosRelatos);