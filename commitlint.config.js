module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Tipos permitidos (alineados con convención de Google)
    'type-enum': [
      2,
      'always',
      [
        'feat',     // Nueva funcionalidad
        'fix',      // Corrección de bug
        'docs',     // Cambios en documentación
        'style',    // Cambios de formato (sin afectar código)
        'refactor', // Refactorización de código
        'perf',     // Mejoras de rendimiento
        'test',     // Añadir o corregir tests
        'build',    // Cambios en el sistema de build
        'ci',       // Cambios en CI/CD
        'chore',    // Otras tareas (dependencias, etc)
        'revert'    // Revertir un commit anterior
      ]
    ],
    // El tipo debe estar en minúsculas
    'type-case': [2, 'always', 'lower-case'],
    // El tipo es obligatorio
    'type-empty': [2, 'never'],
    // El scope es opcional pero si se usa debe estar en lower-case
    'scope-case': [2, 'always', 'lower-case'],
    // El subject (mensaje) es obligatorio
    'subject-empty': [2, 'never'],
    // El subject no debe terminar con punto
    'subject-full-stop': [2, 'never', '.'],
    // El subject debe empezar en minúscula
    'subject-case': [2, 'always', 'lower-case'],
    // Longitud máxima del header (tipo + scope + subject)
    'header-max-length': [2, 'always', 100],
    // El body debe tener una línea en blanco antes
    'body-leading-blank': [2, 'always'],
    // El footer debe tener una línea en blanco antes
    'footer-leading-blank': [2, 'always']
  }
};
