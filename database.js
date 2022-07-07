import mysql from 'mysql2/promise';

const database = {};

database.con = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'tcc_yago',
    port: '3306'
})

database.con.connect();

database.getRelatos = async function(){
    let [rows, fields] = await database.con.execute('SELECT * FROM relato');
    
    return rows;
}

database.getRelatoSelecionado = async function(id){
    let [rows, fields] = await database.con.execute('SELECT * FROM relato WHERE id = ?', [id]);

    return rows;
}

database.insertRelato = async function(titulo, descricao, data, aplicativo, cidade, usuario){
    let [data] = await database.con.execute('INSERT INTO produtos (Titulo, Descricao, Data, fk_ID_Aplicativo, fk_ID_Cidade, fk_ID_Usuario) VALUES (?, ?, ?, ?, ?, ?)', 
    [titulo, descricao, data, aplicativo, cidade, usuario]);

    return {'numero': data.insertId}
}

database.deleteRelato = async function(id){
    let [data] = await database.con.execute('DELETE FROM relato WHERE id = ?', [id]);

    return {'deletado': id}
}

database.editRelato = async function(titulo, descricao, data, aplicativo, cidade, usuario, id){
    let [data] = await database.con.execute('UPDATE produtos SET Titulo = ?, Descricao = ?, Data = ?, fk_ID_Aplicativo = ?, fk_ID_Cidade = ?, fk_ID_Usuario = ?  WHERE id = ?', [titulo, descricao, data, aplicativo, cidade, usuario, id]);

    return {'alterado': id}
}

export default database;