import { API_URL, API_KEY } from "../config.js" ;
import { showToast } from "../js/toast.js";

export async function deslogaUser(id) {

    const status = {
        status: 0
    }

    const response = await fetch(
    `${API_URL}acesso?id=eq.${id}`,
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

    const msg = "Deslogado por inatividade";
    const color = "warning";
    showToast({
        message: msg,
        type: color
    });
    
}