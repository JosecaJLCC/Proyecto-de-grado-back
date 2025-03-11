create database cs_copacabana;
use cs_copacabana;

create table if not exists persona(
	id_persona int auto_increment not null,
    ci varchar(20) not null,
    extension char(5) not null,
    nombre varchar(50) not null,
    materno varchar(50),
    paterno varchar(50),
    nacionalidad varchar(30) not null,
    estado_civil varchar(20) not null,
    nro_telf char(10) not null,
    sexo enum('MASCULINO', 'FEMENINO', 'OTRO') not null,
    fecha_nacimiento date not null,
    primary key(id_persona)
);

create table if not exists personal(
	id_personal int auto_increment not null,
    profesion varchar(50) not null,
    area_trabajo varchar(50) not null,
    fecha_ingreso date not null,
    id_persona int not null,
    foreign key(id_persona) references persona(id_persona),
    primary key(id_personal)
);

create table if not exists usuario(
	id_usuario int auto_increment not null,
    nombre_usuario varchar(20) unique not null,
    correo varchar(100) unique not null,
    clave varchar(255) unique not null,
    fecha_creacion datetime,
    id_personal int,
    foreign key (id_personal) references personal(id_personal),
    primary key(id_usuario)
);

create table if not exists rol(
	id_rol int auto_increment not null,
    nombre varchar(50) not null,
    primary key(id_rol)
);

create table if not exists usuario_rol(
	id_usuario int not null,
	id_rol int not null,
    nombre varchar(50) not null,
    primary key(id_usuario, id_rol),
    foreign key (id_usuario) references usuario(id_usuario),
    foreign key (id_rol) references rol(id_rol)
);

create table if not exists paciente(
	id_paciente int auto_increment not null,
	tipo_sangre varchar(10),
    estatura varchar(10),
    peso varchar(10),
    id_persona int not null,
    foreign key (id_persona) references persona(id_persona),
    primary key (id_paciente)
);

create table if not exists establecimiento(
	id_establecimiento int auto_increment not null,
    nombre varchar(50) not null,
    red varchar(50) not null,
    subred varchar(50) not null,
    primary key(id_establecimiento)
);

create table if not exists direccion(
	id_direccion int auto_increment not null,
    departamento varchar(20) not null,
    municipio varchar(20) not null,
    zona varchar(50) not null,
    av_calle varchar(50) not null,
    nro_puerta mediumint,
    id_persona int,
    id_establecimiento int,
    primary key (id_direccion),
    foreign key (id_persona) references persona(id_persona),
    foreign key(id_establecimiento) references establecimiento(id_establecimiento)
);

insert into persona(ci, extension, nombre, paterno, materno, sexo, fecha_nacimiento)  
values ('12796720', 'LP', 'JOSE LUIS', 'CONDORI', 'CHAMBI', 'MASCULINO', '2000-03-12');

insert into usuario(nombre_usuario, correo, clave, fecha_creacion, id_persona)
values ('jlcondoric', 'informaticajlcc@gmail.com', '12345678', now() , 1);

select * from usuario;
delete from usuario where id_persona=1;
