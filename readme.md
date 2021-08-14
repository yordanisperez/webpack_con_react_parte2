# WebPack

En esencia webpack en un paquete de módulos estáticos que pre compila aplicaciones de java-script mapeando todas las dependencias para generar uno o más paquetes. La importancia de este empaquetador es que te permite automatizar el desarrollo de from-end utilizando pre-compiladores de herramientas agiles `(ES6, REACT, SASS, LESS)`convirtiéndolo después a lenguaje que entiende el navegador.  Además utiliza opciones de pre-compilados en dependencia del ambiente en que se encuentra tu aplicación(Desarrollo, Producción).

## Comandos de Instalación.

> `npm install webpack webpack-cli -D`

Con el paquete webpack precompilamos nuestro código resolviendo las dependencias y con webpack-cli podemos ejecutar webpack desde la línea de comandos.  

## Conceptos:

* [Entry](#entry)
* [Output](#output)
* [Loaders](#loader)
* [Plugins](#plugin)
* [Mode](#mode)


## Entry

Un Entry es el modulo principal por el cual debe comenzar a resolverse todo el árbol de dependencias. Por defecto este será ./src/index.js pero se puede configurar otro o múltiples puntos de entrada.

## Ejemplo:


```js
module.exports =
{
    entry: 
        {
            comp1:
            {
                import: './component-1.js',
             },
            comp2: 
            {
                import: './component-2.js',
            }
        }
}
```

En este caso tenemos 2 puntos de entrada comp1 y comp2. Coloquemos los códigos de comp1 y comp2 para una mayor compresión de la funcionalidad.

### obj.js
```js
export default { count: 0 };
```
### component-1.js
```js
import obj from './obj.js';
obj.count++;
console.log('component-1', obj.count);
```
### component-2.js
```js
import obj from './obj.js';
obj.count++;
console.log('component-2', obj.count);
```

## output
El objeto `output` define los ficheros de salida convertidos o pre-compilados entendibles para el navegador. La propiedad path recibe una dirección absoluta del sistema de archivos. La propiedad filename recibe el nombre del fichero o ficheros de salida en caso de que exista más de un punto de entrada, por convención a todos se les agrega el nombre bundle. 

```js
module.exports =
{
    entry: 
        {
            comp1:
            {
                import: './component-1.js'
            },
            comp2: 
            {
                import: './component-2.js'
            }
        },
    output:{
        path:__dirname+'/build',
        filename: '[name].bundle.js'
    }
}
```
Con esta configuración el comportamiento de los objetos no será el esperado, lo ejemplificamos ya que nos aclarará el funcionamiento de este empaquetador.

### Ejecutemos:

> `npx webpack --mode development`

**Salida por consola:**
```
component-1 1
component-2 1
```
Salta a la vista, que el objeto obj se ha duplicado en el navegador. Se ha instanciado en 2 ocasiones no produciéndose el resultado esperado. Para evitarlo webpack recomienda usar una opción de optimización, aunque también se puede evitar estableciendo las dependencias adecuadas en cada punto de entrada, como se muestra a continuación.

```js
module.exports ={
    entry: 
        {
            comp1:
            {
                import: './component-1.js',
                dependOn: 'obj',
            },
            comp2: 
            {
                import: './component-2.js',
                dependOn: 'obj',
            },
            obj: 
            {
                import: './obj.js'
            }
        },
    output:{
        path:__dirname+'/build',
        filename: '[name].bundle.js'
    }
}
```
La propiedad `dependOn` especifica una entrada de la cual depende la entrada actual, de esa manera webpack no duplicara dicha dependencia obteniéndose el resultado esperado.

**Salida por consola:**
```
component-1 1
component-2 2
```
La otra manera en la que webpack puede resolver estas dependencias comunes automáticamente es estableciendo una propiedad de optimización `runtimeChunk:single`.
```js
module.exports ={
    entry: 
        {
            comp1:
            {
                import: './component-1.js'
            },
            comp2: 
            {
                import: './component-2.js',
            }
        },
    output:{
        path:__dirname+'/build',
        filename: '[name].bundle.js'
    },
    optimization: {
        runtimeChunk: 'single'
    }
}
```
**Salida por consola:**
```
component-1 1
component-2 2
```
## loader
Los loader son transformaciones que se le aplica al código fuente cuando se cargan o se importan. Los loader pueden transformar archivos de un lenguaje diferente como `typescript` a `JavaScript` o cargar imágenes en línea o incluso importar los módulos `css` directamente desde `JavaScript`.

### Ejemplo, cargando módulos `css` desde `javascript`.

> `npm install css-loader style-loader -D`

```js
module.exports ={
    entry:{
            comp1:
            {
                import: './component-1.js',
            },
            comp2: 
            {
                import: './component-2.js',
            }
        },
    output:{
        path:__dirname+'/build',
        filename: '[name].bundle.js'
    },
    optimization: {
        runtimeChunk: 'single',
    },
    module: {
        rules: [{
            test: /\.css$/i,
            use: ["style-loader", "css-loader"],
          },
        ],
      }
}
```
La propiedad `module.rules` es una lista de objetos que representan reglas `.test` es una expresión regular que determina los archivos que serán cargados con los módulos especificados en la lista de la propiedad `module.rules.use`
Algo a tener en cuenta es que si se importa el mismo archivo `.css` desde distintos puntos de entrada, la información de la `css` se encontrara anexa a los puntos de entrada repetidamente.

### También es posible cargar el css desde el archivo de configuración.
```js
module.exports ={
    entry: 
        {
            comp1:
            {
                import: './component-1.js',
                dependOn: 'obj',
            },
            comp2: 
            {
                import: './component-2.js',
                dependOn: 'obj',
            },
            obj: 
            {
                import: './obj.js',
                import:'./index.css'
            }
        },
    output:{
        path:__dirname+'/build',
        filename: '[name].bundle.js'
    },
    module: {
        rules: [
          {
            test: /\.css$/i,
            use: ["style-loader", "css-loader"]
          },
        ],
      },
}
```
### SASS
Procesando archivos de estilos con el preprocesador de `css SASS`. Para ello necesitamos el loader de `sass`. 

Instalar SASS:
> `npm install sass-loader node-sass`
```js
module.exports ={
    entry: {
            comp1:{
                import: './component-1.js',
                dependOn: 'obj',
            },
            comp2:{
                import: './component-2.js',
                dependOn: 'obj',
            },
            obj:{
                import: './obj.js', 
            }
        },
    output:{
        path:__dirname+'/build',
        filename: '[name].bundle.js'
    },
    module: {
        rules: [
          {
            test: /\.css$/i,
            use: ["style-loader", "css-loader"],
          },
          {
              test:/.scss$/,
              use:[ "style-loader", "css-loader","sass-loader"]
          }
        ], 
      },
 
}
```
Algo a notar, es que el orden en que establece los loader influye en su funcionamiento,  se aconseja usar el orden que se está sugiriendo, en otro caso pudieran dar resultados no esperados.

## plugin
Los plugin es el concepto principal sobre el cual se encuentra construido `webpack`. Con ellos se logra realizar alguna tarea que con los loader no se pueda alcanzar. En este ejemplo solo agregaremos 2 plugin, el primero `html-webpack-plugin` y el 2do `mini-css-extract-plugin`
> `npm install html-webpack-plugin node-sass mini-css-extract-plugin -D`
> 
Con `html-webpack-plugin` nos permite procesar archivos `html` con `webpack` y `mini-css-extract-plugin` nos permite extraer todo el código `css` en un archivo o varios archivos `css` independientes.

### Ejemplo:
Ambos plugin se requieren en el archivo de configuración. En el caso de `miniCssExtractPlugin` tiene incluido un loader de `css`, el cual reemplazara al loader `style-loader`
```js
const htmlWebpackPlugin =require('html-webpack-plugin');
const miniCssExtractPlugin=require('mini-css-extract-plugin');

module.exports ={
    entry: 
        {
            comp1:
            {
                import: './component-1.js',
                dependOn: 'obj',
            },
            comp2: 
            {
                import: './component-2.js',
                dependOn: 'obj',
            },
            obj: 
            {
                import: './obj.js',
             
            }
        },
    output:{
        path:__dirname+'/build',
        filename: '[name].bundle.js'
    },
    module: {
        rules: [
          {
            test: /\.css$/i,
            use: [miniCssExtractPlugin.loader, "css-loader"],
          },
          {
              test:/.scss$/,
              use:[miniCssExtractPlugin.loader, "css-loader","sass-loader"]
          }
        ], 
      },
    plugins:[new htmlWebpackPlugin({
        template:'./index.html'
    }),
    new miniCssExtractPlugin({
        filename:'bundle.css',
    })

    ]
}
```
## Instalando un servidor de desarrollo en tiempo real con webpack.

> `npm install webpack-dev-server -D`

### Ejecutando nuestro servidor de desarrollo local
> `npx webpack serve`
```js
module.exports ={
    mode: 'development', //production or development
    devtool: 'eval-source-map',//eval or eval-source-map or https://webpack.js.org/configuration/devtool/
    devServer:{
        port:3000
    }
}
```
## mode
Varias configuraciones se muestran para el servidor de webpack.
Algunas consideraciones respecto a la configuración del package .json conjuntamente con el mode establecido.
> `npm i webpack webpack-cli css-loader style-loader html-webpack-plugin node-sass mini-css-extract-plugin sass-loader webpack-dev-server –D`

Esto significa que todas estas dependencias las instalaremos en modo desarrollo, es decir en modo producción no nos interesan debido a que después de preprocesado y generado nuestros códigos, todo quedara en lenguaje js, html y css entendible para el navegador. 
Nuestro package.json quedaría de la siguiente forma:
```js
{
  "name": "webpack-sample",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "Yordanis",
  "license": "ISC",
  "devDependencies": {
    "css-loader": "^6.2.0",
    "html-webpack-plugin": "^5.3.2",
    "mini-css-extract-plugin": "^2.2.0",
    "node-sass": "^6.0.1",
    "sass-loader": "^12.1.0",
    "style-loader": "^3.2.1",
    "webpack": "^5.50.0",
    "webpack-cli": "^4.7.2",
    "webpack-dev-server": "^3.11.2"
  }
}
```
# Integrando React a Nuestro Proyecto From-End

### Dependencias de desarrollo
> `npm i babel-core babel-loader babel-preset-react babel-preset-env –D`
### Dependencias de producción
> `npm i react react-dom`

# CONTINUARA EN OTRO PROYECTO.