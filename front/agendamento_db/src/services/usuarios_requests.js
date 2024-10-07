
export async function getUsuarios() {
    try {
        let response = await fetch('http://127.0.0.1:5000/users')
        let result = await response.json();
        return result;
    }
    catch (e) {
        console.log(e);
        return [];
    }
}
