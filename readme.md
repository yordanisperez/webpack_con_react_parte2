# WebPack with React

Esta es la continuación del proyecto https://github.com/yordanisperez/webpackParte1. En la parte 1 se trataron las configuraciones necesarias para la integración de `webpack` a un proyecto `javascript`, `html`, `css` y `sass`, asi como la descripción de cada uno de 5 conceptos fundamentales sobre los que trabaja webpack (`entry`, `output`, `loader`, `plugins`, `mode`) con un ejemplo práctico.
En el presente proyecto se pretende integrar `webpack` a un proyecto `react`, configurando un servidor de desarrollo en tiempo real con un refrescamiento automático por detrás del `DOM` dando la apariencia de que trabajas directamente sobre la `web` que encuentras visualizando. También configuraremos nuestro proyecto para un ambiente de producción y en el trayecto conoceremos de varias configuraciones que nos ayudaran a tener una mejor experiencia. Solo se manejarán conceptos que no se hallan tratado en la primera parte antes mencionada.

- [WebPack with React](#webpack-with-react)
  - [Dependencias de desarrollo](#dependencias-de-desarrollo)
  - [Dependencias de producción](#dependencias-de-producción)
  - [Archivos de configuración de webpack](#archivos-de-configuración-de-webpack)
  - [webpack.common.js](#webpackcommonjs)
  - [webpack.develop.js](#webpackdevelopjs)
  - [webpack.production.js](#webpackproductionjs)
  - [Babel](#babel)
  - [Comandos](#comandos)
  - [Package.json](#packagejson)

## Dependencias de desarrollo

> `npm i webpack webpack-cli css-loader style-loader html-webpack-plugin node-sass mini-css-extract-plugin sass-loader webpack-dev-server –D`

Estas son las mismas dependencias ya usadas en la parte I de este tutorial y serán las mismas con las que comenzaremos, para mas detalles vea (https://github.com/yordanisperez/webpackParte1).

> `npm i @babel/core @babel/preset-env @babel/preset-react babel-loader clean-webpack-plugin react-refresh webpack-merge -D`

Todas estas dependencias solo la instalaremos como dependencia de desarrollo.

`@babel/core` : Babel es una herramienta que nos permite transformar nuestro código `JS` de última generación (o con funcionalidades extras) a `JS` que cualquier navegador o versión de `node.js` entienda. Para lograrlo se le integran `plugins` con las ultimas características agregadas al compilador, un `plugin` por cada característica, para ello se usan los `preset`.

`@babel/preset-env` :Es un ajuste preestablecido que le permite usar las últimas versiones de `javascript` sin tener que manejar las transformaciones de `@babel/core` directamente.

`@babel/preset-react`: Es un ajuste preestablecido que le permite usar lenguaje `jsx` sin tener que manejar las transformaciones de `@babel/core` directamente.

`babel-loader`: Se encarga de integrar `webpack` con `babel`.

`clean-webpack-plugin`:Tras cada compilación nos limpia la carpeta de salida del proyecto `webpack` definida en `output`.

`react-refresh`: Después de cada compilación se encarga de que el estado de `react` no se altere. Es muy útil cuando tenemos datos insertados en un formulario y realizamos cambios en nuestro código, pues tras una nueva compilación esos datos se mantendrán en cada uno de los campos del formulario, ahorrándonos tiempo de depuración y desarrollo.

`webpack-merge`: Mesclara los archivos de configuración dando como resultado un archivo con las configuraciones a usar por `webpack`.

## Dependencias de producción

> `npm i react react-dom core-js`

`react react-dom`: Paquetes necesarios para trabajar con `REACT`. Manejo de estados, `Dom`, `Contexto`, características propias de `react`.

`core-js`: Biblioteca estándar modular para JavaScript. Incluye polyfills para ECMAScript hasta 2021: promesas, símbolos, colecciones, iteradores, matrices escritas, muchas otras características, propuestas de ECMAScript, algunas características de WHATWG / W3C multiplataforma y propuestas como URL. Puede cargar solo las funciones necesarias o utilizarlas sin contaminación del espacio de nombres global.

## Archivos de configuración de webpack

`Webpack` recomienda que se usen distintos archivos de configuración dependiendo de los modos del entorno(`production` o `development`). Con el objetivo de no duplicar líneas de código innecesarias se usó el paquete `webpack-merge` para mesclar las configuraciones comunes a ambos modos, con las específicas de cada modo.

Por ello contamos con 3 ficheros de configuración.

- [webpack.common.js](#webpackcommonjs)
- [webpack.develop.js](#webpackdevelopjs)
- [webpack.production.js](#webpackproductionjs)

## webpack.common.js

```js
/** @type {import('webpack').Configuration} */
const path = require("path");
const htmlWebpackPlugin = require("html-webpack-plugin");
const miniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  entry: {
    main: {
      import: "./src/index.js",
    },
  },
  output: {
    path: path.resolve(__dirname, "../build"),
    filename: "[name].[contenthash].js",
    publicPath: "",
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [miniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /.scss$/,
        use: [
          {
            loader: miniCssExtractPlugin.loader,
          },
          {
            loader: "css-loader",
          },
          {
            loader: "sass-loader",
          },
        ],
      },
      {
        test: /\.(js|jsx)$/,
        use: "babel-loader",
        exclude: /node_modules/,
      },
      {
        type: "asset",
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new htmlWebpackPlugin({
      template: "./src/index.html",
    }),
    new miniCssExtractPlugin({
      filename: "bundle.css",
    }),
    new CleanWebpackPlugin(),
  ],
  resolve: {
    extensions: [".js", ".jsx", ".json"],
  },
};
```

```js
/** @type {import('webpack').Configuration} */
```

Esta línea de código es un comentario que nos permite autocompletado en el fichero de configuración de webpack!!!.

```js
    output:{
        path:path.resolve(__dirname,'../build'),
        filename: '[name].[contenthash].js',
        publicPath:""
    },
```

`path`: Directorio absoluto donde se colocaran los ficheros de salida de webpack.

```js
filename: '[name].[contenthash].js',
```

`filename` se refiere al nombre o nombres que recibirán los ficheros de salida de `webpack`. `[name]`, trata de nombre del punto de entrada, por defecto `“main”`. `[contenthash]`, trata de un `hash` que se genera automáticamente en cada compilación, lo cual es muy útil para obligar al servidor a que sirva un nuevo paquete forzadamente en cada cambio provocado en una nueva compilación. Esto es muy útil debido a que los almacenamientos en cache durante el desarrollo pudiera generarnos falsos positivos.

```js
module: {
  rules: [
    {
      test: /\.(js|jsx)$/,
      use: "babel-loader",
      exclude: /node_modules/,
    },
  ];
}
```

Solo estamos definiendo un nuevo loader para los archivos de `react`, lo significativo en este fragmento no visto hasta el momento es `exclude:/node_modules/` lo cual se trata de una expresión regular para excluir la carpeta node_modules de la carga por parte de los `loader`.

```js
module: {
  rules: [
    {
      type: "asset",
      test: /\.(png|svg|jpg|jpeg|gif)$/i,
      exclude: /node_modules/,
    },
  ];
}
```

Hacer notar la utilidad de este `loader`, nos permite cargar desde `javascript` archivos `(png|svg|jpg|jpeg|gif)` mas otros que no se encuentran en esta lista. En el presente ejemplo se carga el `logo` y este loader lo incrusta en el código `html`, para ello debe ser menor a 8k de tamaño y contar con un formato `vectorial`.

```js
const {CleanWebpackPlugin}=require('clean-webpack-plugin');

    plugins:[new CleanWebpackPlugin()
    ],
```

`Plugin` que se encargara de limpiar la carpeta de salida de `webpack` en cada nueva compilación. Es útil para no mesclar archivos entre compilaciones. Un trabajo manual que nos evitamos.

```js
    resolve:{
        extensions:['.js','.jsx','.json'],
    },
```

Le decimos a `webpack` que resuelva estas extensiones de archivos, de manera que no tenemos que importarlos indicando su extensión.

## webpack.develop.js

```js
/** @type {import('webpack').Configuration} */
const { HotModuleReplacementPlugin } = require("webpack");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const { merge } = require("webpack-merge");
const common = require("./webpack.common");

const development_config = {
  devtool: "eval-source-map", //eval or eval-source-map or source-map recomendado para production
  devServer: {
    port: 3000,
    contentBase: "../build",
    open: "firefox",
    hot: true,
  },
  mode: "development", //production or development
  target: "web",
  plugins: [new HotModuleReplacementPlugin(), new ReactRefreshWebpackPlugin()],
};
module.exports = merge(common, development_config);
```

```js
const {HotModuleReplacementPlugin} = require('webpack');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

    plugins:[new HotModuleReplacementPlugin(),
        new ReactRefreshWebpackPlugin(),
    ],
```

Reemplazo de módulo en caliente (HMR) intercambia, agrega o elimina módulos mientras se ejecuta una aplicación, sin una recarga completa. Esto puede acelerar significativamente el desarrollo de varias formas:

- Conserva el estado de la aplicación que se pierde durante una recarga completa.
- Ahorre un valioso tiempo de desarrollo actualizando únicamente los cambios.
- Actualice instantáneamente el navegador cuando se realicen modificaciones en `CSS / JS` en el código fuente, que es casi comparable a cambiar estilos directamente en las herramientas de desarrollo del navegador.

```js
const { merge } = require("webpack-merge");

module.exports = merge(common, development_config);
```

Mescla las configuraciones comunes de webpack que ya hemos establecido en webpack.common.js con las definidas en el módulo de desarrollo actual.

`devtool: 'eval-source-map'`: Habilita los mapeados del código producido por `webpack` a nuestro código fuente, de manera que podamos depurar nuestro proyecto desde el navegador.

```js
    devServer:{
        port:3000,
        contentBase: "../build",
        open:"firefox",
        hot:true,
    },
```

El servidor de desarrollo que nos levanta `webpack` se encontrara sirviendo por el puerto 3000. Servirá el resultado desde una carpeta virtual creada en `contentBase: "../build"`, se abrirá en el navegador establecido en `open:` y para que esto suceda debe establecer `hot:true`.

`target:"web",`

En la versión actual de webpack no funciona en tiempo de desarrollo adecuadamente la discriminación de navegadores establecida en el `package.json`.

`"browserslist": "> 0.25%, not dead, not ie 11"`

Por lo cual es necesario definir `target` en `web` para que anule esta sentencia en el `package.json`, solo para desarrollo, en futuras versiones debe estar resuelto este inconveniente.

## webpack.production.js

```js
/** @type {import('webpack').Configuration} */

const { merge } = require("webpack-merge");
const common = require("./webpack.common");

const prod_config = {
  devtool: "source-map", //eval or eval-source-map or source-map recomendado para production
  mode: "production", //production or development
  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },
};
module.exports = merge(common, prod_config);
```

`devtool: 'source-map'` : Se habilitan los mapeados en ambiente de producción, es el recomendado. Se deben eliminar estos `.map` antes de servirles la web a los clientes finales.

`mode: 'production'` : Establecemos el ambiente de producción.

```js
    optimization:{
        splitChunks:{
            chunks:"all",
        },
    },
```

Es la opción de optimización recomendada, lo que se pretende es que los chunks de los cuales depende nuestro desarrollo, dependencias externas, se encuentren en shunks independientes, estos son los que tienen menos probabilidad de cambiar, por lo que es recomendable que sean cacheados por el navegador, y los módulos de nuestra aplicación se encuentren en shunks separados ya que tienen una mayor probabilidad de cambiar.

```js
module.exports = merge(common, prod_config);
```

Mesclamos la configuración común a la configuración de producción.

## Babel

```js
.babelrc
 {
        "presets": [["@babel/preset-env",{
            "corejs":3.16,
            "useBuiltIns":"usage"
        }], ["@babel/preset-react",{
            "runtime":"automatic"
        }]]
    }
```
```js
["@babel/preset-env",{
"corejs":3.16,
"useBuiltIns":"usage"
}]
```
Convertir la sintaxis que usamos moderna a una sintaxis que entiendan los navegadores, adicionalmente le agregamos el paquete de `polyfills` con la versión `"corejs":3.16` y le pasamos la opción `"useBuiltIns":”usage”` para que solo nos incluya en nuestro código resultante los `polyfills `necesarios para mantener la compatibilidad con los navegadores establecidos en el `package.json` `browserslist`
```js
"browserslist": "> 0.25%, not dead, not ie 11"
```
Solo se considerarán los navegadores que tengan más de `0.25%` de cuota de mercado, que no estén muertos para lo cual deben haber tenido actualizaciones de al menos hace 2 años y no me interesa el internet explorer 11.
```js
["@babel/preset-react",{
"runtime":"automatic"
}]
```
Convertir la sintaxis de `react jsx`, adicionalmente la opción `"runtime":”automatic”` nos permite dejar de usar obligatoriamente en todos los módulos de `react`.
```js
import react from 'react'
```
## Comandos
```js
"scripts": {
"build": "webpack --config config/webpack.production.js",
"start": "webpack serve --config config/webpack.develop.js"
},
```
En el `package.json` establecemos un comando para modo de desarrollo `"start"` el cual arranca nuestro servidor `webpack` de desarrollo de  `webpack serve` pasándole el fichero de configuración para el modo de desarrollo `–-config config/webpack.develop.js`
De igual manera creamos el comando para construir nuestra aplicación de producción `"build"` llamando a `webpack` y pasándole el fichero de configuración `webpack –-config config/webpack.production.js`

## Package.json
```js
{
"name": "webpack-react-webpack",
"version": "1.0.0",
"description": "Un proyecto optimizado para desarrollo y producción con react y webpack",
"main": "index.js",
"scripts": {
"build": "webpack --config config/webpack.production.js",
"start": "webpack serve --config config/webpack.develop.js"
},
"keywords": ["react","webpack"],
"author": "Yordanis",
"license": "ISC",
"devDependencies": {
"@babel/core": "^7.15.0",
"@babel/preset-env": "^7.15.0",
"@babel/preset-react": "^7.14.5",
"@pmmmwh/react-refresh-webpack-plugin": "^0.4.3",
"babel-loader": "^8.2.2",
"clean-webpack-plugin": "\*",
"css-loader": "^6.2.0",
"html-webpack-plugin": "^5.3.2",
"mini-css-extract-plugin": "^2.2.0",
"node-sass": "^6.0.1",
"react-refresh": "^0.9.0",
"sass-loader": "^12.1.0",
"style-loader": "^3.2.1",
"webpack": "^5.50.0",
"webpack-cli": "^4.7.2",
"webpack-dev-server": "^3.11.2",
"webpack-merge": "^5.8.0"
},
"dependencies": {
"core-js": "^3.16.1",
"react": "^17.0.2",
"react-dom": "^17.0.2"
},
"browserslist": "> 0.25%, not dead, not ie 11"
}
```

Solo se han escrito estos artículos como referencia para el autor y se publica para que pueda ser útil a otros que lo pudieran necesitar. Siéntase libre de corregirlo y dar recomendaciones.

Las referencias usadas fueron

Canal de Yoelvis Mulen { code }: https://www.youtube.com/watch?v=97Ajv8-NRVY

Canal de Fazt Code: https://www.youtube.com/watch?v=gtkdxLgHIhg
