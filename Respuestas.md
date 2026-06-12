2. Bloque Teórico y Calidad Ágil (30 Minutos recomendados)

Pregunta 2.1: Gestión de Contratos y Flujos en el Sprint

Durante la planificación de un Sprint, se asigna una Historia de Usuario para automatizar el nuevo
backend transaccional de NYXN, pero el equipo de desarrollo aún no despliega los endpoints finales.

- ¿Cómo aplicarías el concepto de Pruebas Tempranas (Early Testing) para automatizar sin
depender del despliegue del backend?

R//:

Según mi experiencia se deben debatir y acordar previamente con desarrollo las siguientes ideas:
1. crear mocks o maquetas de datos para simular los endpoints que desarrollo no ha finalizado.  
2. dentro de la historia de usuario exponer la estructura del endpoint con sus respectivos datos, tipos, headers, codigos http, tokens... es decir, clarificar el contrato dentro de la HU para que el mock lo pueda copiar
3. definir un ambiente de pruebas para que el mock pueda correr
4. claficar otras dependencias con los endpoints

- Define qué requerirías en el Definition of Ready (DoR) para aceptar la HU y qué automatizaciones
mínimas exigirías en el Definition of Done (DoD).

R//:

Para aceptar la HU con el DoR:
- contrato del endpoint (API) definido
- ambiente de prueba y simulación de mocks configurado o fecha en la que se tendría el ambiente
- listado de dependiencias para aquellos end points 
- flujos de negocios completos o escenarios de prueba
- datos que va a usar la automatización 

Automatizaciones minimas DoD:- 
- validación del flujo critico o linea base (camino feliz) con el contrato del end point
- validación de un escenario de error o denegación de servicio

3. Parte A: Intervención de Interfaz de Usuario (Playwright o Cypress)

R//: Se crea el proyecto base con el patron POM por medio de VibeCoding (Cloude Code + Playwright MCP) para el escenario de autenticarse (camino feliz) y poder comprar producto cofirmando orden flujo completo. Con el fin de tener el proyecto base apra parte A. 

Escenario crítico: autenticación (el usuario estándar puede iniciar sesión y ver el inventario)
Escenario crítico: agregar producto al carrito (agregar un producto actualiza el contador del carrito)
Escenario crítico: checkout del carrito (el producto agregado aparece en el resumen de Checkout: Overview) 
Escenario crítico: compra exitosa (al finalizar desde Checkout: Overview se muestra "Thank you for your order!")

Corriendo OK!

- Reto 1:Optimización de Sesión

Explicación personal: 

- se debe crear el directorio .auth manual o mkdir -p .auth
- se debe crear la config para la autenticación de todos los test tests/auth.setup.ts para que este reutilice el login haciendo enfásis en que es distinto al test que valida el front del login
- Se actualiza el fixture de authenticatedInventory para que solo nevegue hacia el inventario
- se actualiza el playwright.config para que pueda consultar el archivo user.json que contiene el sesion y las cookies y que luego el proyecto de setup pueda hacer match con este archivo (ubique los datos)
- finalmente, al proyecto de chromium se le setea el storageState como dependencia que se consulta de user.json para que cargue siempre esas credenciales.
- Para corroborar esto, cuando el archivo user.json se presente, eliminarlo para notar la dif.
- valdiación adicional, si se ejecuta en paralelo reusa el login pero al ejecutar 1-1 los test es mejor validar que el archivo user.json exista para que en realidad si reuse la session. 


Reto 2:Mocking de Red

Explicación personal:

- se crean varios mocks con el contrato simulado por decir la url,el body 503 y HTML de la página.
- ese HTML tiene un botón que hace un fetch real al endpoint y muestra éxito o alerta según la respuesta.
- creamos el POM y se registra en el fixture de pages. (normal)
- en el test un page.route entrega el HTML de la página y otro responde el 503 con su body.
- con waitForResponse ahcemos el paso a validar el status 503, confirmando que la petición se ejecutó.
- finalmente se valida la alerta con el código NYXN-503 y el mensaje de éxito.
- como todo está mockeado, el test no depende del despliegue del backend.

3. Parte B: API & Data Testing Express (pytest / REST Assured / Jest)

En esta ocación no cuento con experiencia con Data Testing Express (pytest / REST Assured / Jest) pero me comprometo a nivelar a futuro. Sin embargo use Claude AI para resolver el ejercicio y este funciona pero soy conciente de que no domino el alcance del reto por lo que leer la implementación me permitió conocer de que se trata.

4. Bloque Avanzado: IA Generativa y Protocolo MCP (30 Minutos
recomendados)

Respuesta personal, anque, aún no he tenido la oportunidad de configurar el MCP para CI/CD, según 
entiendo esta puede ser una respuesta según investigación y lectura previa:

Al tener Claude Code contexto de todo el proyecto conectamos el GitHub MCP al logs del pipeline y Playwright MCP.
Puede ser con estos comandos: claude mcp add github ... y claude mcp add playwright -- npx @playwright/mcp@latest

Posible prompt: 

- "con el MCP de GitHub lee el log del último run fallido del workflow e2e."
- "compara el error con el DOM/JSON real (Playwright MCP) e identifica los selectores que cambiaron."
- "corrige SOLO los archivos de mapeo en pages/ y fixtures/, sin tocar aserciones ni lógica."
- "ejecuta npx playwright test, repite hasta que pasen y muéstrame la diferencia de los cambios."
- seguridad: trabajar en una rama y entregar PR; un humano revisa antes del merge.

Igual, aún no lo pongo en práctica porque no he tenido la oportunidad de configurar el MCP, pero me parece una herramienta muy interesante para optimizar el mantenimiento de los test y reducir el tiempo de diagnóstico y corrección de fallas en los test automatizados.

5. Diagnóstico de Rendimiento y Pipeline CI/CD

- Análisis de Carga (JMeter)

En esta ocación no cuento con experiencia con performance será un compromiso para nivelar a futuro.
Sin embargo, cuento con experiencia en SLAs, KPIs y metricas para medir el rendimiento de procesos o sistemas, y entiendo que JMeter es una herramienta popular para realizar pruebas de carga y rendimiento. 

AUNQUE, entendiendo el ejercicio, las metricas podrían ser:

1. Metrica 1: Percentil 95 del tiempo de respuesta (pct95 < 400 ms)
2. Metrica 2: Tasa de error (Error % = 0.0%)

- Mantenimiento de Pipeline como Código (YAML)

steps:
- uses: actions/checkout@v4
- name: Setup Node
- uses: actions/setup-node@v4
  with: { node-version: 20 }
- name: Run Tests

  run: npm ci && npx playwright test (puede ser cualquier comando que ejecute los test)
- name: Save Test Reports Artifacts
  if: always()  (garantiza que el step se ejecute aunque un paso anterior haya fallado)
  uses: actions/upload-artifact@v4 : (este permite subir los reportes generados por Playwright y Allure como artefactos del workflow, para que puedan ser descargados y revisados posteriormente)
    with:
      name: allure-results
      path: |
      playwright-report
      allure-results