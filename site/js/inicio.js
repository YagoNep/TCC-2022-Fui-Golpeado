let auxpagina = 6;
let auxit = 0
let auxrelatos = [];
let auxcidades = [];
let whatsapp = 0;
let facebook = 0;
let instagram = 0;
let twitter = 0;
let email = 0;
let compras = 0;
let outros = 0;
var chartTextStyle = {
    color: '#FFF'
};
let idUser = 0;
let permissao = 1;

async function carregarRelatos() {
    fetch('/relatos')
        .then((res) => res.json())
        .then((res) => {
            auxrelatos = res;
            mostrarRelatos();
            contagemApps();
            contagemCidades();
        })
}

function carregarPerfil() {
    fetch('/user')
        .then((res) => res.json())
        .then((res) => {
            mostrarPerfil(res);
            idUser = res.id;
            fetch('/permissao/' + idUser)
                .then((res) => res.json())
                .then((res) => {
                    permissao = res[0].fk_ID_Permissao;
                    console.log("A permissão é: " + permissao);
		    carregarRelatos();
                })
        })
}

function mostrarPerfil(res) {
    var fotoPerfil = document.getElementById('fotoPerfil');
    var nomePerfil = document.getElementById('nomePerfil');
    fotoPerfil.src = res.picture;
    let nome = res.displayName.split(" ");
    nomePerfil.textContent = nome[0];
}

carregarPerfil();

async function mostrarRelatos() {

    for (let i = auxit; i < auxpagina; i++) {
        if (i < auxrelatos.length) {
            if (permissao == '2') { 
                if (i <= 1) {
                    if (auxrelatos[i].imagens){
                        let image = (auxrelatos[i].imagens.split(","))
                        let imagem = "./img/" + auxrelatos[i].fk_ID_Usuario + "/" + auxrelatos[i].ID_Relato + "/" + image[0]
                        criarcardImgADM(auxrelatos[i].ID_Relato, auxrelatos[i].Titulo, auxrelatos[i].Descricao, imagem);
                    }
                    else {
                        criarcardADM(auxrelatos[i].ID_Relato, auxrelatos[i].Titulo, auxrelatos[i].Descricao);
                    }
                } else {
                    criarcardADM(auxrelatos[i].ID_Relato, auxrelatos[i].Titulo, auxrelatos[i].Descricao);
                }
                auxit++;
            } else {
                if (i <= 1) {
                    if (auxrelatos[i].imagens){
                        let image = (auxrelatos[i].imagens.split(","))
                        let imagem = "./img/" + auxrelatos[i].fk_ID_Usuario + "/" + auxrelatos[i].ID_Relato + "/" + image[0]
                        criarcardImg(auxrelatos[i].ID_Relato, auxrelatos[i].Titulo, auxrelatos[i].Descricao, imagem);
                    }
                    else{
                        criarcard(auxrelatos[i].ID_Relato, auxrelatos[i].Titulo, auxrelatos[i].Descricao);
                    }
                } else {
                    criarcard(auxrelatos[i].ID_Relato, auxrelatos[i].Titulo, auxrelatos[i].Descricao);
                }
                auxit++;
            }
        }
    }
    auxpagina += 6;
}

async function mostrarTodosRelatos() {
    auxpagina = auxrelatos.length;
    mostrarRelatos();
}

document.querySelector("#btnPesquisar").addEventListener("click", aparecerInput)
document.querySelector("#intro").addEventListener("click", esconderInput)
document.querySelector("main").addEventListener("click", esconderInput)

async function aparecerInput(event) {
    event.preventDefault();

    if (document.querySelector("#inputPesquisar").style.display == "none") {
        document.querySelector("#inputPesquisar").style.display = "block";
        document.querySelector("#inputPesquisar").focus();
        document.querySelector("#app").style.display = "block";
    } else {
        if (document.querySelector("#inputPesquisar").value == "") {
            if (filtrado == 0) {
                document.querySelector("#inputPesquisar").style.display = "none";
                document.querySelector("#app").style.display = "none";
            }
            if (filtrado == 1) {
                filtrar();
                filtrado = 0;
            }
        } else {
            filtrar();
            filtrado = 1;
        }
    }
}

async function padrao(event){
    event.preventDefault()

    carregarFiltro("");
    document.querySelector(".botao1").className = "botao1 btn btn-primary m-2 py-3 px-5";
    document.querySelector(".botao1").textContent = "Registrar Relato";
    document.querySelector(".botao1").setAttribute("href", "./relato");
    document.querySelector(".botao1").removeEventListener("click", padrao);
}

async function esconderInput(){
    document.querySelector("#inputPesquisar").style.display = "none";
    document.querySelector("#app").style.display = "none";
}

async function filtrar() {

    let form = document.querySelector("#pesquisar");
    let filtro = form.inputPesquisar.value;
    carregarFiltro(filtro);
}

async function carregarFiltro(filtro) {
    document.querySelectorAll(".cartao").forEach(e => e.remove());;
    let botao = document.querySelector(".botao1")
    if (filtro == "") {
        document.querySelectorAll(".inicio").forEach(e => e.style.display = "block")
        document.querySelector(".texto1").textContent = "Seja bem vindo ao site!";
        document.querySelector(".texto2").textContent = "Comece agora mesmo a registrar seus relatos";
        botao.className = "botao1 btn btn-primary m-2 py-3 px-5";
        botao.textContent = "Registrar Relato";
        botao.setAttribute("href", "./relato");
        botao.removeEventListener("click", padrao);
        auxpagina = 6;
        auxit = 0;
        carregarRelatos();
    } else {
        fetch('/pesquisa/' + filtro)
            .then((res) => res.json())
            .then((res) => {
                if (res == ![]) {
                    document.querySelectorAll(".inicio").forEach(e => e.style.display = "none");
                    document.querySelector(".texto1").textContent = "Não encontramos nenhum resultado para sua pesquisa :(";
                    document.querySelector(".texto2").textContent = "Comece a registrar seus relatos agora mesmo!";
                } else {
                    document.querySelectorAll(".inicio").forEach(e => e.style.display = "block");
                    document.querySelector(".texto1").textContent = 'Você pesquisou por "' + filtro + '"';
                    document.querySelector(".texto2").textContent = "Clique aqui para limpar o filtro";
                    botao.className = "botao1 btn btn-danger m-2 py-3 px-5";
                    botao.textContent = "Limpar Filtro";
                    botao.setAttribute("href", "");
                    botao.addEventListener("click", padrao);
                    auxpagina = 6;
                    auxit = 0;
                    // console.log(res);
                    auxrelatos = res
                    mostrarRelatos();
                }
            })
    }
}

document.querySelector("select[name=app]").addEventListener("change", filtroApp)

async function filtroApp(event) {
    event.preventDefault();

    let select = document.querySelector("#app");
    let filtro = select.value;
    filtrarApp(filtro);
    console.log(filtro)
    document.querySelector(".filtro1").innerHTML= '<option value="" class="filtro1">Limpar Filtro</option>'
    if(filtro == ""){
        document.querySelector(".filtro1").innerHTML= '<option value="" class="filtro1">Filtrar Apps</option>'
    }
}

async function filtrarApp(filtro) {
    document.querySelectorAll(".cartao").forEach(e => e.remove());;
    console.log(filtro)
    if (filtro == "") {
        auxpagina = 6;
        auxit = 0;
        carregarRelatos();
    } else {
        fetch('/pesquisaapp/' + filtro)
            .then((res) => res.json())
            .then((res) => {
                if (res == ![]) {
                    document.querySelectorAll(".inicio").forEach(e => e.style.display = "none");
                    document.querySelector(".texto1").textContent = "Não encontramos nenhum resultado para sua pesquisa :(";
                    document.querySelector(".texto2").textContent = "Comece a registrar seus relatos agora mesmo!";
                } else {
                    document.querySelectorAll(".inicio").forEach(e => e.style.display = "block");
                    document.querySelector(".texto1").textContent = "Seja bem vindo ao site!";
                    document.querySelector(".texto2").textContent = "Comece agora mesmo a registrar seus relatos";
                }
                console.log(res)
                auxpagina = 6;
                auxit = 0;
                console.log(res);
                auxrelatos = res
                mostrarRelatos();
            })
    }
}

function carregarAplicativos() {
    const appSelect = document.querySelector("select[name=app]");

    fetch('/app')
        .then((res) => res.json())
        .then((res) => {
            for (const app of res) {
                appSelect.innerHTML += `<option class="dropdown-item" value='${app.ID_Aplicativo}'>${app.Nome_Aplicativo}</option>`
            }
        })
}

carregarAplicativos();

function criarcard(id, titulo, descricao) {
    var card = document.createElement("div");
    card.className = "cartao col-lg-6 col-md-6 mb-4";
    card.setAttribute("value", id);
    var card1 = document.createElement("div");
    card1.className = "card bg-dark text-light h-100 p-5";
    var card2 = document.createElement("div");
    card2.className = "card-body";
    var titulo1 = document.createElement("h4");
    titulo1.textContent = titulo;
    titulo1.className = "card-title";
    var descricao1 = document.createElement("p");
    descricao1.textContent = descricao.substring(0, 175) + "...";
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

function criarcardImg(id, titulo, descricao, imagem) {
    var card = document.createElement("div");
    card.className = "cartao col-lg-6 col-md-6 mb-4";
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
    descricao1.textContent = descricao.substring(0, 175) + "...";
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

function criarcardADM(id, titulo, descricao) {
    var card = document.createElement("div");
    card.className = "cartao col-lg-6 col-md-6 mb-4";
    card.setAttribute("value", id);
    var card1 = document.createElement("div");
    card1.className = "card bg-dark bg-opacity-75 text-light h-100 p-5";
    var card2 = document.createElement("div");
    card2.className = "card-body";
    var titulo1 = document.createElement("h4");
    titulo1.textContent = titulo;
    titulo1.className = "card-title";
    var descricao1 = document.createElement("p");
    descricao1.textContent = descricao.substring(0, 175) + "...";
    descricao1.className = "card-text";
    var botao = document.createElement("button");
    botao.setAttribute("id", id);
    botao.setAttribute("data-bs-toggle", "modal");
    botao.setAttribute("data-bs-target", "#staticBackdrop");
    botao.className = "btn btn-primary mt-2 py-2 px-3";
    botao.textContent = "Continuar Lendo";
    botao.addEventListener("click", chamarModal);
    var botao2 = document.createElement("button");
    botao2.setAttribute("id", id);
    botao2.className = "btn btn-success ms-2 mt-2 py-2 px-3";
    botao2.textContent = "Editar";
    botao2.addEventListener("click", editarRelato);
    var botao3 = document.createElement("button");
    botao3.setAttribute("id", id);
    botao3.className = "btn btn-danger ms-2 mt-2 py-2 px-3";
    botao3.textContent = "Apagar";
    botao3.addEventListener("click", apagarRelato);

    card2.appendChild(titulo1);
    card2.appendChild(descricao1);
    card2.appendChild(botao);
    card2.appendChild(botao2);
    card2.appendChild(botao3);
    card1.appendChild(card2);
    card.appendChild(card1);

    document.getElementById("teste").appendChild(card)
}

function criarcardImgADM(id, titulo, descricao, imagem) {
    var card = document.createElement("div");
    card.className = "cartao col-lg-6 col-md-6 mb-4";
    card.setAttribute("value", id);
    var card1 = document.createElement("div");
    card1.className = "card bg-dark bg-opacity-75 text-light h-100 p-5";
    var img = document.createElement("img");
    img.setAttribute("src", imagem);
    img.className = "img-fluid w-100 fotinha"
    var card2 = document.createElement("div");
    card2.className = "card-body";
    var titulo1 = document.createElement("h4");
    titulo1.textContent = titulo;
    titulo1.className = "card-title";
    var descricao1 = document.createElement("p");
    descricao1.textContent = descricao.substring(0, 175) + "...";
    descricao1.className = "card-text";
    var botao = document.createElement("button");
    botao.setAttribute("id", id);
    botao.setAttribute("data-bs-toggle", "modal");
    botao.setAttribute("data-bs-target", "#staticBackdrop");
    botao.className = "btn btn-primary mt-2 py-2 px-3";
    botao.textContent = "Continuar Lendo";
    botao.addEventListener("click", chamarModal);
    var botao2 = document.createElement("button");
    botao2.setAttribute("id", id);
    botao2.className = "btn btn-success ms-2 mt-2 py-2 px-3";
    botao2.textContent = "Editar";
    botao2.addEventListener("click", editarRelato);
    var botao3 = document.createElement("button");
    botao3.setAttribute("id", id);
    botao3.className = "btn btn-danger ms-2 mt-2 py-2 px-3";
    botao3.textContent = "Apagar";
    botao3.addEventListener("click", apagarRelato);


    card2.appendChild(titulo1);
    card2.appendChild(descricao1);
    card2.appendChild(botao);
    card2.appendChild(botao2);
    card2.appendChild(botao3);
    card1.appendChild(img);
    card1.appendChild(card2);
    card.appendChild(card1);

    document.getElementById("teste").appendChild(card)
}

function editarRelato(event) {
    event.preventDefault();

    let id = this.getAttribute("id");
    location = "/edit?id=" + id;
}

function apagarRelato(event) {
    event.preventDefault();
    let id = this.getAttribute("id")
    let header = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8'
        }
    };

    var doc; //tirar sa porra
    var result = confirm("Tem certeza que deseja excluir o relato?");
    if (result == true) {
        fetch('/delete/' + id, header);
        location = "/perfil";
    } else {
        doc = "Cancel was pressed.";
    }
    console.log(doc); // tirar sa porra
}

async function chamarModal() {
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

            if (res[0].imagens) {
                let imagens = res[0].imagens.split(",");
                for (let i = 0; i < imagens.length; i++) {
                    let imagempath = './img/' + res[0].fk_ID_Usuario + "/" + res[0].ID_Relato + "/" + imagens[i];
                    var imagem = document.createElement("img");
                    imagem.setAttribute("id", "img");
                    if (i == 0) {
                        imagem.className = "d-inline-block float-start me-3 mb-1 mt-1 w-100 grande p-2";
                    } else if (i == 1 && imagens.length == 2) {
                        imagem.className = "d-inline-block float-start me-3 mb-1 mt-1 w-100 grande p-2";
                    } else {
                        imagem.className = "mt-1 w-50 p-2";
                    }
                    imagem.setAttribute("data-bs-toggle", "modal");
                    imagem.setAttribute("data-bs-target", "#exampleModal");
                    imagem.setAttribute("src", imagempath);
                    imagem.addEventListener("click", modalImg);

                    document.getElementById("corpomodal").appendChild(imagem);
                }
            } else {
                
            }
            titulo.textContent = auxtitulo;
            descricao.textContent = "• " + auxdescricao;
            aplicativo.textContent = "• Aplicativo: " + auxapp;
            cidade.textContent = "• Cidade: " + auxcidade + " (" + auxestado + ")";
        })

}

async function contagemCidades() {
    fetch('/contagemcidades')
        .then((res) => res.json())
        .then((res) => {
            auxcidades = res;
            console.log(auxcidades)
            google.charts.load('current', {
                'packages': ['corechart']
            });
            google.charts.setOnLoadCallback(drawChart);
            google.charts.load('current', {
                'packages': ['corechart']
            });
            google.charts.setOnLoadCallback(drawChart2);
        })
}

async function contagemApps() {
    for (let i = 0; i < auxrelatos.length; i++) {
        if (auxrelatos[i].fk_ID_Aplicativo == 1) {
            whatsapp++;
        }
        if (auxrelatos[i].fk_ID_Aplicativo == 2) {
            facebook++;
        }
        if (auxrelatos[i].fk_ID_Aplicativo == 3) {
            instagram++;
        }
        if (auxrelatos[i].fk_ID_Aplicativo == 4) {
            twitter++;
        }
        if (auxrelatos[i].fk_ID_Aplicativo == 5) {
            email++;
        }
        if (auxrelatos[i].fk_ID_Aplicativo == 6) {
            compras++;
        }
        if (auxrelatos[i].fk_ID_Aplicativo == 7) {
            outros++;
        }
    }
}

//GRAFICO DOS APPS

function drawChart() {

    var data = google.visualization.arrayToDataTable([
        ['App', 'N° de relatos'],
        ['Whatsapp', whatsapp],
        ['Facebook', facebook],
        ['Instagram', instagram],
        ['Twitter', twitter],
        ['Email', email],
        ['Compras Online', compras]
    ]);

    var options = {
        responsive: true,
        'width': 600,
        'height': 500,
        title: 'Aplicativos',
        titleTextStyle: {
            color: chartTextStyle
        },
        backgroundColor: {
            fill: 'transparent'
        },
        vAxis: {
            textStyle: chartTextStyle,
            titleTextStyle: chartTextStyle,
            gridlines: {
                color: '#787878'
            }
        },
        hAxis: {
            textStyle: chartTextStyle,
            titleTextStyle: chartTextStyle
        },
        legend: {
            textStyle: chartTextStyle
        },
        colors: ['#32CD32', '#0047AB', '#D2042D', '#00CED1', '#8A2BE2', '#FDDA0D', '#8C8C8C']
    };

    var chart = new google.visualization.PieChart(document.getElementById('piechart'));

    chart.draw(data, options);
}

//GRAFICO DAS CIDADES

function drawChart2() {

    var data = google.visualization.arrayToDataTable([
        ['App', 'N° de relatos'],
        [auxcidades[0].Nome_Cidade + " (" + auxcidades[0].UF + ")", auxcidades[0].contagem],
        [auxcidades[1].Nome_Cidade + " (" + auxcidades[1].UF + ")", auxcidades[1].contagem],
        [auxcidades[2].Nome_Cidade + " (" + auxcidades[2].UF + ")", auxcidades[2].contagem],
        [auxcidades[3].Nome_Cidade + " (" + auxcidades[3].UF + ")", auxcidades[3].contagem],
        [auxcidades[4].Nome_Cidade + " (" + auxcidades[4].UF + ")", auxcidades[4].contagem]
    ]);

    var options = {
        responsive: true,
        'width': 600,
        'height': 500,
        title: 'Cidades',
        titleTextStyle: {
            color: chartTextStyle
        },
        backgroundColor: {
            fill: 'transparent'
        },
        vAxis: {
            textStyle: chartTextStyle,
            titleTextStyle: chartTextStyle,
            gridlines: {
                color: '#787878'
            }
        },
        hAxis: {
            textStyle: chartTextStyle,
            titleTextStyle: chartTextStyle
        },
        legend: {
            textStyle: chartTextStyle
        },
        colors: ['#32CD32', '#0047AB', '#D2042D', '#00CED1', '#8A2BE2', '#FDDA0D', '#8C8C8C']
    };

    var chart = new google.visualization.PieChart(document.getElementById('piechart2'));

    chart.draw(data, options);
}

function modalImg() {
    let source = this.getAttribute("src");
    document.getElementById("imagezona").setAttribute("src", source);
}

function removeImg() {
    document.querySelectorAll(".modal1 img").forEach(e => e.remove());;
}

document.querySelector(".btn-close").addEventListener("click", removeImg);
document.querySelector("#plus").addEventListener("click", mostrarRelatos);
document.querySelector("#all").addEventListener("click", mostrarTodosRelatos);
