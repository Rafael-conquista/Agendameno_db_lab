
export async function getSalas() {
    try {
        let response = await fetch('http://127.0.0.1:5000/salas')
        let result = await response.json();
        return result;
    }
    catch (e) {
        console.log(e);
        return [];
    }
}
