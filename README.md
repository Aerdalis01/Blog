# Blog

## Environnement de travail

 **Démarage du projet symfony**
    ```bash
      composer create-project symfony/skeleton Blog
**Ajout des dépendances symfony**
    ```bash
    composer require symfony/webpack-encore-bundle
    composer require form validator 
    composer require orm
    composer require symfony/serializer-pack
    composer require symfony/monolog-bundle
    composer require symfony/mime
    composer require symfony/web-profiler-bundle --dev
    composer require symfony/maker-bundle --dev
    composer require lexik/jwt-authentication-bundle
    composer require symfony/security-bundle
    composer require symfony/mailer
    composer require firebase/php-jwt



**Configuration de Webpack**
    ```bash
    npm install --save-dev @symfony/webpack-encore react react-dom typescript ts-loader @babel/preset-react @babel/preset-env core-js
**Ajout de TypeScript**
    ```bash
      npx tsc --init
**Configuration de tsconfig.json**
  {
  "compileOnSave": true,
  "compilerOptions": {
    "sourceMap": true,
    "moduleResolution": "node",
    "lib": ["dom", "es2015", "es2016"],
    "jsx": "react-jsx",
    "target": "es6",
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["assets/**/*"]
}

**Mysql**
    ```bash
    sudo apt-get install php-mysql
**Installer et configurer pretiiter**
    ```bash
    npm install --save--dev prettier
    npm install mdb-react-ui-kit
    npm install react-bootstrap bootstrap
    npm install react-router-dom
    npm install bad-words
    npm install jwt-decode


