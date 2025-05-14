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
    perfil varchar(255),
    profesion varchar(50) not null,
    area_trabajo varchar(50) not null,
    fecha_ingreso date not null,
    id_persona int not null,
    CONSTRAINT fk_persona_personal
	FOREIGN KEY (id_persona) REFERENCES persona(id_persona)
	ON DELETE CASCADE,
    primary key(id_personal)
);


create table if not exists usuario(
	id_usuario int auto_increment not null,
    nombre_usuario varchar(20) unique not null,
    correo varchar(100) unique not null,
    clave varchar(255) unique not null,
    fecha_creacion datetime,
    id_personal int,
    id_rol int,
    foreign key (id_personal) references personal(id_personal),
    foreign key (id_rol) references rol(id_rol),
    primary key(id_usuario)
);

create table if not exists rol(
	id_rol int auto_increment not null,
    nombre varchar(50) not null,
    primary key(id_rol)
);

create table if not exists paciente(
	id_paciente int auto_increment not null,
	tipo_sangre varchar(10),
    estatura varchar(10),
    peso varchar(10),
    id_persona int not null,
    constraint fk_persona_paciente
	foreign key (id_persona) references persona(id_persona)
	on delete cascade,
    primary key (id_paciente)
);


create table if not exists direccion(
	id_direccion int auto_increment not null,
    departamento varchar(20) not null,
    municipio varchar(20) not null,
    zona varchar(50) not null,
    av_calle varchar(50) not null,
    primary key (id_direccion)
);

create table if not exists domicilio(
	id_domicilio int primary key references direccion(id_direccion), 
	nro_puerta mediumint,
    id_persona int,
    constraint fk_direccion_domicilio
    foreign key(id_domicilio) references direccion(id_direccion)
    on delete cascade,
    constraint fk_persona_domicilio
	foreign key(id_persona) references persona(id_persona)
	on delete cascade
);

create table if not exists establecimiento(
	id_establecimiento int primary key references direccion(id_direccion),
    nombre varchar(50) not null,
    foreign key(id_establecimiento) references direccion(id_direccion)
);

create table if not exists atencion(
	id_atencion bigint primary key auto_increment not null,
    id_usuario int not null,
    id_persona int not null,
    id_establecimiento int not null,
    fecha_atencion datetime,
    foreign key(id_usuario) references usuario(id_usuario),
    
	constraint fk_persona_atencion
	foreign key(id_persona) references persona(id_persona)
	on delete cascade,
    
	foreign key(id_establecimiento) references establecimiento(id_establecimiento)
);



create table if not exists registro_log(
	id_log bigint primary key auto_increment not null,
    id_usuario int not null,
    id_establecimiento int not null,
    fecha_log datetime,
    foreign key(id_usuario) references usuario(id_usuario),
	foreign key(id_establecimiento) references establecimiento(id_establecimiento)
);

# USUARIO ADMINISTRADOR
insert into persona(ci, extension, nombre, paterno, materno, nacionalidad, estado_civil, nro_telf, sexo, fecha_nacimiento)
values("12796720", "LP", "JOSE LUIS", "CONDORI", "CHAMBI", "BOLIVIANA", "SOLTERO", "73047440", "MASCULINO", "2000-03-12");
# USUARIO PERSONAL
insert into persona(ci, extension, nombre, paterno, materno, nacionalidad, estado_civil, nro_telf, sexo, fecha_nacimiento)
values("2079895", "LP", "VICENTA", "CHAMBI", "CHAMBI", "BOLIVIANA", "SOLTERO", "67060014", "FEMENINO", "1959-04-05");

# USUARIO ADMINISTRADOR
insert into personal(perfil, profesion, area_trabajo, fecha_ingreso, id_persona)
values("miperfil.jpg", "ESTUDIANTE", "ADMINISTRACION", "2024-08-01", 1);
# USUARIO PERSONAL
insert into personal(perfil, profesion, area_trabajo, fecha_ingreso, id_persona)
values("miperfil.jpg", "FARMACEUTICA", "FARMACIA", "2021-08-10", 12);

insert into rol(nombre) values('ADMINISTRADOR'),('DIRECTOR'),('PERSONAL');

#prueba para insertar una direccion y un domicilio por medio de la herencia en sql
insert into direccion(departamento, municipio, zona, av_calle)
values('LA PAZ', 'EL ALTO', 'NUEVOS HORIZONTES I', 'D-3');
insert into domicilio(id_domicilio, nro_puerta, id_persona)
values(1, 763, 1);


SHOW CREATE TABLE domicilio;
SELECT * FROM domicilio WHERE id_persona = 2;

#SELECT DE TODAS LAS ENTIDADES
select * from persona;
select * from personal;
select * from usuario;
select * from rol;
select * from direccion;
select * from domicilio;
select * from establecimiento;
select * from registro_log;

select concat(ci, ' ', extension) as cedula from persona where ci = '12796720' and extension = 'LP';

delete from persona where id_persona=10;
delete from domicilio where id_domicilio=5;
delete from usuario where id_usuario=1;

select ci, extension from persona
where ci = "1111111" and extension = "LPa";

select * from usuario where correo = 'informaticajlcc@gmail.com';

select * from registro_log;
