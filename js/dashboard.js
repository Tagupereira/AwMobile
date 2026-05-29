import { API_URL, API_KEY } from "../config.js";
import { resetarTimer } from "../js/exitTime.js";
import { navegar } from '../js/router.js';

const userSession = JSON.parse(sessionStorage.getItem("user"));
    console.log(userSession);

    if(!userSession){
        navegar('index.html');
    }

//userSession.charAt(0).toUpperCase() -> pega a primeira letra e deixa maiuscula
//userSession.slice(1).toLowerCase() -> paga o retante e deixa minuscula
const userFormat = userSession.user.charAt(0).toUpperCase() + userSession.user.slice(1).toLowerCase();

const idSession = document.getElementById("userSession");
idSession.innerText = userFormat;//adiciona o Nome do usuario no header

const cadastro = document.getElementById("cadastro");
cadastro.addEventListener("click", () => {
    window.location.href = `../cadastro.html`;
})

const goItens = document.querySelectorAll('.goItens');

goItens.forEach(btn => {
    btn.addEventListener("click", () => {
        window.location.href = `../view_equipment.html`;
    });
});

const goTeam = document.getElementById('team');
    goTeam.addEventListener("click", () => {
        window.location.href = `../team.html`;
    });

async function getTotalItens() {
    
    const response = await fetch(
        //id,item,estado,local,codigo
        `${API_URL}itens?select=*,categoria(categoria),tipos(tipo),voltagens(voltagem),situacao(situacao)&order=id.asc`,
        {
            headers: {
                "apikey": API_KEY,
                "Authorization": "Bearer "+API_KEY
            }
        }
    );
    return await response.json();
}

getTotalItens().then(itens => {

    // total
    document.getElementById('item-qtd').innerText = itens.length;


    // defeito
    const defeito = itens.filter(
        item => item.situacao.situacao === "defeito"
    );
    // manutencao
    const manutencao = itens.filter(
        item => item.situacao.situacao === "manutencao"
    );
    // em evento
    const evento = itens.filter(
        item => item.situacao.situacao === "evento"
    );
    // locado
    const locado = itens.filter(
        item => item.situacao.situacao === "locado"
    );
    // analise
    const analise = itens.filter(
        item => item.situacao.situacao === "analise"
    );



    document.getElementById('manutencao-qtd').innerText = manutencao.length;
    //document.getElementById('defeito-qtd').innerText = defeito.length;
    document.getElementById('evento-qtd').innerText = evento.length;
    document.getElementById('locado-qtd').innerText = locado.length;
    //document.getElementById('analise-qtd').innerText = analise.length;

});