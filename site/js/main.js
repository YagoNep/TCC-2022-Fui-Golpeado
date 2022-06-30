document.querySelector('#add').addEventListener("click", teste);

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