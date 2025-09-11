# copacabana-health

## Se esta usando el modelo vista controlador MVC para la estructura del backend

## se instalo express como framework para levantar el servidor

    ```sh
    npm install express 
    ```

## se instalo nodemon para que no tengamos que recargar el servidor en cada momento

    ```sh
    npm install nodemon -D 
    ```

## se instalo morgan como middlewares para ver el estado de las peticiones

    ```sh
    npm install morgan 
    ```

## se instalo mysql2 para la conexion con nuestra base de datos en mysql

    ```sh
    npm install mysql 
    ```

## se instalo bcryptjs para la encriptacion de nuestras claves de contrasenias

    ```sh
    npm install bcryptjs 
    ```

## se instalo jsonwebtoken para generar un token para el inicio de sesion de un usuario

    ```sh
    npm install jsonwebtoken
    ```

## se instalo dotenv para variables de entorno

    ```sh
    npm install jsonwebtoken
    ```

## se instalo multer para agregar archivos a nuestro proyecto

    ```sh
    npm install multer
    ```

## Configuracion de commitlint + husky v9+

### Este proyecto usa **Commitlint** para validar los mensajes de commit

### 1. instalacion

    ```bash
    npm install --save-dev husky @commitlint/cli @commitlint/config-conventional
    ```

### 2. configurar commitlint

### Creamos el archivo commitlint.config.js en la raiz del proyecto con el sgte contenido

    ```js
    module.exports ={
    extends: ['@commitlint/config-conventional']
    }
    ```

### 3. Configurar husky manualmente

### Crear carpeta y archivo de hook

    ```bash
    mkdir -p .husky
    touch .husky/commit-msg
    chmod +x .husky/commit-msg
    ```

### Edita .husky/commit-msg y agrega este contenido

    ```sh
    #!/bin/sh
    npx --no-install commitlint --edit "$1"
    ```

### 4. Probar configuracion

    ```bash
    git commit -m "feat: agregar funcionalidad X"
    ```

## oxlint

    ```sh
    npm install --save-dev oxlint
    ``` 

### Crear el archivo de configuración

    ```sh
    touch .oxlintrc.json
    ```

### Escribir lo siguiente en el archivo

    ```json
    {
    "rules": {
        "no-alert": "error",
        "oxc/approx-constant": "warn",
        "no-plusplus": ["error", { "allowForLoopAfterthoughts": true }]
    }
    }
    ```

### Agregamos el siguiente script en package.json

    ``` json 
    "scripts":{
        "lint": "oxlint"
    }
    ```

### Asi podras correr el siguiente comando

    ```sh
    npm run lint
    ```

### Instalar Day JS para manejar las fechas en zona horaria de Bolivia

    ```sh
    npm install dayjs --save
    ```
