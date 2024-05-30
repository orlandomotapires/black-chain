#!/bin/bash

# Verificar se o script está sendo executado como root
if [[ $EUID -ne 0 ]]; then
    echo "Este script precisa ser executado como root"
    exit 1
fi

# Verificar a versão do Ubuntu
ubuntu_version=$(lsb_release -r | awk '{print $2}')

# Verificar a existência do Docker
if ! command -v docker &> /dev/null; then
    # Instalar Docker
    echo "Instalando Docker..."
    apt-get update
    apt-get install -y docker.io
    systemctl start docker
    systemctl enable docker
    echo "Docker instalado com sucesso."
else
    echo "Docker já está instalado."
fi

# Verificar a existência do Docker Compose
if ! command -v docker-compose &> /dev/null; then
    # Instalar Docker Compose
    echo "Instalando Docker Compose..."
    apt-get install -y docker-compose
    echo "Docker Compose instalado com sucesso."
else
    echo "Docker Compose já está instalado."
fi
