CREATE TABLE Equipe (
    IdEquipe INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    Nome VARCHAR(100) NOT NULL,
    Ativo BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE Cargo (
    IdCargo INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    Nome VARCHAR(100) NOT NULL,
    EnumPermissao INT DEFAULT 0
);

CREATE TABLE Sala (
    IdSala INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    Nome VARCHAR(100) NOT NULL,
    Bloco VARCHAR(50) NOT NULL,
    Andar VARCHAR(10) NOT NULL
);

CREATE TABLE EventoExcluido (
    IdEventoExcluido INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    DescExcluido VARCHAR(300),
    DataExcluido Date NOT NULL
);

CREATE TABLE Usuario (
    IdUsuario INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    IdCargo INT NOT NULL,
    IdEquipe INT NOT NULL,
    Nome VARCHAR(100) NOT NULL,
    Telefone VARCHAR(15),
    Email VARCHAR(100) UNIQUE NOT NULL,
    Senha VARCHAR(100) NOT NULL,
    Ativo BOOLEAN NOT NULL DEFAULT TRUE,
    FOREIGN KEY (IdCargo) REFERENCES Cargo(IdCargo),
    FOREIGN KEY (IdEquipe) REFERENCES Equipe(IdEquipe)
);

CREATE TABLE Agendamento (
    IdAgendamento INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    IdUsuario INT NOT NULL,
    DataInicio Date NOT NULL,
    DataFinal Date NOT NULL,
    FOREIGN KEY (IdUsuario) REFERENCES Usuario(IdUsuario)
);

CREATE TABLE Convida (
    IdConvida INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    IdUsuario INT NOT NULL,
    Importante BOOLEAN DEFAULT FALSE NOT NULL,
    Aceito BOOLEAN DEFAULT FALSE NOT NULL,
    FOREIGN KEY (IdUsuario) REFERENCES Usuario(IdUsuario)
);

CREATE TABLE Evento (
    IdEvento INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    IdSala INT NOT NULL,
    IdEventoExcluido INT NOT NULL,
    idAgendamento INT NOT NULL,
    Nome VARCHAR(100) NOT NULL,
    Interno BOOLEAN DEFAULT FALSE NOT NULL,
    Descricao VARCHAR(300),
    FOREIGN KEY (IdSala) REFERENCES Sala(IdSala),
    FOREIGN KEY (IdEventoExcluido) REFERENCES EventoExcluido(IdEventoExcluido),
    FOREIGN KEY (IdAgendamento) REFERENCES Agendamento(IdAgendamento)
);


