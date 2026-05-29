import { API_URL, API_KEY } from "../config.js" ;
import { deslogaUser } from "../js/desloga.js";
import { criarLog } from "../js/log.js";
import { showToast } from "../js/toast.js";
import { navegar } from '../js/router.js';

const userSession = JSON.parse(sessionStorage.getItem("user"));

if(userSession){    
    await deslogaUser(userSession.id);
    await criarLog(userSession, "Deslogou")
    console.log("tem session");
    showToast("Deslogando","warning")
}

sessionStorage.clear();

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
       //console.log(data);
       const user = data[0];

       userStatus(user.id)

    } else {
        erro.innerText = "Login ou senha inválidos";
    }

    } catch (e) {
        erro.innerText = "Erro ao conectar";
    }
}

async function userStatus(dataId) {
        
    const status = {
        status: 1
    }

    const response = await fetch(
    `${API_URL}acesso?id=eq.${dataId}`,
    {
        method: 'PATCH',
        headers: {
        apikey: API_KEY,
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation'
        },
        body: JSON.stringify(status)
    }
    );

    const data = await response.json();

    console.log(data);
    const user = data[0];
    const acao = "Entrou";
    const obs = `${getDevice()} - ${getBrowser()}`;
    criarLog(user, acao, obs);

    const { password, ...userSafe } = data[0];

    sessionStorage.setItem("user", JSON.stringify(userSafe));
    navegar('dashboard.html');
}

////////////////////////////////////////////////////////////////////////

function getDevice(){

   const ua =
   navigator.userAgent;

   if(/iPhone/i.test(ua))
      return "iPhone";

   if(/iPad/i.test(ua))
      return "iPad";

   if(/Android/i.test(ua))
      return "Android";

   return "Desktop";

}

function getBrowser(){

   const ua =
   navigator.userAgent;

   if(ua.includes("Chrome"))
      return "Chrome";

   if(ua.includes("Firefox"))
      return "Firefox";

   if(ua.includes("Safari"))
      return "Safari";

   return "Outro";

}

getDevice()
getBrowser()


///////////////////////////////////////////////////////////////////////