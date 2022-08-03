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

database.getRelatos = async function () {
    let [rows, fields] = await database.con.execute('SELECT * FROM relato');

    return rows;
}

database.getRelatosImg = async function () {
    let [rows, fields] = await database.con.execute('SELECT r.*, GROUP_CONCAT(i.Nome_Imagem) AS imagens FROM imagem AS i RIGHT JOIN relato as r ON i.fk_ID_Relato = r.ID_Relato GROUP BY r.ID_Relato ORDER BY imagens desc');

    return rows;
}

database.getRelatoSelecionado = async function (id) {
    let [rows, fields] = await database.con.execute('SELECT * FROM relato WHERE ID_Relato = ?', [id]);

    return rows;
}

database.insertRelato = async function (titulo, descricao, dia, aplicativo, cidade, usuario, ilustrado) {
    let [data] = await database.con.execute('INSERT INTO relato (Titulo, Descricao, Data, fk_ID_Aplicativo, fk_ID_Cidade, fk_ID_Usuario, Ilustrado) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [titulo, descricao, dia, aplicativo, cidade, usuario, ilustrado]);

    return {
        'numero': data.insertId
    }
}

database.deleteRelato = async function (id) {
    let [data] = await database.con.execute('DELETE FROM relato WHERE id = ?', [id]);

    return {
        'deletado': id
    }
}

database.editRelato = async function (titulo, descricao, dia, aplicativo, cidade, usuario, id) {
    let [data] = await database.con.execute('UPDATE relato SET Titulo = ?, Descricao = ?, Data = ?, fk_ID_Aplicativo = ?, fk_ID_Cidade = ?, fk_ID_Usuario = ?  WHERE id = ?', [titulo, descricao, dia, aplicativo, cidade, usuario, id]);

    return {
        'alterado': id
    }
}

database.getAplicativos = async function () {
    let [rows, fields] = await database.con.execute('SELECT * FROM aplicativo');

    return rows;
}

database.getImagens = async function () {
    let [rows, fields] = await database.con.execute('SELECT * FROM imagem');

    return rows;
}

database.getImagensSelecionadas = async function (id) {
    let [rows, fields] = await database.con.execute('SELECT * FROM imagem WHERE fk_ID_Relato = ?', [id]);

    return rows;
}

database.getUsuarioSelecionado = async function (id) {
    let [rows, fields] = await database.con.execute('SELECT * FROM usuario WHERE ID_Usuario = ?', [id]);

    return rows;
}

database.cadastraUsuario = async function (id) {
    let [data] = await database.con.execute('INSERT INTO usuario (ID_Usuario) VALUES (?)', [id]);

    return {
        'numero': data.insertId
    }
}

database.cadastraCidade = async function (id, nome, estado) {
    let [data] = await database.con.execute('INSERT INTO cidade (ID_Cidade, Nome_Cidade, fk_ID_Estado) VALUES (?, ?, ?)', [id, nome, estado]);

    return {
        'numero': data.insertId
    }
}

database.cadastraImagem = async function (nome, relato) {
    let [data] = await database.con.execute('INSERT INTO imagem (Nome_Imagem, fk_ID_Relato) VALUES (?, ?)', [nome, relato]);

    return {
        'numero': data.insertId
    }
}

database.getCidadeSelecionada = async function (id) {
    let [rows, fields] = await database.con.execute('SELECT * FROM cidade WHERE ID_Cidade = ?', [id]);

    return rows;
}

export default database;