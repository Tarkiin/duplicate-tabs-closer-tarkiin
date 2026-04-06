# Duplicate Tabs Manager - Mantenido por Tarkin

![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-blue?logo=google-chrome)
![Manifest V3](https://img.shields.io/badge/Manifest-V3-green)
![Version](https://img.shields.io/badge/version-3.5.3-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)

Una extensión de Chrome potente y eficiente para detectar y cerrar pestañas duplicadas automáticamente, manteniendo tu navegador organizado y optimizando el rendimiento.

## 🚀 Características

### Funcionalidades Principales

- **Detección Automática**: Identifica pestañas duplicadas en tiempo real
- **Cierre Inteligente**: Cierra automáticamente las pestañas duplicadas según tus preferencias
- **Múltiples Criterios**: Compara por URL, título, o ambos
- **Gestión de Pestañas Fijadas**: Protección especial para pestañas ancladas
- **Lista Blanca/Negra**: Excluye o incluye sitios específicos
- **Indicador Visual**: Badge que muestra el número de pestañas duplicadas

### Opciones de Configuración

- **Modo Compacto**: Interfaz minimalista
- **Criterios de Comparación**:
  - Ignorar fragmentos (#)
  - Ignorar parámetros de búsqueda (?)
  - Ignorar rutas
  - Ignorar www/subdominios
  - Comparación insensible a mayúsculas
- **Prioridades de Pestañas**:
  - Mantener por antigüedad (más antigua/más nueva)
  - Priorizar HTTPS sobre HTTP
  - Proteger pestañas con historial
  - Proteger pestañas fijadas

### Ámbitos de Acción

- **Ventana Actual**: Solo en la ventana activa
- **Todas las Ventanas**: En todo el navegador

## 📦 Instalación

### Desde Chrome Web Store

1. Visita la [Chrome Web Store](chrome-web-store-link)
2. Haz clic en "Añadir a Chrome"
3. Confirma la instalación

### Instalación Manual (Desarrolladores)

1. Descarga o clona este repositorio
2. Abre Chrome y ve a `chrome://extensions/`
3. Activa el "Modo de desarrollador"
4. Haz clic en "Cargar extensión sin empaquetar"
5. Selecciona la carpeta del proyecto

## 🎯 Uso

### Acceso Rápido

- **Icono de la Extensión**: Haz clic para abrir el popup principal
- **Atajo de Teclado**: `Alt+Shift+W` para cerrar duplicados rápidamente
- **Badge**: Muestra el número de pestañas duplicadas detectadas

### Configuración

1. Haz clic derecho en el icono de la extensión
2. Selecciona "Opciones"
3. Configura tus preferencias:
   - Criterios de detección
   - Comportamiento al detectar duplicados
   - Listas blanca y negra
   - Colores del badge

### Funciones del Popup

- **Vista de Pestañas**: Lista todas las pestañas con duplicados detectados
- **Cerrar Duplicados**: Botón para cerrar automáticamente
- **Configuración Rápida**: Acceso a opciones principales

## ⚙️ Configuración Avanzada

### Listas Blanca y Negra

```
# Lista Blanca (sitios a ignorar)
example.com
*.google.com
localhost:*

# Lista Negra (sitios a procesar)
*.facebook.com
*.twitter.com
```

### Patrones de URL

- `*` coincide con cualquier carácter
- `*.dominio.com` coincide con todos los subdominios
- `dominio.com/*` coincide con todas las rutas

## 🛠️ Tecnologías

- **Manifest V3**: Última versión del sistema de extensiones de Chrome
- **JavaScript ES6+**: Código moderno y eficiente
- **Chrome APIs**:
  - `chrome.tabs`: Gestión de pestañas
  - `chrome.storage`: Almacenamiento de configuración
  - `chrome.webNavigation`: Detección de navegación
- **Bootstrap 4.5**: Interfaz responsive
- **Font Awesome 4.7**: Iconografía
- **jQuery 3.5.1**: Manipulación DOM

## 📁 Estructura del Proyecto

```
├── manifest.json          # Configuración de la extensión
├── background.js          # Service Worker principal
├── popup/                 # Interfaz del popup
│   ├── popup.html
│   ├── popup.js
│   └── popup.css
├── optionPage/           # Página de opciones
│   ├── optionPage.html
│   ├── optionPage.js
│   └── optionPage.css
├── _locales/             # Internacionalización
│   ├── en/
│   ├── es/
│   ├── fr/
│   └── ...
├── images/               # Recursos gráficos
├── ext_lib/              # Librerías externas
└── helper.js             # Funciones auxiliares
```

## 🌍 Idiomas Soportados

- 🇺🇸 English
- 🇫🇷 Français
- 🇯🇵 日本語
- 🇷🇺 Русский
- 🇺🇦 Українська
- 🇨🇳 中文 (简体)

## 🔧 Desarrollo

### Requisitos

- Chrome/Chromium 88+
- Node.js (para desarrollo)

### Comandos de Desarrollo

```bash
# Clonar repositorio
git clone https://github.com/Tarkin/duplicate-tabs-closer-Tarkin.git
cd duplicate-tabs-closer-Tarkin

# Cargar en Chrome
# 1. Ir a chrome://extensions/
# 2. Activar modo desarrollador
# 3. Cargar extensión sin empaquetar
```

### Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Añadir nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📝 Changelog

### v3.5.3 (Actual)

- ✅ Migración completa a Manifest V3
- ✅ Corrección de APIs deprecadas
- ✅ Optimización de rendimiento
- ✅ Mejoras en la detección de duplicados

### Versiones Anteriores

- **v3.5.x**: Mejoras en la interfaz y corrección de bugs
- **v3.4.x**: Añadido soporte para listas blanca/negra
- **v3.3.x**: Implementación de criterios avanzados de comparación

## 🐛 Problemas Conocidos

- En algunas versiones de Chrome, el badge puede no actualizarse inmediatamente
- La detección en pestañas con contenido dinámico puede tener ligeros retrasos

## 📞 Soporte

- **Issues**: [GitHub Issues](https://github.com/Tarkin/duplicate-tabs-closer-Tarkin/issues)
- **Documentación**: [Wiki del Proyecto](https://github.com/Tarkin/duplicate-tabs-closer-Tarkin/wiki)
- **Email**: [EMAIL_ADDRESS]

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 👥 Créditos

### Desarrollador Original

- **Peuj** - Desarrollo inicial

### Mantenimiento Actual

- **Tarkin** - Migración a Manifest V3, mejoras y mantenimiento

### Contribuidores

- Comunidad de usuarios por reportes de bugs y sugerencias
- Traductores voluntarios para la internacionalización

## 🌟 Agradecimientos

- A la comunidad de Chrome Extensions por la documentación
- A los usuarios que han proporcionado feedback valioso
- A los beta testers que ayudaron en la migración a Manifest V3

---

**¿Te gusta esta extensión?** ⭐ ¡Dale una estrella al repositorio y compártela con otros!

**¿Encontraste un bug?** 🐛 [Reporta el problema aquí](https://github.com/Tarkin/duplicate-tabs-closer-Tarkin/issues/new)

**¿Tienes una idea?** 💡 [Sugiere una nueva funcionalidad](https://github.com/Tarkin/duplicate-tabs-closer-Tarkin/issues/new?template=feature_request.md)
