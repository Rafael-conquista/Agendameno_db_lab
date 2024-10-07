
export async function getEquipes() {
    try {
        let response = await fetch('http://127.0.0.1:5000/equipes')
        let result = await response.json();
        return result;
    }
    catch (e) {
        console.log(e);
        return [];
    }
}
  
  
export async function getEquipeById(id) {
    try {
        let response = await fetch(`http://127.0.0.1:5000/equipe/${id}`)
        let result = await response.json();
        return result;
    }
    catch (e) {
        console.log(e);
        return [];
    }
}
  
export async function updateEquipeById(id,nome,ativo) {
    try{
        var myHeaders = new Headers();
        myHeaders.set("Content-Type", "application/json");
    
        var raw = JSON.stringify({
          "nome": nome,
          "ativo": ativo,
        });
        var requestOptions = {
          method: 'PUT',
          headers: myHeaders,
          body: raw,
          redirect: 'follow'
        };
      
        let response = await fetch(`http://127.0.0.1:5000/equipe/${id}`, requestOptions)
        return response.json()
    } catch(e){
          console.log(e)
        return false
    }
}

export async function cadastrarEquipeById(nome) {
    try{
        var myHeaders = new Headers();
        myHeaders.set("Content-Type", "application/json");
    
        var raw = JSON.stringify({
          "nome": nome,
          "ativo": 1,
        });
        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw,
          redirect: 'follow'
        };
      
        let response = await fetch(`http://127.0.0.1:5000/equipe`, requestOptions)
        return response.json()
    } catch(e){
          console.log(e)
        return false
    }
}
