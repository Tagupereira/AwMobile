import { deslogaUser } from "../js/desloga.js";
import { criarLog } from "../js/log.js";
import { navegar } from "../js/router.js";

let timeoutInatividade;

const userSession = JSON.parse(sessionStorage.getItem("user"));

export function resetarTimer(){

    clearTimeout(timeoutInatividade);

    timeoutInatividade = setTimeout(() => {

        logout();

    }, 1000 * 60 * 15);

    // 15 minutos

}

[
  'click',
  'mousemove',
  'keydown',
  'scroll',
  'touchstart'
].forEach(evento => {

    window.addEventListener(
      evento,
      resetarTimer
    );

});

async function logout(){

  const acao = "Deslogado";
  const obs = "usuario inativo"
  
  await deslogaUser(userSession.id);
  await criarLog(userSession, acao, obs);
  navegar('index.html');
  sessionStorage.clear();

}

resetarTimer();