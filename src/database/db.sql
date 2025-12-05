create database cs_copacabana;
use cs_copacabana;

create table if not exists persona(
	id int auto_increment primary key,
    ci varchar(20) not null unique,
    nombre varchar(50) not null,
    materno varchar(50),
    paterno varchar(50),
    nacionalidad varchar(30) not null,
    estado_civil varchar(20) not null,
    nro_telf varchar(15) null,
    sexo enum('MASCULINO', 'FEMENINO', 'OTRO') not null,
    fecha_nacimiento date not null
);
insert into persona(ci, nombre, paterno, materno, nacionalidad, estado_civil, nro_telf, sexo, fecha_nacimiento) 
values("12796720", "JOSE LUIS", "CONDORI", "CHAMBI", "BOLIVIANO", "SOLTERO", "73047440", "MASCULINO", "2000-03-12");

create table if not exists carpeta(
	id int auto_increment primary key,
    nombre_carpeta varchar(50) not null
);
insert into carpeta(nombre_carpeta)values("CH-2");

create table if not exists microred(
	codigo int primary key,
    id_director int null,
    nombre_microred varchar(50) not null,
    red varchar(50) not null,
    fecha_creacion datetime not null,
    estado_microred TINYINT NOT NULL DEFAULT 1
);
insert into microred(codigo, nombre_microred, red, fecha_creacion) values(200804,'COPACABABA', 'COREA', '2025-11-11');
select * from microred;
create table if not exists paciente(
	id int auto_increment primary key,
    id_persona int not null,
    id_carpeta int null,
    id_microred int null,
	tipo_sangre enum('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'),
    estatura varchar(10) null,
    peso varchar(10) null,
    estado_paciente TINYINT NOT NULL DEFAULT 1,
    fecha_creacion datetime not null,
    foreign key (id_microred) references microred(codigo),
    constraint fk_persona_paciente
		foreign key (id_persona) references persona(id) on delete cascade,
	constraint fk_carpeta_paciente
		foreign key (id_carpeta) references carpeta(id) on delete cascade
);

create table if not exists profesion (
    id int auto_increment primary key,
    nombre_profesion varchar(100) not null unique
);
insert into profesion(nombre_profesion) values('NO PROFESIONAL');

create table if not exists area_trabajo (
    id int auto_increment primary key,
    nombre_area varchar(100) not null unique
);
insert into area_trabajo(nombre_area) 
values ('ADMINISTRACIÓN'),('DIRECCIÓN'),('MEDICINA GENERAL'), ('ODONTOLOGIA'), ('ECOGRAFIA'), 
	('LABORATORIO'), ('ENFERMERIA'), ('ADMISION'), ('FARMACIA');
select * from area_trabajo;
create table if not exists personal(
	id int auto_increment primary key,
    id_persona int not null,
    id_profesion int null,
    id_area int not null,
	id_microred int null,
    cargo varchar(50) not null,
    nro_matricula varchar(20) unique null,
    fecha_ingreso date null,
    fecha_creacion datetime not null,
    estado_personal TINYINT NOT NULL DEFAULT 1,
    foreign key(id_persona) references persona(id),
    foreign key(id_profesion) references profesion(id),
    foreign key(id_area) references area_trabajo(id),
    foreign key(id_microred) references microred(codigo)
);
insert into personal(id_persona, id_profesion, id_area, id_microred, cargo, fecha_ingreso, fecha_creacion) 
values(1,1,1,200804, 'INFORMATICO', '2024-08-01', '2025-11-12');
update microred set id_director=1 where codigo=200804;
select * from microred;
ALTER TABLE microred
ADD CONSTRAINT fk_microred_director
FOREIGN KEY (id_director) REFERENCES personal(id);

create table if not exists usuario(
	id int auto_increment primary key,
    nombre_usuario varchar(100) unique not null,
    clave varchar(255) unique not null,
    perfil varchar(255) null,
    estado_usuario TINYINT NOT NULL DEFAULT 1,
    fecha_creacion datetime not null,
    id_personal int null,
    constraint fk_personal_usuario
		foreign key (id_personal) references personal(id) on delete cascade
);

create table if not exists rol(
	id int auto_increment primary key,
    nombre_rol varchar(50) not null
);
insert into rol(nombre_rol) values('DIRECTOR'),('PERSONAL MEDICO'),('PERSONAL OPERATIVO');
 
create table if not exists direccion(
	id int auto_increment primary key not null,
    departamento varchar(20) not null,
    municipio varchar(20) not null,
    zona varchar(50) not null,
    av_calle varchar(50) not null
);
insert into direccion(departamento, municipio, zona, av_calle)
values('LA PAZ', 'EL ALTO', 'VILLA COPACABANA', 'AVENIDA ILLIMANI');

create table if not exists domicilio(
	id int primary key, 
	nro_puerta int null,
    id_persona int,
	foreign key(id) references direccion(id) on delete cascade,
	foreign key(id_persona) references persona(id) on delete cascade
);

insert into direccion(departamento, municipio, zona, av_calle)
values('LA PAZ', 'EL ALTO', 'NUEVOS HORIZONTES', 'CALLE D-3');

insert into domicilio(id, id_persona, nro_puerta)
values(4, 1, '763');

create table if not exists establecimiento(
	id int primary key auto_increment,
    nombre_establecimiento varchar(50) not null,
    estado_establecimiento TINYINT NOT NULL DEFAULT 1,
    tipo_establecimiento VARCHAR(50) not null,
    fecha_creacion datetime not null,
    id_microred int,
    constraint fk_establecimiento_direccion
        foreign key (id) references direccion(id)
        on delete cascade,
	constraint fk_establecimiento_microred
        foreign key (id_microred) references microred(codigo)
        on delete cascade
);
insert into establecimiento(nombre_establecimiento, tipo_establecimiento, fecha_creacion, id_microred) 
values('COPACABANA', 'CENTRO DE SALUD', '2025-11-12', 200804);

create table if not exists usuario_rol(
	id int auto_increment primary key,
    id_rol int not null,
    id_usuario int not null,
    id_establecimiento int null,
    fecha_creacion datetime,
    estado_usuario_rol TINYINT NOT NULL DEFAULT 1,
    foreign key(id_establecimiento) references establecimiento(id),
	foreign key (id_usuario) references usuario(id) on delete cascade,
	foreign key (id_rol) references rol(id) on delete cascade
);

insert into usuario_rol(id_rol, id_usuario, fecha_creacion)
values(1, 1,'2025-11-12'), (2,1,'2025-11-12'), (3, 1, '2025-11-12');

create table if not exists diagnostico(
	id int primary key auto_increment,
    nombre_diagnostico varchar(50) not null,
    descripcion varchar(255) null
);

create table if not exists medicamento(
	id int primary key auto_increment,
    nombre_medicamento varchar(50) not null
);

create table if not exists receta(
	id int primary key auto_increment,
    fecha_emision datetime not null
);


create table if not exists receta_detalle(
	id int primary key auto_increment,
    id_medicamento int,
    id_receta int,
    indicacion varchar(100) null,
    presentacion varchar(50) null,
    cantidad_recetada int,
    cantidad_dispensada int,
    foreign key (id_medicamento) references medicamento(id),
    foreign key (id_receta) references receta(id)
);

create table if not exists atencion(
	id int primary key auto_increment,
    id_usuario_rol_atencion int not null,
    id_usuario_rol_diagnostico int null,
    id_usuario_rol_farmacia int null,
    id_paciente int not null,
    id_area int not null,
    id_diagnostico int null,
    id_receta int null,
    estado_atencion varchar(20) not null,
    fecha_atencion datetime not null,
    turno enum('MAÑANA', 'TARDE'),
    foreign key(id_usuario_rol_atencion) references usuario_rol(id),
    FOREIGN KEY(id_usuario_rol_diagnostico) REFERENCES usuario_rol(id),
    FOREIGN KEY(id_usuario_rol_farmacia) REFERENCES usuario_rol(id),
	foreign key(id_paciente) references paciente(id),
    foreign key(id_area) references area_trabajo(id),
    foreign key(id_diagnostico) references diagnostico(id),
    foreign key(id_receta) references receta(id)
);


create table if not exists registro_log(
	id int primary key auto_increment,
    id_usuario_rol int not null,
    fecha_log datetime not null,
    foreign key(id_usuario_rol) references usuario_rol(id)
);
use cs_copacabana;
SET SQL_SAFE_UPDATES = 0;
DELETE FROM usuario;
SET SQL_SAFE_UPDATES = 1;
use cs_copacabana;
select * from receta;
select * from atencion;
select * from carpeta;
select * from paciente;
select * from area_trabajo;
select * from profesion;
select * from rol;
select * from registro_log;
select * from personal;
select time(fecha_creacion) from usuario;
select * from establecimiento;
select * from microred;
select * from usuario_rol;
insert into usuario_rol(id_rol, id_usuario) values(3,1);
select * from persona;
select * from carpeta;
select * from receta_detalle;
select * from diagnostico;

#funca
select xat.id, xdi.nombre_diagnostico, xdi.id as id_diagnostico, xre.id as id_diagnostico, xrd.id
from atencion xat, diagnostico xdi, receta xre, receta_detalle xrd
where 
	xat.id=1 and xat.id_diagnostico=xdi.id and xat.id_receta=xre.id and xrd.id_receta=xre.id; 
    
    
select xat.id, xdi.nombre_diagnostico, xdi.id as id_diagnostico, xre.id as id_receta, xrd.id, xme.id as id_medicamento, xme.nombre_medicamento
from atencion xat, diagnostico xdi, receta xre, receta_detalle xrd, medicamento xme
where 
	xat.id=1 and xat.id_diagnostico=xdi.id and xat.id_receta=xre.id and xrd.id_receta=xre.id and xrd.id_medicamento=xme.id; 
    
    
SELECT 
  xat.id                       AS id_atencion,
  xat.estado_atencion,
  xat.fecha_atencion,
  xat.id_usuario_rol_diagnostico,
  xat.id_usuario_rol_atencion,
  xat.id_usuario_rol_farmacia,
  xdi.id                       AS id_diagnostico,
  xdi.nombre_diagnostico,
  xdi.descripcion,

  xre.id                       AS id_receta,
  xre.fecha_emision,

  xrd.id                       AS id_receta_detalle,
  xrd.indicacion,
  xrd.presentacion,
  xrd.cantidad_recetada,
  xrd.cantidad_dispensada,

  xme.id                       AS id_medicamento,
  xme.nombre_medicamento

FROM atencion xat
LEFT JOIN diagnostico xdi 
  ON xat.id_diagnostico = xdi.id

LEFT JOIN receta xre 
  ON xat.id_receta = xre.id

LEFT JOIN receta_detalle xrd 
  ON xrd.id_receta = xre.id

LEFT JOIN medicamento xme 
  ON xrd.id_medicamento = xme.id

WHERE xat.id = 4;
use cs_copacabana;

SELECT 
(
  SELECT CONCAT(xpe.nombre, ' ', xpe.paterno)
  FROM persona xpe
  JOIN personal xpl ON xpl.id_persona = xpe.id
  JOIN usuario xu ON xu.id_personal = xpl.id
  WHERE xu.id = atencion.id_usuario_rol_diagnostico
) AS usuario_diagnostico,

(
  SELECT CONCAT(xpe.nombre, ' ', xpe.paterno)
  FROM persona xpe
  JOIN personal xpl ON xpl.id_persona = xpe.id
  JOIN usuario xu ON xu.id_personal = xpl.id
  WHERE xu.id = atencion.id_usuario_rol_farmacia
) AS usuario_farmacia

FROM atencion
WHERE atencion.id = 5;
