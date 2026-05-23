import { deslogaUser } from "../js/desloga.js";
import { criarLog } from "../js/log.js";

let timeoutInatividade;

const userSession = JSON.parse(sessionStorage.getItem("user"));

export function resetarTimer(){

    clearTimeout(timeoutInatividade);

    timeoutInatividade = setTimeout(() => {

        logout();

    }, 1000 * 60 * 1);

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

function logout(){

  const acao = "Deslogado";
  const obs = "usuario inativo"
  
  await deslogaUser(userSession.id)
  await criarLog(userSession, acao, obs);

}

resetarTimer();