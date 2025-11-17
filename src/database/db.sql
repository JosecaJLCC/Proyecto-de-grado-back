create database cs_copacabana;
use cs_copacabana;

create table if not exists persona(
	id_persona int auto_increment primary key,
    ci varchar(20) not null unique,
    extension char(5) not null,
    nombre varchar(50) not null,
    materno varchar(50),
    paterno varchar(50),
    nacionalidad varchar(30) not null,
    estado_civil varchar(20) not null,
    nro_telf varchar(15) null,
    sexo enum('MASCULINO', 'FEMENINO', 'OTRO') not null,
    fecha_nacimiento date not null
);

create table if not exists carpeta(
	id_carpeta int auto_increment primary key,
    nombre_carpeta varchar(50) not null,
    color varchar(50) null
);

create table if not exists microred(
	id_microred int primary key,
    id_director int null,
    nombre_microred varchar(50) not null,
    red varchar(50) not null,
    fecha_creacion datetime not null,
    estado_microred TINYINT NOT NULL DEFAULT 1
);

create table if not exists paciente(
	id_paciente int auto_increment primary key,
    id_persona int not null,
    id_carpeta int null,
    id_microred int null,
	tipo_sangre enum('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'),
    estatura varchar(10) null,
    peso varchar(10) null,
    estado_paciente TINYINT NOT NULL DEFAULT 1,
    fecha_creacion datetime not null,
    foreign key (id_microred) references microred(id_microred),
    constraint fk_persona_paciente
		foreign key (id_persona) references persona(id_persona) on delete cascade,
	constraint fk_carpeta_paciente
		foreign key (id_carpeta) references carpeta(id_carpeta) on delete cascade
);

create table if not exists profesion (
    id_profesion int auto_increment primary key,
    nombre_profesion varchar(100) not null unique,
    descripcion text null
);
insert into profesion(nombre_profesion) values('NO PROFESIONAL');

create table if not exists area_trabajo (
    id_area int auto_increment primary key,
    nombre_area varchar(100) not null unique,
    descripcion text null
);
insert into area_trabajo(nombre_area) values('ADMINISTRACION');

create table if not exists personal(
	id_personal int auto_increment primary key,
    id_persona int not null,
    id_profesion int null,
    id_area int not null,
	id_microred int null,
    cargo varchar(50) not null,
    nro_matricula varchar(20) unique null,
    fecha_ingreso date null,
    fecha_creacion datetime not null,
    estado_personal TINYINT NOT NULL DEFAULT 1,
    foreign key(id_persona) references persona(id_persona),
    foreign key(id_profesion) references profesion(id_profesion),
    foreign key(id_area) references area_trabajo(id_area),
    foreign key(id_microred) references microred(id_microred)
);

ALTER TABLE microred
ADD CONSTRAINT fk_microred_director
FOREIGN KEY (id_director) REFERENCES personal(id_personal);

create table if not exists usuario(
	id_usuario int auto_increment primary key,
    correo varchar(100) unique not null,
    clave varchar(255) unique not null,
    perfil varchar(255) not null,
    estado_usuario TINYINT NOT NULL DEFAULT 1,
    fecha_creacion datetime not null,
    id_personal int null,
    constraint fk_personal_usuario
		foreign key (id_personal) references personal(id_personal) on delete cascade
);

use cs_copacabana;
create table if not exists rol(
	id_rol int auto_increment primary key,
    nombre_rol varchar(50) not null,
    descripcion_rol text null
);
insert into rol(nombre_rol) values('ADMINISTRADOR'),('DIRECTOR'),('PERSONAL');

create table if not exists direccion(
	id_direccion int auto_increment primary key not null,
    departamento varchar(20) not null,
    municipio varchar(20) not null,
    zona varchar(50) not null,
    av_calle varchar(50) not null
);

create table if not exists domicilio(
	id_domicilio int primary key, 
	nro_puerta int null,
    id_persona int,
	foreign key(id_domicilio) references direccion(id_direccion) on delete cascade,
	foreign key(id_persona) references persona(id_persona) on delete cascade
);

create table if not exists establecimiento(
	id_establecimiento int primary key,
    nombre_establecimiento varchar(50) not null,
    estado_establecimiento TINYINT NOT NULL DEFAULT 1,
    tipo_establecimiento VARCHAR(50) not null,
    fecha_creacion datetime not null,
    id_microred int,
    constraint fk_establecimiento_direccion
        foreign key (id_establecimiento) references direccion(id_direccion)
        on delete cascade,
	constraint fk_establecimiento_microred
        foreign key (id_microred) references microred(id_microred)
        on delete cascade
);

create table if not exists usuario_rol(
	id_usuario_rol int auto_increment primary key,
    id_rol int not null,
    id_usuario int not null,
    id_establecimiento int null,
    fecha_creacion datetime,
    estado_usuario_rol TINYINT NOT NULL DEFAULT 1,
    foreign key(id_establecimiento) references establecimiento(id_establecimiento),
	foreign key (id_usuario) references usuario(id_usuario) on delete cascade,
	foreign key (id_rol) references rol(id_rol) on delete cascade
);

create table if not exists atencion(
	id_atencion int primary key auto_increment,
    id_usuario_rol int not null,
    id_paciente int not null,
    fecha_atencion datetime not null,
    foreign key(id_usuario_rol) references usuario_rol(id_usuario_rol),
	foreign key(id_paciente) references paciente(id_paciente)
);

create table if not exists registro_log(
	id_log int primary key auto_increment,
    id_usuario_rol int not null,
    fecha_log datetime not null,
    foreign key(id_usuario_rol) references usuario_rol(id_usuario_rol)
);

create table if not exists historial(
	id_historial int auto_increment primary key,
    diagnostico varchar(100) not null,
    descripcion text not null,
    id_paciente int,
    constraint fk_paciente_historial
		foreign key (id_paciente) references paciente(id_paciente) on delete cascade
);

select distinct cargo
from personal
where estado_personal=1;

select  DATE(CONVERT_TZ(now(), '+00:00', '-04:00'));
SELECT CONVERT_TZ(NOW(), '+00:00', '-04:00') AS hora_bolivia;
select version();
use cs_copacabana;
select * from atencion;
select * from paciente;
select * from area_trabajo;
select * from profesion;
select * from rol;
select * from registro_log;
select * from personal;
select * from usuario;
select * from establecimiento;
select * from microred;
select * from usuario_rol;
insert into usuario_rol(id_rol, id_usuario) values(3,1);
select * from persona;
select * from domicilio;

update microred set id_director=2 where id_microred=200805;

SELECT 
    xu.id_usuario,
    xu.correo,
    xu.clave,
    xpl.id_personal,
    
    COUNT(xur.id_rol) AS cantidad_roles
FROM usuario xu
JOIN personal xpl ON xu.id_personal = xpl.id_personal
JOIN usuario_rol xur ON xu.id_usuario = xur.id_usuario
WHERE xu.correo = 'informaticajlcc@gmail.com'
  AND xu.estado_usuario = 1
GROUP BY xu.id_usuario, xu.correo, xu.clave, xpl.id_personal;

SELECT 
    xu.id_usuario,
    xu.correo,
    xu.clave,
    xpl.id_personal, xur.id_usuario_rol, xr.nombre
FROM usuario xu, personal xpl, usuario_rol xur, rol xr 

WHERE xu.correo = 'informaticajlcc@gmail.com' and xu.id_personal = xpl.id_personal
  AND xu.id_usuario=xur.id_usuario and xur.id_rol=xr.id_rol and xu.estado_usuario = 1;

select xe.nombre_establecimiento, xe.id_establecimiento 
                    from usuario xu, personal xpl, establecimiento xe
                    where xu.id_usuario=1 and xu.id_personal=xpl.id_personal;

SELECT xu.id_usuario, xu.correo, xu.clave,
            xpl.id_personal, xur.id_usuario_rol, xr.nombre, xr.id_rol, count(id_rol)
        FROM usuario xu, personal xpl, usuario_rol xur, rol xr 

        WHERE xu.correo = 'joseluisjoswekrick@gmail.com' and xu.id_personal = xpl.id_personal
        AND xu.id_usuario=xur.id_usuario and xur.id_rol=xr.id_rol and xu.estado_usuario = 1;
        
select * from usuario;
select * from usuario_rol;
insert into usuario_rol(id_usuario, id_rol, fecha_creacion) values(1,1, "2024-05-03");

select xpa.id_paciente, concat(xpe.ci, " ", xpe.extension) as ci,
                concat(xpe.paterno," ",xpe.materno," ",xpe.nombre) as nombres,
                xa.fecha_atencion
            from persona xpe, paciente xpa, atencion xa 
            where xpa.id_persona=xpe.id_persona and xpa.id_paciente=xa.id_paciente and xpa.estado_paciente=1;
            
            select xm.id_microred, xm.nombre_microred, xm.red, xm.id_director,
            DATE_FORMAT(xm.fecha_creacion, '%Y-%m-%d %H:%i:%s') AS fecha_creacion, 
            concat(xpe.paterno, " ", xpe.materno, " ", xpe.nombre) as nombres, 
            concat(xpe.ci," ",xpe.extension) as ci 
            from microred xm, personal xpl, persona xpe 
            where estado_microred = 1 and xm.id_director=xpl.id_personal and xpl.id_persona=xpe.id_persona;
            
select *
from personal xpl, persona xpe, domicilio xdo
where xpe.ci="12796720" and xpe.extension="LP" and 
xpl.id_persona=xpe.id_persona and 
xpe.id_persona=xdo.id_persona;