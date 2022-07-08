/* Lógico_1: */

CREATE TABLE Usuario (
    ID_Usuario varchar(50) NOT NULL PRIMARY KEY
);

CREATE TABLE Relato (
    ID_Relato int(5) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    Descricao varchar(750) NOT NULL,
    Titulo varchar(50) NOT NULL,
    Data DATE,
    fk_ID_Aplicativo int(5) NOT NULL,
    fk_ID_Cidade int(10) NOT NULL,
    fk_ID_Usuario varchar(50) NOT NULL
);

CREATE TABLE Aplicativo (
    ID_Aplicativo int(5) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    Nome_Aplicativo varchar(75) NOT NULL
);

CREATE TABLE Cidade (
    ID_Cidade int(10) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    Nome_Cidade varchar(120) NOT NULL,
    fk_ID_Estado int(5) NOT NULL
);

CREATE TABLE Estado (
    ID_Estado int(5) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    Nome_Estado varchar(75) NOT NULL,
    UF varchar(5) NOT NULL
);

CREATE TABLE Imagem (
    ID_Imagem int(5) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    Nome_Imagem varchar(260) NOT NULL,
    fk_ID_Relato int(5) NOT NULL
);
 
ALTER TABLE Relato ADD CONSTRAINT FK_Relato_2
    FOREIGN KEY (fk_ID_Usuario)
    REFERENCES Usuario (ID_Usuario)
    ON DELETE CASCADE;
 
ALTER TABLE Relato ADD CONSTRAINT FK_Relato_3
    FOREIGN KEY (fk_ID_Aplicativo)
    REFERENCES Aplicativo (ID_Aplicativo);
 
ALTER TABLE Relato ADD CONSTRAINT FK_Relato_4
    FOREIGN KEY (fk_ID_Cidade)
    REFERENCES Cidade (ID_Cidade);
 
ALTER TABLE Cidade ADD CONSTRAINT FK_Cidade_2
    FOREIGN KEY (fk_ID_Estado)
    REFERENCES Estado (ID_Estado);
 
ALTER TABLE Imagem ADD CONSTRAINT FK_Imagem_2
    FOREIGN KEY (fk_ID_Relato)
    REFERENCES Relato (ID_Relato);
	
INSERT INTO `aplicativo` (`ID_Aplicativo`, `Nome_Aplicativo`) VALUES (NULL, 'Whatsapp'), (NULL, 'Facebook'), (NULL, 'Instagram'), (NULL, 'Twitter'), (NULL, 'Email'), (NULL, 'Compras Online'), (NULL, 'Outros');

INSERT INTO `estado` (`ID_Estado`, `Nome_Estado`, `UF`) VALUES
(12, 'Acre', 'AC'),
(27, 'Alagoas', 'AL'),
(13, 'Amazonas', 'AM'),
(16, 'Amapá', 'AP'),
(29, 'Bahia', 'BA'),
(23, 'Ceará', 'CE'),
(53, 'Distrito Federal', 'DF'),
(32, 'Espírito Santo', 'ES'),
(52, 'Goiás', 'GO'),
(21, 'Maranhão', 'MA'),
(31, 'Minas Gerais', 'MG'),
(50, 'Mato Grosso do Sul', 'MS'),
(51, 'Mato Grosso', 'MT'),
(15, 'Pará', 'PA'),
(25, 'Paraíba', 'PB'),
(26, 'Pernambuco', 'PE'),
(22, 'Piauí', 'PI'),
(41, 'Paraná', 'PR'),
(33, 'Rio de Janeiro', 'RJ'),
(24, 'Rio Grande do Norte', 'RN'),
(11, 'Rondônia', 'RO'),
(14, 'Roraima', 'RR'),
(43, 'Rio Grande do Sul', 'RS'),
(42, 'Santa Catarina', 'SC'),
(28, 'Sergipe', 'SE'),
(35, 'São Paulo', 'SP'),
(17, 'Tocantins', 'TO');