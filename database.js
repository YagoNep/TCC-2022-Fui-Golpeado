import mysql from 'mysql2/promise';

const database = {};

database.con = await mysql.createConnection({
    host: 'localhost',
    user: 'yago',
    password: '123456',
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
    let [rows, fields] = await database.con.execute('SELECT r.*, GROUP_CONCAT(i.Nome_Imagem) AS imagens, c.Nome_Cidade, app.Nome_Aplicativo, e.UF FROM imagem AS i RIGHT JOIN relato AS r ON i.fk_ID_Relato = r.ID_Relato INNER JOIN aplicativo AS app ON r.fk_ID_Aplicativo = app.ID_Aplicativo INNER JOIN cidade AS c ON r.fk_ID_Cidade = c.ID_Cidade INNER JOIN estado AS e ON c.fk_ID_Estado = e.ID_Estado WHERE r.ID_Relato = ?', [id]);

    return rows;
}

database.getRelatoEditando = async function (id) {
    let [rows, fields] = await database.con.execute('SELECT r.*, GROUP_CONCAT(i.Nome_Imagem) AS imagens, GROUP_CONCAT(i.ID_Imagem) AS idImg, c.Nome_Cidade, app.Nome_Aplicativo, e.UF FROM imagem AS i RIGHT JOIN relato AS r ON i.fk_ID_Relato = r.ID_Relato INNER JOIN aplicativo AS app ON r.fk_ID_Aplicativo = app.ID_Aplicativo INNER JOIN cidade AS c ON r.fk_ID_Cidade = c.ID_Cidade INNER JOIN estado AS e ON c.fk_ID_Estado = e.ID_Estado WHERE r.ID_Relato = ?', [id]);

    return rows;
}

database.getRelatosPerfil = async function (id) {
    let [rows, fields] = await database.con.execute('SELECT r.*, GROUP_CONCAT(i.Nome_Imagem) AS imagens FROM imagem AS i RIGHT JOIN relato as r ON i.fk_ID_Relato = r.ID_Relato WHERE r.fk_ID_Usuario = ? GROUP BY r.ID_Relato ORDER BY imagens desc;', [id]);

    return rows;
}

database.getRelatosFiltrados = async function (filtro) {
    let [rows, fields] = await database.con.execute('SELECT r.*, GROUP_CONCAT(i.Nome_Imagem) AS imagens FROM imagem AS i RIGHT JOIN relato as r ON i.fk_ID_Relato = r.ID_Relato WHERE r.Descricao LIKE CONCAT("%", ?,  "%") OR r.Titulo LIKE CONCAT("%", "' + filtro +  '",  "%") GROUP BY r.ID_Relato ORDER BY imagens desc;', [filtro]);

    return rows;
}

database.getRelatosFiltradosApp = async function (filtro) {
    let [rows, fields] = await database.con.execute('SELECT r.*, GROUP_CONCAT(i.Nome_Imagem) AS imagens FROM imagem AS i RIGHT JOIN relato as r ON i.fk_ID_Relato = r.ID_Relato WHERE r.fk_ID_Aplicativo = ? GROUP BY r.ID_Relato ORDER BY imagens desc;', [filtro]);

    return rows;
}

database.insertRelato = async function (titulo, descricao, dia, aplicativo, cidade, usuario) {
    let [data] = await database.con.execute('INSERT INTO relato (Titulo, Descricao, Data, fk_ID_Aplicativo, fk_ID_Cidade, fk_ID_Usuario) VALUES (?, ?, ?, ?, ?, ?)',
        [titulo, descricao, dia, aplicativo, cidade, usuario]);

    return {
        'numero': data.insertId
    }
}

database.deleteImagensRelato = async function (id) {
    let [data] = await database.con.execute('DELETE FROM imagem WHERE fk_ID_Relato = ?', [id]);

    return {
        'deletado': id
    }
}

database.deleteImagemSelecionada = async function (id) {
    let [data] = await database.con.execute('DELETE FROM imagem WHERE ID_Imagem = ?', [id]);

    return {
        'deletado': id
    }
}

database.deleteRelato = async function (id) {
    let [data] = await database.con.execute('DELETE FROM relato WHERE ID_Relato = ?', [id]);

    return {
        'deletado': id
    }
}

database.editRelato = async function (titulo, descricao, dia, aplicativo, cidade, usuario, id) {
    let [data] = await database.con.execute('UPDATE relato SET Titulo = ?, Descricao = ?, Data = ?, fk_ID_Aplicativo = ?, fk_ID_Cidade = ?, fk_ID_Usuario = ?  WHERE ID_Relato = ?', [titulo, descricao, dia, aplicativo, cidade, usuario, id]);

    return {
        'numero': id
    }
}

database.getAplicativos = async function () {
    let [rows, fields] = await database.con.execute('SELECT * FROM aplicativo');

    return rows;
}

database.getAplicativoSelecionado = async function (id) {
    let [rows, fields] = await database.con.execute('SELECT * FROM aplicativo WHERE ID_Aplicativo = ?', [id]);

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

database.getContagemCidadess = async function () {
    let [rows, fields] = await database.con.execute('SELECT cidade.Nome_Cidade, e.UF, count(relato.fk_ID_Cidade) as contagem from cidade left join relato on (cidade.ID_Cidade = relato.fk_ID_Cidade) INNER JOIN estado as e ON cidade.fk_ID_Estado = e.ID_Estado group by cidade.ID_Cidade ORDER BY count(relato.fk_ID_Cidade) DESC LIMIT 5');

    return rows;
}

database.cadastraUsuario = async function (id) {
    let [data] = await database.con.execute('INSERT INTO usuario (ID_Usuario, fk_ID_Permissao) VALUES (?, ?)', [id, 1]);

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
