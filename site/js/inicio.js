let auxpagina = 6;
let auxit = 0
let auxrelatos = [];
let whatsapp = 0;
let facebook = 0;
let instagram = 0;
let twitter = 0;
let email = 0;
let compras = 0;
let outros = 0;
var chartTextStyle = {color: '#FFF'};

async function carregarRelatos() {
    fetch('/relatos')
    .then((res) => res.json())
    .then((res) => {
        auxrelatos = res;
        mostrarRelatos();
        contagemApps();})
}

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
            if(i<=1){
                let image = (auxrelatos[i].imagens.split(","))
                let imagem = "./img/" + auxrelatos[i].fk_ID_Usuario + "/" + auxrelatos[i].ID_Relato + "/" + image[0]
                criarcardImg(auxrelatos[i].ID_Relato, auxrelatos[i].Titulo, auxrelatos[i].Descricao, imagem);
            }
            else{
                criarcard(auxrelatos[i].ID_Relato, auxrelatos[i].Titulo, auxrelatos[i].Descricao);
            }
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
botao.className = "btn btn-primary mt-2 py-2 px-3";
botao.textContent = "Continuar Lendo";
botao.addEventListener("click", chamarModal);

card2.appendChild(titulo1);
card2.appendChild(descricao1);
card2.appendChild(botao);
card1.appendChild(card2);
card.appendChild(card1);

document.getElementById("teste").appendChild(card)
}

function criarcardImg(id, titulo, descricao, imagem){
    var card = document.createElement("div");
    card.className = "col-lg-6 col-md-6 mb-4";
    card.setAttribute("value", id);
    var card1 = document.createElement("div");
    card1.className = "card bg-dark text-light h-100 p-5";
    var img = document.createElement("img");
    img.setAttribute("src", imagem);
    img.className = "img-fluid w-100 fotinha"
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
    botao.className = "btn btn-primary mt-2 py-2 px-3";
    botao.textContent = "Continuar Lendo";
    botao.addEventListener("click", chamarModal);
    

    card2.appendChild(titulo1);
    card2.appendChild(descricao1);
    card2.appendChild(botao);
    card1.appendChild(img);
    card1.appendChild(card2);
    card.appendChild(card1);
    
    document.getElementById("teste").appendChild(card)
    }

async function chamarModal(){
    removeImg()
    let id = this.getAttribute("id");
    let modal = document.getElementById("staticBackdrop");
    let image = modal.querySelector(".modal img");
    let titulo = modal.querySelector(".modal h3");
    let descricao = modal.querySelector(".modal .descricao");
    let aplicativo = modal.querySelector(".modal .aplicativo");
    let cidade = modal.querySelector(".modal .cidade");
    await fetch("/relatoselect/" + id)
    .then((res) => res.json())
    .then((res) => {
        let auxtitulo = res[0].Titulo;
        let auxdescricao = res[0].Descricao;
        let auxapp = res[0].Nome_Aplicativo;
        let auxcidade = res[0].Nome_Cidade;
        let auxestado = res[0].UF;

        if(res[0].imagens){
            let imagens = res[0].imagens.split(",");
            for(let i = 0; i<imagens.length; i++){
            let imagempath = './img/' + res[0].fk_ID_Usuario + "/" + res[0].ID_Relato + "/" + imagens[i];
            var imagem = document.createElement("img");
            imagem.setAttribute("id", "img");
            if(i==0){
                imagem.className = "d-inline-block float-start me-3 mb-1 mt-1 w-100 grande p-2";
            }
            else if(i==1 && imagens.length==2){
                imagem.className = "d-inline-block float-start me-3 mb-1 mt-1 w-100 grande p-2";
            }
            else{
                imagem.className = "mt-1 w-50 p-2";
            }
            imagem.setAttribute("data-bs-toggle", "modal");
            imagem.setAttribute("data-bs-target" , "#exampleModal");
            imagem.setAttribute("src", imagempath);
            imagem.addEventListener("click", modalImg);
    
            document.getElementById("corpomodal").appendChild(imagem);
            }
        }
        else{
            image.setAttribute("src", "")
        }
        titulo.textContent = auxtitulo;
        descricao.textContent = "• " + auxdescricao;
        aplicativo.textContent = "• Aplicativo: " + auxapp;
        cidade.textContent = "• Cidade: " + auxcidade + " / " + auxestado;
      })
      
}

carregarRelatos();

async function contagemApps(){
    for(let i=0; i<auxrelatos.length; i++){
            if(auxrelatos[i].fk_ID_Aplicativo == 1){
                whatsapp++;
            }
            if(auxrelatos[i].fk_ID_Aplicativo == 2){
                facebook++;
            }
            if(auxrelatos[i].fk_ID_Aplicativo == 3){
                instagram++;
            }
            if(auxrelatos[i].fk_ID_Aplicativo == 4){
                twitter++;
            }
            if(auxrelatos[i].fk_ID_Aplicativo == 5){
                email++;
            }
            if(auxrelatos[i].fk_ID_Aplicativo == 6){
                compras++;
            }
            if(auxrelatos[i].fk_ID_Aplicativo == 7){
                outros++;
            }
}
}

google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);
      function drawChart() {

        var data = google.visualization.arrayToDataTable([
          ['Task', 'Hours per Day'],
          ['Whatsapp',     whatsapp],
          ['Facebook',      facebook],
          ['Instagram',  instagram],
          ['Twitter', twitter],
          ['Email',    email],
          ['Compras Online', compras]
        // ['Outros', outros]
        ]);

        var options = {
          title: 'Aplicativos',
          titleTextStyle : {
            color:chartTextStyle
          },
          backgroundColor: { fill:'transparent' },
          vAxis: {
                textStyle:chartTextStyle,
                titleTextStyle:chartTextStyle,
                gridlines: {color: '#787878'}
            },
            hAxis: {
                textStyle:chartTextStyle,
                titleTextStyle:chartTextStyle
            },
            legend:{
                textStyle:chartTextStyle
            },
            colors: ['#32CD32', '#1E90FF', '#FF0000', '#00CED1', '#8A2BE2', '#FFFF00']
        };

        var chart = new google.visualization.PieChart(document.getElementById('piechart'));

        chart.draw(data, options);
      }

function modalImg(){
    let source = this.getAttribute("src");
    document.getElementById("imagezona").setAttribute("src", source);
}

function removeImg(){
    document.querySelectorAll(".modal1 img").forEach(e => e.remove());;
}

document.querySelector(".btn-close").addEventListener("click", removeImg);
document.querySelector("#plus").addEventListener("click", mostrarRelatos);
document.querySelector("#all").addEventListener("click", mostrarTodosRelatos);