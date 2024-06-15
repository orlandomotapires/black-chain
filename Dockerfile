# Use a imagem base do Python 3.11
FROM python:3.11

# Defina o frontend do debconf como não interativo
ARG DEBIAN_FRONTEND=noninteractive

# Instala o apt-utils para configurações de pacotes
RUN apt-get update && apt-get install -y --no-install-recommends apt-utils

# Cria o diretório de trabalho dentro do container
WORKDIR /app

# Copia o arquivo requirements.txt para o diretório de trabalho
COPY requirements.txt .

# Instala as dependências especificadas no requirements.txt
RUN pip install -r requirements.txt

# Copia todos os arquivos da pasta 'backend' e 'frontend' para o diretório de trabalho
COPY ./backend/ ./backend/
COPY ./frontend/ ./frontend/

# Copia o arquivo main.py para o diretório de trabalho
COPY main.py .

# Comando para iniciar o servidor na porta 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
