import { API_URL, API_KEY } from "../config.js";
import { showModal } from "./modal.js";
import { showToast } from "./toast.js";
import { criarLog } from "../js/log.js";

const userSession = JSON.parse(sessionStorage.getItem("user"));
console.log(userSession);

if (!userSession) {

    window.location.href = 'index.html';

}


const btnBack = document.querySelectorAll('.backBtn');
btnBack.forEach(btn => {
    btn.addEventListener("click", () => {
        history.go(-1);
    });
});

const buttonActionPage = document.getElementById("btn-action");
const buttonActionCancel = document.getElementById("btn-cancel");

const btnAction = document.getElementById("actionCad");
const pageName = document.getElementById("namePage");

if (userSession.id_tipoAcesso == 2) {
    bloquearBotoes()
}
const params = new URLSearchParams(window.location.search);

const id = params.get("id");

const modoEdicao = !!id; //condição recebe se o id é true ou false

if (modoEdicao) { // se for verdadeiro
    buscarDoServidor(id)

} else {
    //cadastrarItem();
    buscarCategoria(1);
    buscarVoltagem(1);
    buscarSituacao(1);
    buscarTipo(1);

    btnAction.innerText = "Cadastrar Item";
    pageName.innerText = "Cadastrar novo";
}

const modalConfig = modoEdicao ? {

    title: 'Editar Item',

    message: 'Deseja salvar as alterações?',

    confirmText: 'Salvar',

    toast: {
        message: 'Alterações salvas',
        type: 'success'
    }

}
    : {

        title: 'Cadastrar Item',

        message: 'Deseja cadastrar novo item?',

        confirmText: 'Cadastrar',

        toast: {
            message: 'Item cadastrado',
            type: 'success'
        }

    };

async function buscarDoServidor(id) {

    try {
        const response = await fetch(
            `${API_URL}itens?id=eq.${id}&select=*,categoria(categoria),tipos(tipo),voltagens(voltagem),situacao(situacao)&order=id.asc`,
            {
                headers: {
                    apikey: API_KEY,
                    Authorization: `Bearer ${API_KEY}`
                }
            }
        );

        const data = await response.json();

        if (!data.length) return erroTela();

        console.log(data);

        const item = data[0];

        preencherTela(item);

    } catch (e) {
        console.error(e);

    }
}

function erroTela() {
    alert("erro")
}

async function buscarCategoria(categoria) {

    const response = await fetch(`${API_URL}categoria?select=*&order=id.asc`,
        {
            headers: {
                apikey: API_KEY,
                Authorization: `Bearer ${API_KEY}`
            }
        }
    );

    const dataCat = await response.json();

    const select = document.getElementById("item-categoria");

    dataCat.forEach(cat => {

        const option = document.createElement("option");

        option.value = cat.id;
        option.textContent = cat.categoria.toUpperCase();

        select.appendChild(option);

    });

    select.value = categoria;

}

async function buscarVoltagem(voltagem) {

    const response = await fetch(`${API_URL}voltagens?select=*&order=id_voltagem.asc`,
        {
            headers: {
                apikey: API_KEY,
                Authorization: `Bearer ${API_KEY}`
            }
        }
    );

    const dataCat = await response.json();

    const selectVolt = document.getElementById("item-voltagem");

    dataCat.forEach(volt => {

        const option = document.createElement("option");

        option.value = volt.id_voltagem;
        option.textContent = volt.voltagem;

        selectVolt.appendChild(option);

    });

    selectVolt.value = voltagem;

}

async function buscarTipo(itemTipo) {

    const response = await fetch(`${API_URL}tipos?select=*&order=id.asc`,
        {
            headers: {
                apikey: API_KEY,
                Authorization: `Bearer ${API_KEY}`
            }
        }
    );

    const dataCat = await response.json();

    const selectTipo = document.getElementById("item-tipo");

    dataCat.forEach(tipo => {

        const option = document.createElement("option");

        option.value = tipo.id;
        option.textContent = tipo.tipo.toUpperCase();

        selectTipo.appendChild(option);

    });

    selectTipo.value = itemTipo;

}

async function buscarSituacao(situacao) {

    const response = await fetch(`${API_URL}situacao?select=*&order=id.asc`,
        {
            headers: {
                apikey: API_KEY,
                Authorization: `Bearer ${API_KEY}`
            }
        }
    );

    const dataCat = await response.json();

    const selectTipo = document.getElementById("item-situacao");

    dataCat.forEach(sit => {

        const option = document.createElement("option");

        option.value = sit.id;
        option.textContent = sit.situacao.toUpperCase();

        selectTipo.appendChild(option);

    });

    selectTipo.value = situacao;

}

function preencherTela(item) {

    document.getElementById('item-nome').value = `${item.item}` || 'Sem nome';
    document.getElementById('item-local').value = `${item.local.toUpperCase() || '-'}`;
    document.getElementById('item-serial').value = `${item.n_serie || '-'}`;
    document.getElementById('item-cod').value = String(`${item.patrimonio}`).padStart(6, '0');
    document.getElementById('item-obs').value = `${item.observacao}`;

    btnAction.innerText = "Salvar Alterações";
    pageName.innerText = "Editar equipamento";

    buscarCategoria(item.id_categoria);
    buscarVoltagem(item.id_voltagem);
    buscarTipo(item.id_tipo);
    buscarSituacao(item.id_situacao);

}

function dadosItem() {
    const cod = document.getElementById('item-cod').value;
    const item = document.getElementById('item-nome').value;
    const tipo = document.getElementById('item-tipo').value;
    const voltagem = document.getElementById('item-voltagem').value;
    const categoria = document.getElementById('item-categoria').value;
    const local = document.getElementById('item-local').value;
    const serial = document.getElementById('item-serial').value;
    const situacao = document.getElementById('item-situacao').value;
    const observacao = document.getElementById('item-obs').value;

    const dados = [cod, item, tipo, voltagem, categoria, local, serial, situacao, observacao];

    if (modoEdicao) {
        editarItem(id, dados);
        return
    }

    criarItem(dados);

}

async function criarItem(dados) {


    const novoItem = {
        patrimonio: dados[0],
        item: dados[1],
        id_tipo: dados[2],
        id_voltagem: dados[3],
        id_categoria: dados[4],
        local: dados[5],
        n_serie: dados[6],
        id_situacao: dados[7],
        observacao: dados[8],

    };

    const response = await fetch(API_URL + "itens", {
        method: 'POST',
        headers: {
            apikey: API_KEY,
            Authorization: `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
            Prefer: 'return=representation'
        },
        body: JSON.stringify(novoItem)
    });

    const data = await response.json();
    console.log(data);

    const patrimonio = String(novoItem.patrimonio).padStart(6, '0')
    const acao = "Cadastrou";
    const obs = `cadastrou - #${patrimonio} - ${novoItem.item}`;

    criarLog(userSession, acao, obs)

}

async function editarItem(id, dados) {

    console.log(id);
    console.log("dados ", dados);


    const itemAtualizado = {

        patrimonio: dados[0],
        item: dados[1],
        id_tipo: dados[2],
        id_voltagem: dados[3],
        id_categoria: dados[4],
        local: dados[5],
        n_serie: dados[6],
        id_situacao: dados[7],
        observacao: dados[8],

    };

    console.log(itemAtualizado);

    const response = await fetch(
        `${API_URL}itens?id=eq.${id}`,
        {
            method: 'PATCH',
            headers: {
                apikey: API_KEY,
                Authorization: `Bearer ${API_KEY}`,
                'Content-Type': 'application/json',
                Prefer: 'return=representation'
            },
            body: JSON.stringify(itemAtualizado)
        }
    );

    const data = await response.json();
    console.log(data);

    const patrimonio = String(itemAtualizado.patrimonio).padStart(6, '0')
    const acao = "Editou"
    const obs = `#${patrimonio} - ${itemAtualizado.item}`;

    criarLog(userSession, acao, obs)

}

async function deletarItem(id) {

    const response = await fetch(
        `${API_URL}teste?id=eq.${id}`,
        {
            method: 'DELETE',
            headers: {
                apikey: API_KEY,
                Authorization: `Bearer ${API_KEY}`
            }
        }
    );

    if (response.ok) {
        console.log('Item deletado');
    }

}

btnAction.addEventListener("click", () => {

    showModal({

        title: modalConfig.title,
        message: modalConfig.message,
        confirmText: modalConfig.confirmText,

        onConfirm: () => {
            dadosItem();
            bloquearBotoes();
            showToast({
                message: modalConfig.toast.message,
                type: modalConfig.toast.type,
            });
        },
        onCancel: () => {

            desbloquearBotoes();
        }
    });

})

function bloquearBotoes() {

    [
        buttonActionPage,
        buttonActionCancel
    ].forEach(btn => {

        btn.classList.add(
            'opacity-50',
            'pointer-events-none',
            'cursor-not-allowed'
        );

    });

}

function desbloquearBotoes() {

    [
        buttonActionPage,
        buttonActionCancel
    ].forEach(btn => {

        btn.classList.remove(
            'opacity-50',
            'pointer-events-none',
            'cursor-not-allowed'
        );

    });

}