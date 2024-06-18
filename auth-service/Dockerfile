# Use a imagem oficial do Node.js como base
FROM node:latest

# Defina o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copie os arquivos necessários para o contêiner (package.json e package-lock.json primeiro para aproveitar o cache)
COPY package.json .
COPY package-lock.json .

# Instale as dependências do projeto
RUN npm install

# Copie os arquivos restantes para o diretório de trabalho
COPY . .

# Instale o cliente PostgreSQL para execução de scripts SQL
RUN apt-get update && apt-get install -y postgresql-client

# Variáveis de ambiente para o PostgreSQL
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=123
ENV POSTGRES_DB=blackchain
ENV POSTGRES_HOST=postgres  
ENV POSTGRES_PORT=5436  

# Aguarde até que o banco de dados esteja disponível antes de executar os scripts SQL
CMD ["node", "index.js"]

# Exponha a porta em que a aplicação Express vai rodar
EXPOSE 8001
