document.querySelector('#add').addEventListener("click", teste);
document.querySelector('#teste4').addEventListener("click", teste2);

function teste(){
    fetch('/user')
    .then((res) => res.json())
    .then((res) => {
        criarLinha(res.id);
    })
}
function criarLinha(email){
    window.localStorage.setItem('email', email);
    // window.localStorage.clear();
    var teste2 = window.localStorage.getItem('email');
    var teste = document.getElementById('teste');
    teste.innerText = teste2;
    console.log(email);
}

function teste2(){
    fetch('/imagem')
    .then((res) => res.json())
    .then((res) => {
        for(foto of res){
        criarImagem(foto.foto);
}})
}
function criarImagem(resposta){
    var teste3 = document.getElementById('teste3');
    teste3.src=resposta;
}

function populatesUfs() {
    const ufSelect = document.querySelector("select[name=uf]")
    
    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
    .then( res => res.json() )
    .then( states => {
        
        for ( const state of states ) {
            ufSelect.innerHTML += `<option value='${state.id}'>${state.nome}</option>`
        }
        
    } )
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
    .then( res => res.json() )
    .then( cities => {
        
        for ( const city of cities ) {
            citySelect.innerHTML += `<option value='${city.nome}'>${city.nome}</option>`
        }

        citySelect.disabled = false
    } )


}

document
    .querySelector("select[name=uf]")
    .addEventListener("change", getCities)