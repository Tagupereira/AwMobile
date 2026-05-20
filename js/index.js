import { API_URL, API_KEY } from "../config.js" ;
    
const dev = document.getElementById("dev");

dev.addEventListener("click",()=>{
    window.open(
    "https://www.instagram.com/tagu.designer",
    "_blank"
);
})

document.getElementById('btn-login').addEventListener('click', login);

async function login() {

    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const erro = document.getElementById('erro');

    erro.innerText = "";

    try {
    const res = await fetch(
        `${API_URL}acesso?user=eq.${email}&password=eq.${senha}`,
        {
            headers: {
                "apikey": API_KEY,
                "Authorization": "Bearer "+API_KEY
            }
        }
    );

    const data = await res.json();

    if (data.length > 0) {
        // LOGIN OK → só redireciona
       console.log(data);
        
        const user = data[0];

        sessionStorage.setItem("user", JSON.stringify(user));
        if(user.id_tipoAcesso == 1){
            
            window.location.href = "../dashboard.html";
            return
        }
        if(user.id_tipoAcesso == 2){
            window.location.href = "../dashboard.html";
            //window.location.href = "../view_equipment.html";
            return
        }
        if(user.id_tipoAcesso == 3){
            window.location.href = "../cadastro.html";
            return
        }

        
        
    } else {
        erro.innerText = "Login ou senha inválidos";
    }

    } catch (e) {
    erro.innerText = "Erro ao conectar";
    }
}