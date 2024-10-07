export async function postEventos(idUsuario, dataInicio, dataFinal, importante, nome, descricao, interno, idSala, convidados) {
    try {
        var myHeaders = new Headers();
        myHeaders.set("Content-Type", "application/json");

        const formatDateWithSeconds = (dateString) => {
            return `${dateString}:00`;
        };

        var raw = JSON.stringify({
          "id_usuario": idUsuario,
          "data_inicio": formatDateWithSeconds(dataInicio),
          "data_final": formatDateWithSeconds(dataFinal),
          "importante": importante,
          "nome": nome,
          "descricao": descricao,
          "interno": interno,
          "id_sala": idSala,
          "ids_convidados": convidados
        });
        
        console.log(raw);
        
        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw,
          redirect: 'follow'
        };
      
        let response = await fetch(`http://127.0.0.1:5000/evento`, requestOptions);
        return response.json();
    } catch (e) {
        console.log(e);
        return false;
    }
}
