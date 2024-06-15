from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import blackjack_bp
import uvicorn

app = FastAPI()

# Configuração do CORS para permitir de qualquer origem
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permitir de qualquer origem
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT"],
    allow_headers=["*"],
)

# Registro do roteador
app.include_router(blackjack_bp)

# Comando para iniciar o servidor na porta 5000 com Uvicorn
if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=5000, log_level="info")
