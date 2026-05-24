# Prototipo de queratitis herpética — despliegue en Vercel

Caso clínico interactivo de paciente simulado por IA. Parte del proyecto de educación
basada en competencias en oftalmología para médicos generales de habla hispana.

## Estructura

- `index.html` — Frontend (HTML/CSS/JS autocontenido, sin dependencias externas).
- `api/ask-claude.js` — Función serverless que actúa de proxy seguro a la API de Anthropic.
- `vercel.json` — Configuración de Vercel (timeout extendido para llamadas a la IA).

## Variables de entorno requeridas

En la configuración del proyecto en Vercel, definir:

- `ANTHROPIC_API_KEY` — Clave de la API de Anthropic (obtener en https://console.anthropic.com).

## Modelo usado

Claude Sonnet 4.6. Coste aproximado por encuentro completo: USD 0.03–0.08.

## Despliegue

Ver la guía completa en `guia_despliegue_vercel.docx` en la carpeta del proyecto.
