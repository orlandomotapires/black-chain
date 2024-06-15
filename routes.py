from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import JSONResponse, HTMLResponse, Response
from pathlib import Path
import xmlrpc.client
from fastapi.templating import Jinja2Templates
from backend.Player import Player

# Criando um router para agrupar todas as rotas relacionadas ao blackjack
blackjack_bp = APIRouter()

# Configuração do cliente XML-RPC
try:
    BlackJack = xmlrpc.client.ServerProxy("http://localhost:8080")
except Exception as e:
    print(f"Erro ao conectar ao servidor RPC: {e}")

# Configuração dos templates Jinja2
templates = Jinja2Templates(directory="./frontend")

# Rota para servir o index.html
@blackjack_bp.get("/", response_class=HTMLResponse)
async def index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request, "css": "/styles.css", "js": "/script.js"})

# Rota para servir o game.html
@blackjack_bp.get("/game", response_class=HTMLResponse)
async def game(request: Request):
    return templates.TemplateResponse("game.html", {"request": request, "css": "/styles.css", "js": "/script.js"})

# Rota para servir o arquivo styles.css
@blackjack_bp.get("/styles.css")
async def styles():
    css_path = Path("./frontend/styles.css")
    if not css_path.is_file():
        raise HTTPException(status_code=404, detail="CSS file not found")
    with css_path.open() as f:
        css_content = f.read()
    return Response(content=css_content, media_type="text/css")

# Rota para servir o arquivo script.js
@blackjack_bp.get("/script.js")
async def script():
    js_path = Path("./frontend/script.js")
    if not js_path.is_file():
        raise HTTPException(status_code=404, detail="JS file not found")
    with js_path.open() as f:
        js_content = f.read()
    return Response(content=js_content, media_type="application/javascript")

# Rota para buscar jogador por ID
@blackjack_bp.post("/get_player_by_id")
async def get_player_by_id(request: Request):
    data = await request.json()
    player_id = int(data["player_id"])
    player = Player.get_player_by_id(player_id)
    return JSONResponse(content=player)

# Rota para iniciar o jogo
@blackjack_bp.post("/start_game")
async def start_game(request: Request):
    data = await request.json()
    player_id = data["player_id"]
    result = BlackJack.start_game(int(player_id))
    return JSONResponse(content=result)

# Rota para o cliente jogar uma carta
@blackjack_bp.get("/client_throw_card")
async def client_throw_card():
    client_hand = BlackJack.client_throw_card()
    client_hand_sum = BlackJack.client_hand_sum()  # Obter a soma da mão do servidor
    dealer_message = BlackJack.get_message(client_hand_sum)
    result = {
        'player_hand_sum': client_hand_sum,
        'player_hand': client_hand,
        'dealer_message': dealer_message
    }
    return JSONResponse(content=result)

# Rota para o cliente ficar (stand)
@blackjack_bp.get("/stand")
async def stand():
    result = BlackJack.get_feed()
    return JSONResponse(content=result)

# Rota para resetar o jogo
@blackjack_bp.post("/reset_game")
async def reset_game(request: Request):
    data = await request.json()
    player_id = data["player_id"]
    result = BlackJack.start_game(int(player_id))
    return JSONResponse(content=result)

# Rota para atualizar a quantidade de NFT
@blackjack_bp.put("/update_nft_amount")
async def update_nft_amount():
    result = BlackJack.get_winner()
    return JSONResponse(content=result)
