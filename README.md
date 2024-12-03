# Blog

## Environnement de travail

 **Démarage du projet symfony**
    ```bash
      composer create-project symfony/skeleton Blog
**Ajout des dépendances symfony**
    ```bash
    composer require symfony/webpack-encore-bundle
    composer require symfony/maker-bundle --dev
**Composer**
    ```bash
    composer require orm
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
