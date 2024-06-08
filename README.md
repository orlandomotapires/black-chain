# BlackJack Game

Este é um jogo de BlackJack simples desenvolvido usando Flask no backend e JavaScript no frontend. O jogo permite que os jogadores joguem BlackJack e gerenciem seus NFTs.

## Estrutura do Projeto

- `backend/`
  - `Player.py`: Definição da classe `Player` para gerenciar os jogadores.
  - `blackjack.py`: Implementação do servidor XML-RPC que gerencia a lógica do jogo.
  - `client.py`: Cliente que consome o blackjack de maneira local no terminal para testes

- `frontend/`
  - `index.html`: Arquivo HTML principal.
  - `styles.css`: Arquivo CSS para estilizar a interface do jogo.
  - `script.js`: Arquivo JavaScript para a lógica do frontend.

- `app.py`: Arquivo principal do Flask para iniciar o servidor web.

## Configuração e Execução

### Requisitos

- Python 3.8+
- Flask
- Flask-CORS

### Instalação

1. Clone o repositório:

   ```sh
   git clone https://github.com/seu-usuario/seu-repositorio.git
   cd seu-repositorio
   ```

2. Crie um ambiente virtual e ative-o:

   ```sh
   python -m venv venv
   source venv/bin/activate  # No Windows use `venv\Scripts\activate`
   ```

3. Instale as dependências:

   ```sh
   pip install -r requirements.txt
   ```

### Execução do Servidor

1. Inicie o servidor XML-RPC:

   ```sh
   python backend/blackjack_server.py
   ```

2. Em outro terminal, inicie o servidor Flask:

   ```sh
   python app.py
   ```

3. Abra o navegador e vá para `http://localhost:5000` para acessar o jogo.

## Funcionalidades

- Iniciar o jogo com um ID de jogador.
- Visualizar detalhes do jogador.
- Jogar BlackJack (HIT e STAND).
- Verificar o resultado do jogo.
- Resetar o jogo para uma nova partida.

## Rotas da API

- `GET /`: Rota principal para carregar a página do jogo.
- `POST /get_player_by_id`: Obtém detalhes do jogador por ID.
- `POST /start_game`: Inicia um novo jogo para o jogador.
- `GET /client_throw_card`: Adiciona uma carta à mão do jogador.
- `GET /stand`: Finaliza o turno do jogador e calcula o resultado.
- `POST /reset_game`: Reseta o jogo para o jogador.

## Contribuição

Sinta-se à vontade para contribuir com melhorias ou correções. Para contribuir:

1. Fork o repositório.
2. Crie uma branch para sua feature (`git checkout -b feature/sua-feature`).
3. Commit suas alterações (`git commit -m 'Adiciona uma nova feature'`).
4. Push para a branch (`git push origin feature/sua-feature`).
5. Abra um Pull Request.

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para mais detalhes.

Este `README.md` cobre a estrutura do projeto, instruções de instalação e execução, principais funcionalidades, rotas da API e informações sobre como contribuir. Ajuste conforme necessário para refletir melhor o seu projeto.