let idrelato = location.search;
let idaux = idrelato.split("=");
let id = idaux[1];
let auxTitulo = ""
let auxDescricao = "" 
let auxApp = ""
let auxCidade = ""
let auxEstado = ""
let auxUsuario = ""


document.querySelector("select[name=uf]").addEventListener("change", getCities)

function carregarPerfil() {
    fetch('/user')
        .then((res) => res.json())
        .then((res) => {
            mostrarPerfil(res);
            populatesUfs()
            carregarDados(id);
        })
}

async function carregarDados(id){
    await fetch('/editando/' + id)
    .then((res) => res.json())
    .then((res) => {

        auxId = res[0].ID_Relato;
        auxTitulo = res[0].Titulo;
        auxDescricao = res[0].Descricao;
        auxApp = res[0].fk_ID_Aplicativo;
        auxCidade = res[0].fk_ID_Cidade;
        auxEstado = auxCidade.toString().substr(0,2);
        auxUsuario = res[0].fk_ID_Usuario;

        var idRelato = document.getElementById('relato');
        idRelato.setAttribute("action", "/editrelato/" + auxId);

        if (res[0].imagens) {
            let imagens = res[0].imagens.split(",");
            if (imagens.length == 3){
                document.querySelector("#arquivao").disabled = true;
            }
            let idsImg = res[0].idImg.split(",");
            for (let i = 0; i < imagens.length; i++) {
                let imagempath = './img/' + res[0].fk_ID_Usuario + "/" + res[0].ID_Relato + "/" + imagens[i];
                var imagem = document.createElement("img");
                let btnExcluir = document.createElement("button")
                btnExcluir.setAttribute("type", "button");
                btnExcluir.setAttribute("class", "btn-close");
                btnExcluir.setAttribute("id", idsImg[i]);
                btnExcluir.addEventListener("click", excluirImg)
                imagem.setAttribute("id", "img");
                imagem.className = "mt-1 p-2";
                imagem.setAttribute("src", imagempath);
                document.getElementById("imagens").appendChild(imagem);
                document.getElementById("imagens").appendChild(btnExcluir);
            }
        }

        mostrarDados(auxId, auxTitulo, auxDescricao, auxApp, auxEstado, auxCidade, auxUsuario);
        })
}

async function excluirImg(event){

    event.preventDefault();

    let header = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8'
        }
    };
    var result = confirm("Tem certeza que deseja excluir a imagem?");
    if (result == true) {
        fetch('/deleteimg/' + this.id, header);
        document.querySelectorAll("#imagens img").forEach(e => e.remove());
        document.querySelectorAll("#imagens button").forEach(e => e.remove());
        carregarDados(id);
    }
}

function mostrarPerfil(res) {
    var fotoPerfil = document.getElementById('fotoPerfil');
    var nomePerfil = document.getElementById('nomePerfil');
    fotoPerfil.src = res.picture;
    nomePerfil.textContent = res.displayName;
    console.log(res);
}

carregarPerfil();

function carregarAplicativos() {
    const appSelect = document.querySelector("select[name=app]");

    fetch('/app')
        .then((res) => res.json())
        .then((res) => {
            for (const app of res) {
                appSelect.innerHTML += `<option value='${app.ID_Aplicativo}'>${app.Nome_Aplicativo}</option>`
            }
        })
}

carregarAplicativos();

function populatesUfs() {
    const ufSelect = document.querySelector("select[name=uf]")

    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome")
        .then(res => res.json())
        .then(states => {

            for (const state of states) {
                ufSelect.innerHTML += `<option value='${state.id}'>${state.nome}</option>`
            }
        })
}

function getCitiesSelecionada(eveent, cidade){
    const citySelect = document.querySelector("[name=city]")
    let auxc = 1

    const ufValue = eveent

    const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufValue}/municipios`

    citySelect.innerHTML = "<option value>Selecione a Cidade</option>"
    citySelect.disabled = true

    fetch(url)
        .then(res => res.json())
        .then(cities => {
            for (const city of cities) {
                citySelect.innerHTML += `<option value='${city.id}'>${city.nome}</option>`
                if(cidade == city.id){
                     auxc = cidade;
                }
            } // city.id.substr(0,2) pra pegar o id do estado

            citySelect.disabled = false
            citySelect.value = auxc
        })
}

function getCities(event) {
    const citySelect = document.querySelector("[name=city]")
    const stateInput = document.querySelector("[name=state]")

    const ufValue = event.target.value


    const indexOfSelectedState = event.target.selectedIndex
    stateInput.value = event.target.options[indexOfSelectedState].text


    const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufValue}/municipios`

    citySelect.innerHTML = "<option value>Selecione a Cidade</option>"
    citySelect.disabled = true

    fetch(url)
        .then(res => res.json())
        .then(cities => {

            for (const city of cities) {
                citySelect.innerHTML += `<option value='${city.id}'>${city.nome}</option>`
            } // city.id.substr(0,2) pra pegar o id do estado

            citySelect.disabled = false
        })

}

const areaSelect = document.querySelector(`[id="cidades"]`);

areaSelect.addEventListener(`change`, (e) => {
    const select = e.target;
    const value = select.value;
    const desc = select.selectedOptions[0].text;
    console.log(value, desc);
});

function mostrarDados(id, titulo, descricao, app, estado, cidade, usuario){
    console.log(id + " " + titulo + " " + descricao + " " + app + " " + estado + " " + cidade);
    const tituloSelect = document.querySelector("[name=titulo]");
    const descricaoSelect = document.querySelector("[name=descricao]")
    const appSelect = document.querySelector("select[name=app]");
    const ufSelect = document.querySelector("select[name=uf]");
    const userSelect = document.querySelector("[name=user]");
    

    tituloSelect.value = titulo;
    descricaoSelect.textContent = descricao;
    appSelect.value = app;
    ufSelect.value = auxEstado;
    userSelect.value = auxUsuario;
    getCitiesSelecionada(auxEstado, auxCidade);
}