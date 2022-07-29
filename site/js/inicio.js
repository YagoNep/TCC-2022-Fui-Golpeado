let auxpagina = 0;

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

// function iterarRelatos(){
//     fetch('/relatos')
//     .then((res) => res.json())
//     return await res;
// }

function carregarrelatos(){ /////dar um jeito de arrumar essa merda mostrar só uns 10 por vez

    fetch('/relatos')
    .then((res) => res.json())
    .then((res) => {
        var aux = res;
        var aux1 = 0;
        
            for(const relato of aux){
                for (let i = aux1; i < 20; i++){
                    criarcard(relato.ID_Relato, relato.Titulo, relato.Descricao);
            }
            aux1+20;
    }}
    )
    
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

carregarrelatos();