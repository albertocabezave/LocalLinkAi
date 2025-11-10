#!/data/data/com.termux/files/usr/bin/bash
# guardar.sh - sube cambios a GitHub (dev 1.0)

# mensaje por defecto si no pasas uno como argumento
mensaje=${1:-"Actualización automática desde dev 1.0"}

# añadir todos los cambios
git add .

# intentar crear commit (si no hay cambios, git commit fallará)
git commit -m "$mensaje" || echo "⚠️ No hay cambios para commitear."

# push a la rama main
git push origin main || echo "❌ Push falló. Revisa tu conexión o credenciales."

# confirmar en consola
echo "✅ Ejecutado: git add . && git commit -m \"$mensaje\" && git push origin main"
