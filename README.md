# eldar-challenge

El repositorio contiene dos proyectos separados que requieren que se ejecute npm install en cada uno de ellos:
 - fake-api-jwt-json-server-mater: un back end que genera un servidor con json-server. Este contiene dos json uno de usuarios y otro de productos con la información que se usará la api. El proyecto se ejecuta usando el comando: npm run start-auth
 - eldar-challenge-rodriguez: Un proyecto hecho en Angular 18 que se puede ejecutar con el comando ng-serve.

 El proyecto de angular consta de un login con usuario y contraseña, que da acceso a una lista de productos. Esta lista incluye la paginación de los productos y la posiblidad de realizar una busqueda por el nombre de los mismos. Además una vez en la lista de productos dependiendo del rol del usuario se podrá acceder a la creación y edición de productos.
 
 En el proyecto se crearon las carpetas guards, interceptors, interfaces, services, store y components que contienen cada una el tipo de archivo o clase que su nombre indica. 
 Además dentro de la carpeta componentes se crearon auth con login dentro que contiene todo referido al login (se crea auth con la idea de que si en un futuro se agrega el registro de usuarios iría en esta carpeta).
 Luego esta la carpeta shared que se creo para componentes usados en mas de una pantalla.
 Y por último productos que contiene product details (componente usado en edición y creación de productos) y product list que contiene además data view ambos usados para listar los productos.
