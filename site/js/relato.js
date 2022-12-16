document.querySelector("select[name=uf]").addEventListener("change", getCities)

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
    let nome = res.displayName.split(" ");
    nomePerfil.textContent = nome[0];
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

populatesUfs()


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
    // log(`e.target`, e.target);
    const select = e.target;
    const value = select.value;
    const desc = select.selectedOptions[0].text;
    console.log(value, desc);
});



// async function inserirRelato(event) {
//     event.preventDefault();

//     let form = document.querySelector("#relato");
//     let titulo = form.titulo.value;
//     let descricao = form.descricao.value;
//     const APP = document.querySelector("select[name=app]");
//     let aplicativo = APP.value;
//     const CIDADE = document.querySelector("#cidades");
//     let cidade = CIDADE.value;

//     let header = {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json; charset=UTF-8'
//         },
//         body: JSON.stringify({
//             titulo: titulo,
//             descricao: descricao,
//             aplicativo: aplicativo,
//             cidade: cidade
//         })
//     }
//     await fetch('/relato', header);

//     // window.location.href = '/trolei';
// }
