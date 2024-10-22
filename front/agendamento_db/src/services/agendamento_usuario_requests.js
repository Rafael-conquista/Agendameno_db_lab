export async function getEventosUsuario(id) {
    try {
        let response = await fetch(`http://127.0.0.1:5000/ordenar_eventos_usuario/${id}`)
        let result = await response.json();
        console.log(result);
        return result;
    }
    catch (e) {
        console.log(e);
        return [];
    }
}
