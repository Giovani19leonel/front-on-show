// ------------------------------- DATA ------------------------------------------
var mostrar_filmes = [true, false, false, false, false, false, false]
var ultimos_adicionados = []; var filmes_populares = []; var titulo_ultimos_adicionados = [];
var lista_acao = []; var lista_aventura = []; var lista_comedia = []; var lista_drama = [];
var lista_romance = []; var lista_suspense = []; var lista_terror = []; var lista_series = [];
var lista_menu = document.getElementById("lista-menu"); var filme_principal = "gallery-item gallery-item-3";
var botao2 = document.getElementById("voltar"); var botao1 = document.getElementById("avancar");
var foto1 = document.getElementById("foto1"); var foto2 = document.getElementById("foto2");
var foto3 = document.getElementById("foto3"); var foto4 = document.getElementById("foto4");
var foto5 = document.getElementById("foto5"); var foto6 = document.getElementById("foto6");
var foto7 = document.getElementById("foto7"); var radio1 = document.getElementById("botao1");
var radio2 = document.getElementById("botao2"); var radio3 = document.getElementById("botao3");
var radio4 = document.getElementById("botao4"); var radio5 = document.getElementById("botao5");
var radio6 = document.getElementById("botao6"); var radio7 = document.getElementById("botao7");
var radion = document.getElementsByName("position"); var numberImgs = [];
var tituloHome = document.getElementById("title"); var numberPages;
var operation = localStorage.getItem('operation'); operation = JSON.parse(operation);
// ------------------------------- DATA ------------------------------------------

function Main() {
    let isMain = ValideMainPage()
    if(isMain)
    {
        DefaultMain();
        DefaultListener();
    }
    else
    {
        if(operation == 'search')
        {
            RemoverHome();
            DefaultMain();
            DefaultListener();
            GetSearchFilme(false)
        }
        else if (operation == 'menu-filmes')
        {
            RemoverHome();
            DefaultMain();
            DefaultListener();
            let category = localStorage.getItem('category'); category = JSON.parse(category);
            AddMenuFilmes(category);
        }
    }
    localStorage.removeItem('main-page');
}
Main();

function DefaultMain() {
    GetFilmesCarrossel();
    GetFilmesPopulares();
    GetLastFilmes();
}
function DefaultListener() {
    MenuListener();
    RadionsListener();
    BotoesListener();
    GetReloadHome();
    AddDireitos($("#home"));
    ListenerImgs();
}
function ValideMainPage() {
    var mainPage = localStorage.getItem('main-page'); mainPage = JSON.parse(mainPage);
    if(mainPage !=null && mainPage == false)
        return false;
    return true
}
function GetFilmesPopulares() {
    var filmesPopulares = HttpRequest('https://localhost:8001/main/populares');
    filmesPopulares.onload = function () { PopulateHeader(filmesPopulares.response); }
}
function GetFilmesCarrossel() {
    var filmesCarrrossel = HttpRequest('https://localhost:8001/main/carousel');
    filmesCarrrossel.onload = function () { AddImgCarrossel(filmesCarrrossel.response); }
}
function GetLastFilmes() {
    var lastFilmes = HttpRequest('https://localhost:8001/main/filmes/last')
    lastFilmes.onload = function () { AddLastFilmes(lastFilmes.response) }
}
function GetReloadHome() {
    tituloHome.addEventListener('click', function(e)
    {
        document.location.reload(true);
    })
}
async function GetFilmesFiltersCategory(category) {
    var requestJson = 
    {
        Genero: category
    }
    if(requestJson.Genero != null)
    {
        await fetch('https://localhost:8001/main/filmes/genre',
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
            console.log(data)
            numberPages = Math.ceil(data.length / 30);
            var novaList = NewPageList(1,data)
            DeleteDireitos($(".direitos"));
            DeleteSrcImgSearch();
            InsertSearchFilmes(novaList);
            AddSearchAdminPage(true, 1, numberPages);
            AddDireitos($("#div-search"));
            PagesListener(data, numberPages);
            ListenerImgs()
        })
    }
}
async function GetSearchFilme(isMain = true) {
    var pesquisado;
    if(isMain)
        pesquisado = $("#entrada").val();
    else
    {
        let filmesPequisados = localStorage.getItem('pesquisado'); filmesPequisados = JSON.parse(filmesPequisados);
        $("#entrada").val(filmesPequisados)
        pesquisado = filmesPequisados;
    }
    var requestJson = 
    {
        Message: pesquisado
    }
    if(pesquisado!="")
    {
        await fetch('https://localhost:8001/main/search',
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
            
            numberPages = (data.length / 30).toFixed();
            var novaList = NewPageList(1,data)
            if(pesquisado.length==1)
            {
                RemoverHome();
                AddSearchFilmes();
            }
            DeleteDireitos($(".direitos"));
            DeleteSrcImgSearch();
            InsertSearchFilmes(novaList);
            AddSearchAdminPage(true, 1, numberPages);
            AddDireitos($("#div-search"));
            PagesListener(data, numberPages);
            ListenerImgs();
        })
        .catch((error) => 
        {
            console.error('Error', error);
        });
    }
    else{
        SearchAddHome();
        AddDireitos($("#home"));
    }
}
function NewPageList(page,data) {
    var max = (page*29);
    var min = (max-29);
    return data.filter(function(element) {
        return (min<=data.indexOf(element) && data.indexOf(element)<=max)
    })
}
function AddSearchFilmes(element=null) {
    $("#div-search").remove();
    $(".main-home").append($("<div/>", {
        class: "div-search",
        id: "div-search",
    }));
    $("#div-search").append($("<div/>",
    {
        style: "display:flex; align-items:center;margin-left:3vw",
        id: "div-search-cabecalho"
    }))
    if(element==null)
    {
        $("#div-search-cabecalho").append($("<img/>",
        {
            src: "./icones/lupa.png",
            class: "icon-search",
            style: "width:55px; height:55px"
        }));
        $("#div-search-cabecalho").append($("<h1/>",
        {
            class: "titulo-pesquisados",
            id:"titulo-pesquisados",
            text: "Filmes pesquisados:",
        }));
    }
    else
    {
        $("#div-search-cabecalho").append($("<img/>",
        {
            src: "./icones/filme.png",
            class: "icon-search",
            style: "width:55px; height:55px"
        }));
        $("#div-search-cabecalho").append($("<h1/>",
        {
            class: "titulo-pesquisados",
            id:"titulo-pesquisados",
            text: "Filmes de " + element.toLowerCase() + ":",
        }));
    }
    $("#div-search").append($("<div/>",
    {
        class: "div-search-filmes",
        id: "div-search-filmes",
        style: "background-color: rgba(106, 106, 106, 0.21)"
    }))
    for(let i=1; i<6; i++)
    {
        $("#div-search-filmes").append($("<div/>", 
        {
            class: "div-filmes-"+i,
        }).append($("<ul/>", 
        {
            class: "ul-filmes-"+i,
            id: "ul-"+i
        })))
        for(j=0; j<6; j++) {
            $("#ul-"+i).append($("<li/>",
            {
                class:"lst-search-filmes"+(j+1),
                id: "lst-search-filmes-"+i+"-"+j,
                style: "margin-top:15px; margin-bottom:2px; align-items: center; display:flex; flex-direction: column; margin-left:15px; height:300px"
            }).append($("<img/>",
            {
                id: "img-div-"+i+"-ul-"+j,
                style: "display: none",
                class: "image"
            })));
            $("#lst-search-filmes-"+i+"-"+j).append($("<h1/>",
            {
                id: "text-div-"+i+"-ul-"+j,
                style:"display: none",
                class: "titulosFilmes"
            }))
        }
    }
}
function PagesListener(data, numberPage = numberPages) {
    $("#page-number-1").click(function(e)
    {
        console.log($("#page-number-1").text());
        let novaList = NewPageList($("#page-number-1").text(), data)
        DeleteSrcImgSearch();
        DeleteDireitos($(".direitos"));
        InsertSearchFilmes(novaList);
        AddSearchAdminPage(false,$("#page-number-1").text(), numberPages);
        PagesListener(data);
        AddDireitos($("#div-search"));
    })
    $("#page-number-2").click(function(e)
    {
        console.log($("#page-number-2").text());
        let novaList = NewPageList($("#page-number-2").text(), data)
        DeleteSrcImgSearch();
        DeleteDireitos($(".direitos"));
        InsertSearchFilmes(novaList);
        AddSearchAdminPage(false,$("#page-number-2").text(), numberPages);
        PagesListener(data);
        AddDireitos($("#div-search"));
    })
    $("#page-number-3").click(function(e)
    {
        console.log($("#page-number-3").text());
        let novaList = NewPageList($("#page-number-3").text(), data)
        DeleteSrcImgSearch();
        DeleteDireitos($(".direitos"));
        InsertSearchFilmes(novaList);
        AddSearchAdminPage(false,$("#page-number-3").text(), numberPages);
        PagesListener(data);
        AddDireitos($("#div-search"));
    })
    $("#page-number-4").click(function(e)
    {
        console.log($("#page-number-4").text());
        let novaList = NewPageList($("#page-number-4").text(), data)
        DeleteSrcImgSearch();
        DeleteDireitos($(".direitos"));
        InsertSearchFilmes(novaList);
        AddSearchAdminPage(false,$("#page-number-4").text(), numberPages);
        PagesListener(data);
        AddDireitos($("#div-search"));
    })
}
function AddSearchAdminPage(build,page,numberPages) {
    if(!build)
    {
        $("#div-search-pages").remove();
    }
    $("#div-search").append($("<div/>",
    {
        style: "display:flex; justify-content: center;margin-top: 25px",
        id: "div-search-pages"
    }))
    for(let i=1; i<5; i++)
    {
        $("#div-search-pages").append($("<p/>",
        {
            id: "page-number-" + i,
            style: "color: white; display:none; margin: 7px; font-size:20px; cursor: pointer"
        }))
    }
    page = parseInt(page);
    $("#page-number-2").text(page)
    $("#page-number-2").css("display", "flex");
    $("#page-number-2").css("color", "red");

    if(page-1>0)
    {
        $("#page-number-1").text(page-1)
        $("#page-number-1").css("display", "flex");
    }
    else $("#page-number-1").css("display", "none");
    
    if(page+1<=numberPages)
    {
        $("#page-number-3").text(page+1)
        $("#page-number-3").css("display", "flex");
    } 
    else $("#page-number-3").css("display", "none");

    if(page+2<=numberPages)
    {
        $("#page-number-4").text(page+2)
        $("#page-number-4").css("display", "flex");
    } else $("#page-number-4").css("display", "none");

}
function InsertSearchFilmes(data) {
    data.forEach(function(element)
    {
        id = data.indexOf(element);
        if(id < 6)
        {
            $("#img-div-1-ul-"+id).prop("src", element['catalogo']);
            $("#img-div-1-ul-"+id).css("display", "flex");
            $("#text-div-1-ul-"+id).text(element['titulo'])
            $("#text-div-1-ul-"+id).css("display", "block")
            $("#lst-search-filmes-1-"+id).height(300)
            return;
        }
        if(5<id && id<12)
        {
            $("#img-div-2-ul-"+(id-6)).prop("src", element['catalogo']);
            $("#img-div-2-ul-"+(id-6)).css("display", "flex");
            $("#text-div-2-ul-"+(id-6)).text(element['titulo'])
            $("#text-div-2-ul-"+(id-6)).css("display", "block")
            $("#lst-search-filmes-2-"+(id-6)).height(300)
            return;
        }
        if(11<id && id<18)
        {
            $("#img-div-3-ul-"+(id-12)).prop("src", element['catalogo']);
            $("#img-div-3-ul-"+(id-12)).css("display", "flex");
            $("#text-div-3-ul-"+(id-12)).text(element['titulo'])
            $("#text-div-3-ul-"+(id-12)).css("display", "block")
            $("#lst-search-filmes-3-"+(id-12)).height(300)
            return;
        }
        if(17<id && id<24)
        {
            $("#img-div-4-ul-"+(id-18)).prop("src", element['catalogo']);
            $("#img-div-4-ul-"+(id-18)).css("display", "flex");
            $("#text-div-4-ul-"+(id-18)).text(element['titulo'])
            $("#text-div-4-ul-"+(id-18)).css("display", "block")
            $("#lst-search-filmes-4-"+(id-18)).height(300)
            return;
        }
        if(23<id<30)
        {
            $("#img-div-5-ul-"+(id-24)).prop("src", element['catalogo']);
            $("#img-div-5-ul-"+(id-24)).css("display", "flex");
            $("#text-div-5-ul-"+(id-24)).text(element['titulo'])
            $("#text-div-5-ul-"+(id-24)).css("display", "block")
            $("#lst-search-filmes-5-"+(id-24)).height(300)
            return;
        }
    });
}
function DeleteSrcImgSearch() {
    for(let i=1; i<6; i++)
    {
        for(let j=0; j<6; j++)
        {
            $("#img-div-"+i+"-ul-"+j).css("display", "none");
            $("#text-div-"+i+"-ul-"+j).css("display", "none");
            $("#lst-search-filmes-"+i+"-"+j).height(0)
        }
    }
}
function AddLastFilmes(jsonObj) {
    for (let i = 0; i < 6; i++) {
        let li = $("<li/>", {
            class: "item-populares",
            id: "fila-um-populares-" + i,
            style: "height: 300px"
        });
        $("#lista-um-adicionados").append(li);
    }
    for (let i = 0; i < 6; i++) {
        let img = $("<img/>", {
            src: jsonObj[i]['catalogo'],
            class: 'image',
            id: 'img-last-'+i
        });
        let titulo = $("<h1 class=ultimosTitulosFilmes>" + jsonObj[i]['titulo'] + "</h1>");
        $("#fila-um-populares-" + i).append(img)
        $("#fila-um-populares-" + i).append(titulo)
    }
    for (let i = 0; i < 6; i++) {
        let li = $("<li/>", {
            class: "item-populares",
            id: "fila-dois-populares-" + i,
            style: "height: 300px"
        });
        $("#lista-dois-adicionados").append(li);
    }
    for (let i = 6; i < 12; i++) {
        let img = $("<img/>", {
            src: jsonObj[i]['catalogo'],
            class: 'image',
            id: 'img-last-'+i
        });
        let titulo = $("<h1 class=ultimosTitulosFilmes>" + jsonObj[i]['titulo'] + "</h1>");
        $("#fila-dois-populares-" + (i - 6)).append(img)
        $("#fila-dois-populares-" + (i - 6)).append(titulo)
    }
    for (let i = 0; i < 6; i++) {
        let li = $("<li/>", {
            class: "item-populares",
            id: "fila-tres-populares-" + i,
            style: "height: 300px"
        });
        $("#lista-tres-adicionados").append(li);
    }
    for (let i = 12; i < 18; i++) {
        let img = $("<img/>", {
            src: jsonObj[i]['catalogo'],
            class: 'image',
            id: 'img-last-'+i
        });
        let titulo = $("<h1 class=ultimosTitulosFilmes>" + jsonObj[i]['titulo'] + "</h1>");
        $("#fila-tres-populares-" + (i - 12)).append(img)
        $("#fila-tres-populares-" + (i - 12)).append(titulo)
    }
}
function AddImgCarrossel(jsonObj) {
    console.log(jsonObj[3]['titulo'])
    for(let i=0; i<=6; i++)
    {
        let filmeCarrossel = document.getElementById("foto" + (i+1))
        filmeCarrossel.src = jsonObj[i]['catalogo']
    }
}
function HttpRequest(requestURL) {
    var request = new XMLHttpRequest();
    request.open('GET', requestURL);
    request.responseType = 'json';
    request.send(null);
    return request
}
function PopulateHeader(jsonObj) {
    
    for(let i=0; i<6; i++) {
        let li = $("<li/>",
        {
            class: "item-populares",
            id: "populares-um-" + i,
            style: "height: 300px"
        });
        $("#populares-fila-um").append(li);
    }
    for(let i=0; i<6; i++) {
        let li = $("<li/>",
        {
            class: "item-populares",
            id: "populares-dois-" + i,
            style: "height: 300px"
        });
        $("#populares-fila-dois").append(li);
    }
    jsonObj.forEach(element => {
        if(jsonObj.indexOf(element) < 6)
        {
            let img = $("<img/>", {
                src: element['catalogo'],
                class: 'image',
                id: 'img-populares-'+jsonObj.indexOf(element)
            });
            let titulo = $("<h1 class=titulosFilmes>" + element['titulo'] + "</h1>");
            $("#populares-um-" + jsonObj.indexOf(element)).append(img)
            $("#populares-um-" + jsonObj.indexOf(element)).append(titulo)
        }
        else
        {
            let img = $("<img/>", {
                src: element['catalogo'],
                class: 'image',
                id: 'img-populares-'+jsonObj.indexOf(element)
            });
            let titulo = $("<h1 class=titulosFilmes>" + element['titulo'] + "</h1>");
            console.log((jsonObj.indexOf(element)-6));
            $("#populares-dois-" + (jsonObj.indexOf(element)-6)).append(img)
            $("#populares-dois-" + (jsonObj.indexOf(element)-6)).append(titulo)
        }
    });(jsonObj.length)
}
function RemoverHome() {
    $("#home").css("display", "none");
}
function SearchAddHome() {
    $("#div-search").remove()
    $("#home").css("display", "flex");
    //DefaultMain();
}
function MenuListener() {
    lista_menu.addEventListener('click',
        function (e) {
            AddMenuFilmes(e.target.id)
        });
}
function RadionsListener() {
    radio1.addEventListener('click',
        function (e) {

            for (let i = 0; i < 7; i++) {
                radion[i].removeAttribute('checked');
                mostrar_filmes[i] = false
                if (i == 0) {
                    mostrar_filmes[i] = true
                    radion[i].setAttribute('checked', 'checked');
                }
            }
            console.log(mostrar_filmes)
            foto1.classList = "gallery-item gallery-item-1"
            foto2.className = "gallery-item gallery-item-2"
            foto3.className = "gallery-item gallery-item-3"
            foto4.className = "gallery-item gallery-item-4"
            foto5.className = "gallery-item gallery-item-5"
            foto6.className = "gallery-item gallery-item-6"
            foto7.className = "gallery-item gallery-item-7"
            console.log(e.target)
        });
    radio2.addEventListener('click',
        function (e) {
            for (let i = 0; i < 7; i++) {
                mostrar_filmes[i] = false
                radion[i].removeAttribute('checked');
                if (i == 1) {
                    mostrar_filmes[i] = true
                    radion[i].setAttribute('checked', 'checked');
                }
            }
            console.log(mostrar_filmes)
            foto1.classList = "gallery-item gallery-item-7"
            foto2.className = "gallery-item gallery-item-1"
            foto3.className = "gallery-item gallery-item-2"
            foto4.className = "gallery-item gallery-item-3"
            foto5.className = "gallery-item gallery-item-4"
            foto6.className = "gallery-item gallery-item-5"
            foto7.className = "gallery-item gallery-item-6"
            console.log(e.target)
        });
    radio3.addEventListener('click',
        function (e) {
            for (let i = 0; i < 7; i++) {
                mostrar_filmes[i] = false
                radion[i].removeAttribute('checked');
                if (i == 2) {
                    mostrar_filmes[i] = true
                    radion[i].setAttribute('checked', 'checked');
                }
            }
            console.log(mostrar_filmes)
            foto1.classList = "gallery-item gallery-item-6"
            foto2.className = "gallery-item gallery-item-7"
            foto3.className = "gallery-item gallery-item-1"
            foto4.className = "gallery-item gallery-item-2"
            foto5.className = "gallery-item gallery-item-3"
            foto6.className = "gallery-item gallery-item-4"
            foto7.className = "gallery-item gallery-item-5"
            console.log(e.target)
        });
    radio4.addEventListener('click',
        function (e) {
            for (let i = 0; i < 7; i++) {
                mostrar_filmes[i] = false
                radion[i].removeAttribute('checked');
                if (i == 3) {
                    mostrar_filmes[i] = true
                    radion[i].setAttribute('checked', 'checked');
                }
            }
            console.log(mostrar_filmes)
            foto1.classList = "gallery-item gallery-item-5"
            foto2.className = "gallery-item gallery-item-6"
            foto3.className = "gallery-item gallery-item-7"
            foto4.className = "gallery-item gallery-item-1"
            foto5.className = "gallery-item gallery-item-2"
            foto6.className = "gallery-item gallery-item-3"
            foto7.className = "gallery-item gallery-item-4"
            console.log(e.target)
        });
    radio5.addEventListener('click',
        function (e) {
            for (let i = 0; i < 7; i++) {
                mostrar_filmes[i] = false
                radion[i].removeAttribute('checked');
                if (i == 4) {
                    mostrar_filmes[i] = true
                    radion[i].setAttribute('checked', 'checked');
                }
            }
            console.log(mostrar_filmes)
            foto1.classList = "gallery-item gallery-item-4"
            foto2.className = "gallery-item gallery-item-5"
            foto3.className = "gallery-item gallery-item-6"
            foto4.className = "gallery-item gallery-item-7"
            foto5.className = "gallery-item gallery-item-1"
            foto6.className = "gallery-item gallery-item-2"
            foto7.className = "gallery-item gallery-item-3"
            console.log(e.target)
        });
    radio6.addEventListener('click',
        function (e) {
            for (let i = 0; i < 7; i++) {
                mostrar_filmes[i] = false
                radion[i].removeAttribute('checked');
                if (i == 5) {
                    mostrar_filmes[i] = true
                    radion[i].setAttribute('checked', 'checked');
                }
            }
            console.log(mostrar_filmes)
            foto1.classList = "gallery-item gallery-item-3"
            foto2.className = "gallery-item gallery-item-4"
            foto3.className = "gallery-item gallery-item-5"
            foto4.className = "gallery-item gallery-item-6"
            foto5.className = "gallery-item gallery-item-7"
            foto6.className = "gallery-item gallery-item-1"
            foto7.className = "gallery-item gallery-item-2"
            console.log(e.target)
        });
    radio7.addEventListener('click',
        function (e) {
            for (let i = 0; i < 7; i++) {
                mostrar_filmes[i] = false
                radion[i].removeAttribute('checked');
                if (i == 6) {
                    mostrar_filmes[i] = true
                    radion[i].setAttribute('checked', 'checked');
                }
            }

            console.log(mostrar_filmes)
            foto1.classList = "gallery-item gallery-item-2"
            foto2.className = "gallery-item gallery-item-3"
            foto3.className = "gallery-item gallery-item-4"
            foto4.className = "gallery-item gallery-item-5"
            foto5.className = "gallery-item gallery-item-6"
            foto6.className = "gallery-item gallery-item-7"
            foto7.className = "gallery-item gallery-item-1"
            console.log(e.target)
        });
}
function BotoesListener() {
    botao1.addEventListener('click',
        function (e) {
            
            for (let i = 0; i < mostrar_filmes.length; i++) {
                if (mostrar_filmes[i]) {
                    if (i == 6) {
                        mostrar_filmes[i] = false;
                        mostrar_filmes[0] = true
                    }
                    else {
                        mostrar_filmes[i] = false;
                        mostrar_filmes[i + 1] = true
                    }
                    if (i == 0) {
                        if (radion[i].checked) {
                            radion[i].removeAttribute('checked')
                        }
                        if (!radion[1].checked) {
                            foto1.classList = "gallery-item gallery-item-7"
                            foto2.className = "gallery-item gallery-item-1"
                            foto3.className = "gallery-item gallery-item-2"
                            foto4.className = "gallery-item gallery-item-3"
                            foto5.className = "gallery-item gallery-item-4"
                            foto6.className = "gallery-item gallery-item-5"
                            foto7.className = "gallery-item gallery-item-6"
                            radion[1].checked = true
                        }
                    }
                    else if (i == 1) {
                        if (radion[i].checked) {
                            radion[i].removeAttribute('checked')
                        }
                        if (!radion[2].checked) {
                            radion[2].checked = true
                            foto1.classList = "gallery-item gallery-item-6"
                            foto2.className = "gallery-item gallery-item-7"
                            foto3.className = "gallery-item gallery-item-1"
                            foto4.className = "gallery-item gallery-item-2"
                            foto5.className = "gallery-item gallery-item-3"
                            foto6.className = "gallery-item gallery-item-4"
                            foto7.className = "gallery-item gallery-item-5"
                        }
                    }
                    else if (i == 2) {
                        if (radion[i].checked) {
                            radion[i].checked = true
                        }
                        if (!radion[3].checked) {
                            radion[3].checked = true
                            foto1.classList = "gallery-item gallery-item-5"
                            foto2.className = "gallery-item gallery-item-6"
                            foto3.className = "gallery-item gallery-item-7"
                            foto4.className = "gallery-item gallery-item-1"
                            foto5.className = "gallery-item gallery-item-2"
                            foto6.className = "gallery-item gallery-item-3"
                            foto7.className = "gallery-item gallery-item-4"
                        }
                    }
                    else if (i == 3) {
                        if (radion[i].checked) {
                            radion[i].removeAttribute('checked')
                        }
                        if (!radion[4].checked) {
                            foto1.classList = "gallery-item gallery-item-4"
                            foto2.className = "gallery-item gallery-item-5"
                            foto3.className = "gallery-item gallery-item-6"
                            foto4.className = "gallery-item gallery-item-7"
                            foto5.className = "gallery-item gallery-item-1"
                            foto6.className = "gallery-item gallery-item-2"
                            foto7.className = "gallery-item gallery-item-3"
                            radion[4].checked = true
                        }
                    }
                    else if (i == 3) {
                        if (radion[i].checked) {
                            radion[i].removeAttribute('checked')
                        }
                        if (!radion[4].checked) {
                            radion[4].checked = true
                            foto1.classList = "gallery-item gallery-item-3"
                            foto2.className = "gallery-item gallery-item-4"
                            foto3.className = "gallery-item gallery-item-5"
                            foto4.className = "gallery-item gallery-item-6"
                            foto5.className = "gallery-item gallery-item-7"
                            foto6.className = "gallery-item gallery-item-1"
                            foto7.className = "gallery-item gallery-item-2"
                        }
                    }
                    else if (i == 4) {
                        if (radion[i].checked) {
                            radion[i].removeAttribute('checked')
                        }
                        if (!radion[5].checked) {
                            radion[5].checked = true
                            foto1.classList = "gallery-item gallery-item-3"
                            foto2.className = "gallery-item gallery-item-4"
                            foto3.className = "gallery-item gallery-item-5"
                            foto4.className = "gallery-item gallery-item-6"
                            foto5.className = "gallery-item gallery-item-7"
                            foto6.className = "gallery-item gallery-item-1"
                            foto7.className = "gallery-item gallery-item-2"
                        }
                    }
                    else if (i == 5) {
                        if (radion[i].checked) {
                            radion[i].removeAttribute('checked')
                        }
                        if (!radion[6].checked) {
                            radion[6].checked = true
                            foto1.classList = "gallery-item gallery-item-2"
                            foto2.className = "gallery-item gallery-item-3"
                            foto3.className = "gallery-item gallery-item-4"
                            foto4.className = "gallery-item gallery-item-5"
                            foto5.className = "gallery-item gallery-item-6"
                            foto6.className = "gallery-item gallery-item-7"
                            foto7.className = "gallery-item gallery-item-1"
                        }
                    }
                    else if (i == 6) {
                        if (radion[i].checked) {
                            radion[i].removeAttribute('checked')
                        }
                        if (!radion[0].checked) {
                            foto1.classList = "gallery-item gallery-item-1"
                            foto2.className = "gallery-item gallery-item-2"
                            foto3.className = "gallery-item gallery-item-3"
                            foto4.className = "gallery-item gallery-item-4"
                            foto5.className = "gallery-item gallery-item-5"
                            foto6.className = "gallery-item gallery-item-6"
                            foto7.className = "gallery-item gallery-item-7"
                            radion[0].checked = true
                        }
                    }
                    break
                }
            }
        });
    botao2.addEventListener('click',
        function (e) {
            for (let i = 0; i < mostrar_filmes.length; i++) {
                if (mostrar_filmes[i]) {
                    if (i == 0) {
                        mostrar_filmes[i] = false;
                        mostrar_filmes[6] = true
                    }
                    else {
                        mostrar_filmes[i] = false;
                        mostrar_filmes[i - 1] = true
                    }
                    console.log(mostrar_filmes)
                    if (i == 0) {
                        if (radion[i].checked) {
                            radion[i].removeAttribute('checked')
                        }
                        if (!radion[6].checked) {
                            foto1.classList = "gallery-item gallery-item-2"
                            foto2.className = "gallery-item gallery-item-3"
                            foto3.className = "gallery-item gallery-item-4"
                            foto4.className = "gallery-item gallery-item-5"
                            foto5.className = "gallery-item gallery-item-6"
                            foto6.className = "gallery-item gallery-item-7"
                            foto7.className = "gallery-item gallery-item-1"
                            radion[6].checked = true
                        }
                    }
                    else if (i == 1) {
                        if (radion[i].checked) {
                            radion[i].removeAttribute('checked')
                        }
                        if (!radion[0].checked) {
                            radion[0].checked = true
                            foto1.classList = "gallery-item gallery-item-1"
                            foto2.className = "gallery-item gallery-item-2"
                            foto3.className = "gallery-item gallery-item-3"
                            foto4.className = "gallery-item gallery-item-4"
                            foto5.className = "gallery-item gallery-item-5"
                            foto6.className = "gallery-item gallery-item-6"
                            foto7.className = "gallery-item gallery-item-7"
                        }
                    }
                    else if (i == 2) {
                        if (radion[i].checked) {
                            radion[i].checked = true
                        }
                        if (!radion[1].checked) {
                            radion[1].checked = true
                            foto1.classList = "gallery-item gallery-item-7"
                            foto2.className = "gallery-item gallery-item-1"
                            foto3.className = "gallery-item gallery-item-2"
                            foto4.className = "gallery-item gallery-item-3"
                            foto5.className = "gallery-item gallery-item-4"
                            foto6.className = "gallery-item gallery-item-5"
                            foto7.className = "gallery-item gallery-item-6"
                        }
                    }
                    else if (i == 3) {
                        if (radion[i].checked) {
                            radion[i].removeAttribute('checked')
                        }
                        if (!radion[2].checked) {
                            foto1.classList = "gallery-item gallery-item-6"
                            foto2.className = "gallery-item gallery-item-7"
                            foto3.className = "gallery-item gallery-item-1"
                            foto4.className = "gallery-item gallery-item-2"
                            foto5.className = "gallery-item gallery-item-3"
                            foto6.className = "gallery-item gallery-item-4"
                            foto7.className = "gallery-item gallery-item-5"
                            radion[2].checked = true
                        }
                    }
                    else if (i == 4) {
                        if (radion[i].checked) {
                            radion[i].removeAttribute('checked')
                        }
                        if (!radion[3].checked) {
                            radion[3].checked = true
                            foto1.classList = "gallery-item gallery-item-5"
                            foto2.className = "gallery-item gallery-item-6"
                            foto3.className = "gallery-item gallery-item-7"
                            foto4.className = "gallery-item gallery-item-1"
                            foto5.className = "gallery-item gallery-item-2"
                            foto6.className = "gallery-item gallery-item-3"
                            foto7.className = "gallery-item gallery-item-4"
                        }
                    }
                    else if (i == 5) {
                        if (radion[i].checked) {
                            radion[i].removeAttribute('checked')
                        }
                        if (!radion[4].checked) {
                            radion[4].checked = true
                            foto1.classList = "gallery-item gallery-item-4"
                            foto2.className = "gallery-item gallery-item-5"
                            foto3.className = "gallery-item gallery-item-6"
                            foto4.className = "gallery-item gallery-item-7"
                            foto5.className = "gallery-item gallery-item-1"
                            foto6.className = "gallery-item gallery-item-2"
                            foto7.className = "gallery-item gallery-item-3"
                        }
                    }
                    else if (i == 6) {
                        if (radion[i].checked) {
                            radion[i].removeAttribute('checked')
                        }
                        if (!radion[5].checked) {
                            radion[5].checked = true
                            foto1.classList = "gallery-item gallery-item-3"
                            foto2.className = "gallery-item gallery-item-4"
                            foto3.className = "gallery-item gallery-item-5"
                            foto4.className = "gallery-item gallery-item-6"
                            foto5.className = "gallery-item gallery-item-7"
                            foto6.className = "gallery-item gallery-item-1"
                            foto7.className = "gallery-item gallery-item-2"
                        }
                    }
                    else if (i == 0) {
                        if (radion[i].checked) {
                            radion[i].removeAttribute('checked')
                        }
                        if (!radion[6].checked) {
                            foto1.classList = "gallery-item gallery-item-1"
                            foto2.className = "gallery-item gallery-item-2"
                            foto3.className = "gallery-item gallery-item-3"
                            foto4.className = "gallery-item gallery-item-4"
                            foto5.className = "gallery-item gallery-item-5"
                            foto6.className = "gallery-item gallery-item-6"
                            foto7.className = "gallery-item gallery-item-7"
                            radion[6].checked = true
                        }
                    }
                    break
                }
            }
        });
}
function FotosListeners() {
    foto1.addEventListener('click',
        function (e) {
            console.log(e.target.className)
        });
    foto4.addEventListener('click',
        function (e) {
            console.log(e.target.className)
        });

}
function MenuBar(x) {
    x.classList.toggle("change");
    $(".menu")[0].classList.toggle("change")
    $(".menu").toggle("change")
};
function AddDireitos(div) {
    div.append($("<div/>",{
        class: "direitos"
    }).append($("<h2/>",{
        class: "texto-direitos",
        text: "Filmes online hd - Series e Filmes"
    })).append($("<h2/>",{
        class: "texto-direitos-dois",
        text: "© FilmesOnline 2022 - Todos os direitos reservados"
    })))
}
function DeleteDireitos(div) {
    div.remove();
}
function ListenerImgs() {
    setTimeout(function () {
        $('img').mouseenter(function (e)
        {
            if((e.target.className!='estrela' && e.target.className!='icone-pesquisa') 
            && (e.target.className=='gallery-item gallery-item-4' || e.target.className=='image'))
            {
                let titulo = $("#"+e.target.id).parent().children()[1].innerHTML;
                console.log(e.target.className)
                if(e.target.className=='gallery-item gallery-item-4')
                {
                    e.target.classList.remove('gallery-item-4')
                    e.target.classList.add('gallery-testev2')
                    
                    $(".gallery-testev2").click(function() {
                        var src = $('.gallery-testev2').attr('src');
                        GetFilmeCarrossel(src)
                    });
                    $(".gallery-testev2").mouseout(function(e)
                    {
                        e.target.classList.remove('gallery-testev2')
                        e.target.classList.add('gallery-item-4')
                    })
                }
                else
                {
                    console.log($("#icon-play").length);
                    if($("#icon-play").length != 0)
                    {
                        let id = $("#div-play").parent().children()[1].id;
                        $("#"+id).css("height", 180)
                        $("#"+id).css("width", 180)
                        $("#"+id).css("opacity", 1);
                        $("#div-play").remove();
                        
                    }
                    $("#"+e.target.id).css("transition", 'all 0.25s ease-in-out');
                    $("#"+e.target.id).css("width", 200);
                    $("#"+e.target.id).css("opacity", 0.4);
                    $("#"+e.target.id).css("height", 200);

                    $("#"+e.target.id).parent().prepend($("<div/>",
                    {
                        id:"div-play",
                        class: "icon-play",
                        style: "z-index:1; position:absolute; height:200px; width:200px; display: flex; justify-content: center;align-items: center;"
                    }));
                    $("#div-play").append($("<img/>",
                    {
                        id: "icon-play",
                        class:"icon-play",
                        src: "../icones/play.png",
                        style: "z-index:1; position:absolute; height:80px; width:80px;"
                    }));
                    $(".icon-play").click(function(x) {

                            let titulo = $("#div-play").parent().children()[2].innerHTML;
                            localStorage.setItem('titulo-filme', JSON.stringify(titulo));
                            window.location.href = 'http://127.0.0.1:5500/pagina2/filme.html';
                        });
                    $(".icon-play").mouseout(function(e)
                    {
                        let id = $("#div-play").parent().children()[1].id;
                        $("#"+id).css("height", 180);
                        $("#"+id).css("width", 180);
                        $("#"+id).css("opacity", 1);
                        $("#div-play").remove();
                    })
                }
            }
        })
    }, 700)
}
function AddMenuFilmes(category) {
    let lstMenu = ['ACAO','AVENTURA','COMEDIA','DRAMA','ROMANCE','SUSPENSE','TERROR','SERIES']
    lstMenu.forEach(x => {
        if(category==x)
        {
            let element = $("#"+category).text();
            RemoverHome()
            AddSearchFilmes(element);
            GetFilmesFiltersCategory(element);
        }
    });
}
async function GetFilmeCarrossel(catalogo) {
    if(catalogo !=null)
    {
        let requestJson = 
        {
            Catalogo: catalogo
        }

        await fetch('https://localhost:8001/main/filmes/carousel',
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
            console.log(data.titulo);
            localStorage.setItem('titulo-filme', JSON.stringify(data.titulo));
            window.location.href = 'http://127.0.0.1:5500/pagina2/filme.html';
        })
        .catch((error) => 
        {
            console.error('Error', error);
        });
    }

}