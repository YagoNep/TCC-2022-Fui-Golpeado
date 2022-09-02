-- --------------------------------------------------------
-- Servidor:                     ec2-3-83-232-79.compute-1.amazonaws.com
-- Versão do servidor:           5.5.68-MariaDB - MariaDB Server
-- OS do Servidor:               Linux
-- HeidiSQL Versão:              12.1.0.6537
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Copiando estrutura do banco de dados para tcc_yago
CREATE DATABASE IF NOT EXISTS `tcc_yago` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `tcc_yago`;

-- Copiando estrutura para tabela tcc_yago.aplicativo
CREATE TABLE IF NOT EXISTS `aplicativo` (
  `ID_Aplicativo` int(5) NOT NULL AUTO_INCREMENT,
  `Nome_Aplicativo` varchar(75) NOT NULL,
  PRIMARY KEY (`ID_Aplicativo`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;

-- Copiando dados para a tabela tcc_yago.aplicativo: ~7 rows (aproximadamente)
INSERT INTO `aplicativo` (`ID_Aplicativo`, `Nome_Aplicativo`) VALUES
	(1, 'Whatsapp'),
	(2, 'Facebook'),
	(3, 'Instagram'),
	(4, 'Twitter'),
	(5, 'Email'),
	(6, 'Compras Online'),
	(7, 'Outros');

-- Copiando estrutura para tabela tcc_yago.cidade
CREATE TABLE IF NOT EXISTS `cidade` (
  `ID_Cidade` int(10) NOT NULL AUTO_INCREMENT,
  `Nome_Cidade` varchar(120) NOT NULL,
  `fk_ID_Estado` int(5) NOT NULL,
  PRIMARY KEY (`ID_Cidade`),
  KEY `FK_Cidade_2` (`fk_ID_Estado`),
  CONSTRAINT `FK_Cidade_2` FOREIGN KEY (`fk_ID_Estado`) REFERENCES `estado` (`ID_Estado`)
) ENGINE=InnoDB AUTO_INCREMENT=4207651 DEFAULT CHARSET=utf8;

-- Copiando estrutura para tabela tcc_yago.estado
CREATE TABLE IF NOT EXISTS `estado` (
  `ID_Estado` int(5) NOT NULL AUTO_INCREMENT,
  `Nome_Estado` varchar(75) NOT NULL,
  `UF` varchar(5) NOT NULL,
  PRIMARY KEY (`ID_Estado`)
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8;

-- Copiando dados para a tabela tcc_yago.estado: ~27 rows (aproximadamente)
INSERT INTO `estado` (`ID_Estado`, `Nome_Estado`, `UF`) VALUES
	(11, 'Rondônia', 'RO'),
	(12, 'Acre', 'AC'),
	(13, 'Amazonas', 'AM'),
	(14, 'Roraima', 'RR'),
	(15, 'Pará', 'PA'),
	(16, 'Amapá', 'AP'),
	(17, 'Tocantins', 'TO'),
	(21, 'Maranhão', 'MA'),
	(22, 'Piauí', 'PI'),
	(23, 'Ceará', 'CE'),
	(24, 'Rio Grande do Norte', 'RN'),
	(25, 'Paraíba', 'PB'),
	(26, 'Pernambuco', 'PE'),
	(27, 'Alagoas', 'AL'),
	(28, 'Sergipe', 'SE'),
	(29, 'Bahia', 'BA'),
	(31, 'Minas Gerais', 'MG'),
	(32, 'Espírito Santo', 'ES'),
	(33, 'Rio de Janeiro', 'RJ'),
	(35, 'São Paulo', 'SP'),
	(41, 'Paraná', 'PR'),
	(42, 'Santa Catarina', 'SC'),
	(43, 'Rio Grande do Sul', 'RS'),
	(50, 'Mato Grosso do Sul', 'MS'),
	(51, 'Mato Grosso', 'MT'),
	(52, 'Goiás', 'GO'),
	(53, 'Distrito Federal', 'DF');

-- Copiando estrutura para tabela tcc_yago.imagem
CREATE TABLE IF NOT EXISTS `imagem` (
  `ID_Imagem` int(5) NOT NULL AUTO_INCREMENT,
  `Nome_Imagem` varchar(260) NOT NULL,
  `fk_ID_Relato` int(5) NOT NULL,
  PRIMARY KEY (`ID_Imagem`),
  KEY `FK_Imagem_2` (`fk_ID_Relato`),
  CONSTRAINT `FK_Imagem_2` FOREIGN KEY (`fk_ID_Relato`) REFERENCES `relato` (`ID_Relato`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

-- Copiando estrutura para tabela tcc_yago.permissao
CREATE TABLE IF NOT EXISTS `permissao` (
  `ID_Permissao` int(11) NOT NULL AUTO_INCREMENT,
  `Nome_Permissao` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`ID_Permissao`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- Copiando dados para a tabela tcc_yago.permissao: ~2 rows (aproximadamente)
INSERT INTO `permissao` (`ID_Permissao`, `Nome_Permissao`) VALUES
	(1, 'user'),
	(2, 'admin');

-- Copiando estrutura para tabela tcc_yago.relato
CREATE TABLE IF NOT EXISTS `relato` (
  `ID_Relato` int(5) NOT NULL AUTO_INCREMENT,
  `Descricao` varchar(750) NOT NULL,
  `Titulo` varchar(50) NOT NULL,
  `Data` date DEFAULT NULL,
  `fk_ID_Aplicativo` int(5) NOT NULL,
  `fk_ID_Cidade` int(10) NOT NULL,
  `fk_ID_Usuario` varchar(50) NOT NULL,
  PRIMARY KEY (`ID_Relato`),
  KEY `FK_Relato_2` (`fk_ID_Usuario`),
  KEY `FK_Relato_3` (`fk_ID_Aplicativo`),
  KEY `FK_Relato_4` (`fk_ID_Cidade`),
  CONSTRAINT `FK_Relato_4` FOREIGN KEY (`fk_ID_Cidade`) REFERENCES `cidade` (`ID_Cidade`),
  CONSTRAINT `FK_Relato_2` FOREIGN KEY (`fk_ID_Usuario`) REFERENCES `usuario` (`ID_Usuario`) ON DELETE CASCADE,
  CONSTRAINT `FK_Relato_3` FOREIGN KEY (`fk_ID_Aplicativo`) REFERENCES `aplicativo` (`ID_Aplicativo`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

-- Copiando estrutura para tabela tcc_yago.usuario
CREATE TABLE IF NOT EXISTS `usuario` (
  `ID_Usuario` varchar(50) NOT NULL,
  `fk_ID_Permissao` int(11) DEFAULT NULL,
  PRIMARY KEY (`ID_Usuario`),
  KEY `fk_ID_Permissao` (`fk_ID_Permissao`),
  CONSTRAINT `FK_Permissao2` FOREIGN KEY (`fk_ID_Permissao`) REFERENCES `permissao` (`ID_Permissao`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Copiando dados para a tabela tcc_yago.usuario: ~3 rows (aproximadamente)
INSERT INTO `usuario` (`ID_Usuario`, `fk_ID_Permissao`) VALUES
	('113860311129940378030', 2);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
