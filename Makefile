# Makefile para gerenciar volumes Docker
.PHONY: help backup restore up down clean logs status

# Variáveis
POSTGRES_VOLUME = dotgo-data
MINIO_VOLUME = minio_data
BACKUP_DIR = ./backups
COMPOSE_FILE = docker-compose.yml

# Comando padrão (quando você digita apenas 'make')
help:
	@echo "Comandos disponíveis:"
	@echo "  make backup   - Fazer backup dos volumes"
	@echo "  make restore  - Restaurar volumes do backup"
	@echo "  make up       - Subir aplicação (com restore automático)"
	@echo "  make down     - Parar aplicação"
	@echo "  make clean    - Limpar volumes e containers"
	@echo "  make logs     - Ver logs dos containers"
	@echo "  make status   - Ver status dos containers"

# Criar diretório de backup
$(BACKUP_DIR):
	mkdir -p $(BACKUP_DIR)

# Fazer backup dos volumes
backup: $(BACKUP_DIR)
	@echo "🔄 Fazendo backup dos volumes..."
	@echo "📦 Backup PostgreSQL..."
	docker run --rm \
		-v $(POSTGRES_VOLUME):/data \
		-v $(PWD)/$(BACKUP_DIR):/backup \
		alpine tar -czf /backup/postgres-$(shell date +%Y%m%d_%H%M%S).tar.gz -C /data .
	@echo "📦 Backup MinIO..."
	docker run --rm \
		-v $(MINIO_VOLUME):/data \
		-v $(PWD)/$(BACKUP_DIR):/backup \
		alpine tar -czf /backup/minio-$(shell date +%Y%m%d_%H%M%S).tar.gz -C /data .
	@echo "✅ Backup concluído! Arquivos em $(BACKUP_DIR)/"

# Restaurar volumes (usa o backup mais recente)
restore: $(BACKUP_DIR)
	@echo "🔄 Restaurando volumes..."
	@echo "📁 Criando volumes se não existirem..."
	docker volume create $(POSTGRES_VOLUME) || true
	docker volume create $(MINIO_VOLUME) || true
	@echo "📦 Restaurando PostgreSQL..."
	docker run --rm \
		-v $(POSTGRES_VOLUME):/data \
		-v $(PWD)/$(BACKUP_DIR):/backup \
		alpine sh -c "cd /data && tar -xzf /backup/$$(ls -t /backup/postgres-*.tar.gz | head -1)"
	@echo "📦 Restaurando MinIO..."
	docker run --rm \
		-v $(MINIO_VOLUME):/data \
		-v $(PWD)/$(BACKUP_DIR):/backup \
		alpine sh -c "cd /data && tar -xzf /backup/$$(ls -t /backup/minio-*.tar.gz | head -1)"
	@echo "✅ Restauração concluída!"

# Subir aplicação (com restore automático se houver backups)
up:
	@echo "🚀 Iniciando aplicação..."
	@if [ -d "$(BACKUP_DIR)" ] && [ "$$(ls -A $(BACKUP_DIR)/*.tar.gz 2>/dev/null)" ]; then \
		echo "📦 Backups encontrados, restaurando..."; \
		make restore; \
	fi
	@echo "🐳 Subindo containers..."
	docker-compose -f $(COMPOSE_FILE) up -d
	@echo "✅ Aplicação iniciada!"
	@make status

# Parar aplicação
down:
	@echo "🛑 Parando aplicação..."
	docker-compose -f $(COMPOSE_FILE) down
	@echo "✅ Aplicação parada!"

# Limpar tudo (CUIDADO!)
clean:
	@echo "⚠️  ATENÇÃO: Isso vai remover TODOS os containers, volumes e imagens!"
	@read -p "Tem certeza? (y/N): " confirm && [ "$$confirm" = "y" ]
	@echo "🧹 Fazendo backup antes de limpar..."
	@make backup
	@echo "🗑️  Removendo containers..."
	docker-compose -f $(COMPOSE_FILE) down -v --remove-orphans
	@echo "🗑️  Removendo volumes..."
	docker volume rm $(POSTGRES_VOLUME) $(MINIO_VOLUME) || true
	@echo "✅ Limpeza concluída!"

# Ver logs
logs:
	docker-compose -f $(COMPOSE_FILE) logs -f

# Ver status
status:
	@echo "📊 Status dos containers:"
	docker-compose -f $(COMPOSE_FILE) ps
	@echo ""
	@echo "💾 Status dos volumes:"
	docker volume ls | grep -E "($(POSTGRES_VOLUME)|$(MINIO_VOLUME))" || echo "Nenhum volume encontrado"
	@echo ""
	@echo "📦 Backups disponíveis:"
	@ls -la $(BACKUP_DIR)/*.tar.gz 2>/dev/null || echo "Nenhum backup encontrado"
