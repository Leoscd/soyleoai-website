Realizá una auditoría de seguridad de SoyLeoAI.com.

## Pasos a seguir:

1. **Lee vercel.json** — verificá que existan estos headers:
   - Content-Security-Policy (CSP)
   - X-Frame-Options: DENY o SAMEORIGIN
   - X-Content-Type-Options: nosniff
   - Referrer-Policy
   - Permissions-Policy
   - Strict-Transport-Security (HSTS)

2. **Lee index.html** y buscá:
   - Credenciales o API keys hardcodeadas (excepto Web3Forms access key que es pública por diseño)
   - Scripts externos de terceros sin integrity hash (SRI)
   - Formularios sin validación del lado cliente
   - URLs http:// (no seguras)

3. **Lee .gitignore** — verificá que excluya:
   - .env.local
   - .vercel/
   - node_modules/

4. **Generá reporte** con niveles:
   - 🔴 CRÍTICO: exposición de datos sensibles
   - 🟡 MEDIO: headers faltantes o configuración débil
   - 🟢 BAJO: mejoras opcionales de hardening

5. **Recomendá fixes específicos** para cada problema encontrado.
