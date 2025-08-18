create database cs_copacabana;
use cs_copacabana;

create table if not exists persona(
	id_persona int auto_increment primary key not null,
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
	persona_estado tinyint not null
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
    usuario_estado tinyint not null,
    constraint fk_persona_usuario
    foreign key (id_persona) references persona(id_persona) on delete cascade,
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
	id_direccion int auto_increment primary key not null,
    departamento varchar(20) not null,
    municipio varchar(20) not null,
    zona varchar(50) not null,
    av_calle varchar(50) not null
);

create table if not exists domicilio(
	id_domicilio int primary key, 
	nro_puerta int,
    id_persona int,
    constraint fk_domicilio_direccion
		foreign key(id_domicilio) references direccion(id_direccion)
		on delete cascade,
    constraint fk_domicilio_persona
		foreign key(id_persona) references persona(id_persona)
		on delete cascade
);

create table if not exists microred(
	id_microred int auto_increment primary key,
    nombre_microred varchar(50) not null,
    red varchar(50) not null,
    estado_microred TINYINT NOT NULL DEFAULT 1
);

create table if not exists establecimiento(
	id_establecimiento int primary key,
    nombre_establecimiento varchar(50) not null,
    estado_establecimiento TINYINT NOT NULL DEFAULT 1,
    tipo_establecimiento VARCHAR(50) not null,
    codigo_establecimiento int not null,
    id_microred int,
    constraint fk_establecimiento_direccion
        foreign key (id_establecimiento) references direccion(id_direccion)
        on delete cascade,
	constraint fk_establecimiento_microred
        foreign key (id_microred) references microred(id_microred)
        on delete cascade
);

#insert into establecimiento(id_establecimiento, nombre) value(2, 'COPACABANA');

create table if not exists atencion(
	id_atencion bigint primary key auto_increment not null,
    id_usuario int not null,
    id_paciente int not null,
    id_establecimiento int not null,
    fecha_atencion datetime,
    foreign key(id_usuario) references usuario(id_usuario),
	foreign key(id_paciente) references paciente(id_paciente),
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

#SELECT DE TODAS LAS ENTIDADES
select * from persona;
select * from usuario;
select * from rol;
select * from direccion;
select * from domicilio;
select * from establecimiento;
select * from registro_log;
select * from atencion;
select * from paciente;
select * from microred;
update microred 
                    set estado_microred=1
                    where id_microred=6;

# sentencia oficial para mostrar a los pacientes en la tabla de registrados 
select (select concat(xpe.ci, " ", xpe.extension)
		from persona xpe
		where xpa.id_persona=xpe.id_persona) as ci,
        
        (select xpe.nombre
		from persona xpe
		where xpa.id_persona=xpe.id_persona) as nombre,
        
        (select xpe.nombre
		from persona xpe
		where xpa.id_persona=xpe.id_persona) as paterno,

		(select xpe.nombre
		from persona xpe
		where xpa.id_persona=xpe.id_persona) as materno, 
        xpa.id_persona
from paciente xpa;
                        
#Para mostrar los datos de los centros de salud(establecimiento)
select xe.id_establecimiento, (select xd.zona
		from  direccion xd
		where xd.id_direccion = xe.id_establecimiento) as zona,
        (select xd.av_calle
		from  direccion xd
		where xd.id_direccion = xe.id_establecimiento) as av_calle,
		xe.nombre 
        from establecimiento xe;

select concat(ci, ' ', extension) as cedula from persona where ci = '12796720' and extension = 'LP';

select date(fecha_log) from registro_log;

#Para mostrar los pacientes solo del dia actual
select * 
from registro_log 
where date(fecha_log) = date(now());

delete from microred where id_microred=1;

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
