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
        const user = data[0].user;

        sessionStorage.setItem("user", user);
        window.location.href = "../dashboard.html";
        
        
    } else {
        erro.innerText = "Login ou senha inválidos";
    }

    } catch (e) {
    erro.innerText = "Erro ao conectar";
    }
}