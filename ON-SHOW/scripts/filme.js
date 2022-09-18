// --------------------------------- DATA -----------------------------------
var filmeTitulo = localStorage.getItem('titulo-filme'); filmeTitulo = JSON.parse(filmeTitulo);
var filme_atual = document.getElementById("filme_pagina_2");
var pagina_genero = document.getElementById("genero");
var pagina_nota = document.getElementById("nota");
var pagina_duracao = document.getElementById("duracao");
var pagina_ano = document.getElementById("ano");
var pagina_sinopse = document.getElementById("sinopse-filme");
var pagina_filme = document.getElementById("filme-video");
var tituloHome = document.getElementById("title");
var lista_menu = document.getElementById("lista-menu");
// --------------------------------- DATA -----------------------------------
function Main() {
    GetFilmeData(filmeTitulo)
    GetReloadHome()
    MenuListener();
}
Main();

function GetReloadHome() {
    tituloHome.addEventListener('click', function(e)
    {
        window.location.href = 'http://127.0.0.1:5500/index.html';
    })
}
function MenuBar(x) {
    x.classList.toggle("change");
    $(".menu")[0].classList.toggle("change")
    $(".menu").toggle("change")
};

async function GetFilmeData(titulo) {
    var requestJson = 
    {
        Titulo: titulo
    }
    if(requestJson.Titulo != null)
    {
        await fetch('https://localhost:8001/main/filmes',
        {
        method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body:JSON.stringify(requestJson)
        })
        .then((response) => response.json())
        .then((data) =>
        {
            console.log(data);
            $("#filme_pagina_2").attr("src", data.catalogo)
            pagina_ano.innerText = data.ano;
            pagina_genero.innerText = data.genero;
            pagina_duracao.innerText = data.duracao;
            pagina_nota.innerText = data.nota;
            pagina_sinopse.innerText = data.sinopse;
            $("#filme-video").css("display", "flex");
            $("#filme-video").attr("src", data.video)
        })
    }
}
function MenuListener() {
    lista_menu.addEventListener('click',
        function (e) {
            let lstMenu = ['ACAO','AVENTURA','COMEDIA','DRAMA','ROMANCE','SUSPENSE','TERROR','SERIES']
            lstMenu.forEach(x => {
            if(e.target.id==x)
            {
                localStorage.setItem('operation', JSON.stringify('menu-filmes'));
                localStorage.setItem('category', JSON.stringify(e.target.id));
                localStorage.setItem('main-page', JSON.stringify(false));
                window.location.href = 'http://127.0.0.1:5500/index.html';
            }
        });
    })
}
function GetSearchFilme() {
    pesquisado = $("#entrada").val();
    localStorage.setItem('operation', JSON.stringify('search'));
    localStorage.setItem('pesquisado', JSON.stringify(pesquisado));
    localStorage.setItem('main-page', JSON.stringify(false));
    window.location.href = 'http://127.0.0.1:5500/index.html';
}
