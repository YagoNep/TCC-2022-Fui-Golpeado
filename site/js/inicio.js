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

function carregarnoticias(){
    fetch('/relatos')
    .then((res) => res.json())
    .then((res) => {
        console.log(res)
            for(const relato of res){
                criarcard(relato.ID_Relato, relato.Titulo, relato.Descricao);
            }
        }
    )}

function criarcard(id, titulo, descricao){
var card = document.createElement("div");
card.className = "col-lg-6 col-md-6 mb-4";
card.nodeValue = id;
var card1 = document.createElement("div");
card1.className = "card bg-dark text-light";
var card2 = document.createElement("div");
card2.className = "card-body";
var titulo1 = document.createElement("h5");
titulo1.textContent = titulo;
titulo1.className = "card-title";
var descricao1 = document.createElement("p");
descricao1.textContent = descricao;
descricao1.className = "card-text";
var botao = document.createElement("a");
botao.className = "btn btn-primary";
botao.textContent = "Continuar Lendo";

card2.appendChild(titulo1);
card2.appendChild(descricao1);
card2.appendChild(botao);
card1.appendChild(card2);
card.appendChild(card1);

console.log(card);
document.getElementById("teste").appendChild(card)
}

carregarnoticias();