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

create table if not exists rol(
	id_rol int auto_increment not null,
    nombre varchar(50) not null,
    primary key(id_rol)
);

insert into rol(nombre) values('ADMINISTRADOR'),('DIRECTOR'),('PERSONAL');

create table if not exists usuario(
	id_usuario int auto_increment not null,
    nombre_usuario varchar(20) unique not null,
    correo varchar(100) unique not null,
    clave varchar(255) unique not null,
    fecha_creacion datetime,
    perfil varchar(255),
    id_rol int,
    id_persona int,
    foreign key (id_persona) references persona(id_persona),
    foreign key (id_rol) references rol(id_rol),
    primary key(id_usuario)
);

create table if not exists paciente(
	id_paciente int auto_increment not null,
	tipo_sangre varchar(10),
    estatura varchar(10),
    peso varchar(10),
    id_persona int not null,
    constraint fk_persona_paciente
	foreign key (id_persona) references persona(id_persona) on delete cascade,
    primary key (id_paciente)
);

create table if not exists historial(
	id_historial int auto_increment not null,
    diagnostico varchar(100) not null,
    descripcion varchar(255) not null,
    id_paciente int,
    constraint fk_paciente_historial
	foreign key (id_paciente) references paciente(id_paciente) on delete cascade,
    primary key(id_historial)
);

create table if not exists direccion(
	id_direccion int auto_increment not null,
    departamento varchar(20) not null,
    municipio varchar(20) not null,
    zona varchar(50) not null,
    av_calle varchar(50) not null,
    primary key (id_direccion)
);

insert into direccion(departamento, municipio, zona, av_calle) values('LA PAZ', 'EL ALTO', 'VILLA COPACABANA', 'AV ILLIMANI');

create table if not exists domicilio(
	id_domicilio int primary key references direccion(id_direccion), 
	nro_puerta int,
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

insert into establecimiento(id_establecimiento, nombre) value(2, 'COPACABANA');

create table if not exists atencion(
	id_atencion bigint primary key auto_increment not null,
    id_usuario int not null,
    id_persona int not null,
    id_establecimiento int not null,
    fecha_atencion datetime,
    
    foreign key(id_usuario) references usuario(id_usuario),
    
	foreign key(id_persona) references persona(id_persona),
    
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

#prueba para insertar una direccion y un domicilio por medio de la herencia en sql
insert into direccion(departamento, municipio, zona, av_calle)
values('LA PAZ', 'EL ALTO', 'NUEVOS HORIZONTES I', 'D-3');
insert into domicilio(id_domicilio, nro_puerta, id_persona)
values(1, 763, 1);

SHOW CREATE TABLE domicilio;
SELECT * FROM domicilio WHERE id_persona = 2;

#SELECT DE TODAS LAS ENTIDADES
select * from persona;
select * from usuario;
select * from rol;
select * from direccion;
select * from domicilio;
select * from establecimiento;
select * from registro_log;
select * from atencion;

select concat(ci, ' ', extension) as cedula from persona where ci = '12796720' and extension = 'LP';

select date(fecha_log) from registro_log;

#Para mostrar los pacientes solo del dia actual
select * 
from registro_log 
where date(fecha_log) = date(now());

delete from persona where id_persona=12;

use cs_copacabana;

## Para mostrar los datos del registro de paciente de una fecha establecida
##ya que no todo esta en una tabla asi que se debe hacer lo siguiente:
select (select concat(xp.ci, " ", xp.extension) as cedula
		from persona xp 
		where xp.id_persona=xa.id_persona) as cedula, 
        (select concat (xp.paterno," ", xp.materno, " ", xp.nombre) as nombres
		from persona xp 
		where xp.id_persona=xa.id_persona) as nombres,
	
        (select xe.nombre 
		from establecimiento xe
		where xe.id_establecimiento = xa.id_establecimiento) as establecimiento
from atencion xa
where date(xa.fecha_atencion) = date(now());

## Para mostrar los datos del registro, ya que no todo esta en una tabla asi que se debe hacer lo siguiente:
select (select concat(xp.ci, " ", xp.extension) as cedula
		from persona xp 
		where xp.id_persona=xa.id_persona) as cedula, 
        (select concat (xp.paterno," ", xp.materno, " ", xp.nombre) as nombres
		from persona xp 
		where xp.id_persona=xa.id_persona) as nombres,
	
        (select xe.nombre 
		from establecimiento xe
		where xe.id_establecimiento = xa.id_establecimiento) as establecimiento,
        
        xa.fecha_atencion
from atencion xa;
