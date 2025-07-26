#!/bin/bash
# Script per avviare l'app completa

echo "🚀 === AVVIO EXPENSE TRACKER ==="

# Installa dipendenze se necessario
if [ ! -d "node_modules" ]; then
    echo "📦 Installazione dipendenze backend..."
    npm install
fi

if [ ! -d "client/node_modules" ]; then
    echo "📦 Installazione dipendenze frontend..."
    cd client && npm install && cd ..
fi

# Avvia backend in background
echo "🔧 Avvio server backend..."
npm run dev &
BACKEND_PID=$!

# Aspetta che il backend si avvii
sleep 3

# Avvia frontend
echo "🎨 Avvio frontend..."
cd client && npm run dev &
FRONTEND_PID=$!

echo "✅ App avviata!"
echo "🌐 Backend: http://localhost:3000"
echo "🎨 Frontend: http://localhost:5173"
echo ""
echo "Premi Ctrl+C per fermare l'app"

# Gestione chiusura
trap "echo '🛑 Chiusura app...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT

# Mantieni script attivo
wait
