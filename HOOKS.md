# Git Hooks Configuration

Este proyecto utiliza Husky y Commitlint para mantener la calidad del código y los commits.

## Hooks Configurados

### commit-msg
Valida el formato de los mensajes de commit según la convención de commits de Google/Conventional Commits.

**Formato requerido:**
```
<tipo>(<scope>): <descripción>

[cuerpo opcional]

[footer opcional]
```

**Tipos permitidos:**
- `feat`: Nueva funcionalidad
- `fix`: Corrección de bug
- `docs`: Cambios en documentación
- `style`: Cambios de formato (sin afectar código)
- `refactor`: Refactorización de código
- `perf`: Mejoras de rendimiento
- `test`: Añadir o corregir tests
- `build`: Cambios en el sistema de build
- `ci`: Cambios en CI/CD
- `chore`: Otras tareas (dependencias, etc)
- `revert`: Revertir un commit anterior

**Ejemplos válidos:**
```bash
git commit -m "feat: añadir botón de compra"
git commit -m "fix(cart): corregir cálculo de precio total"
git commit -m "docs: actualizar README con instrucciones"
```

**Ejemplos inválidos:**
```bash
git commit -m "Añadir botón"  # ❌ Falta tipo
git commit -m "FEAT: nueva funcionalidad"  # ❌ Tipo en mayúsculas
git commit -m "feat: Añadir botón."  # ❌ Descripción con mayúscula y punto final
```

### pre-commit
Ejecuta el linter (`npm run lint`) antes de cada commit para asegurar que el código cumple con los estándares de estilo.

### pre-push
Ejecuta los tests (`npm run test`) y el build (`npm run build`) antes de hacer push para asegurar que el código funciona correctamente.

## Instalación

Los hooks se instalan automáticamente al ejecutar `npm install` gracias al script `prepare` en `package.json`.

Para instalarlos manualmente:
```bash
npm run prepare
```

## Desactivar temporalmente

Si necesitas hacer un commit sin validación (no recomendado):
```bash
git commit --no-verify -m "mensaje"
```
