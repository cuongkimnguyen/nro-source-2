# Deploy on Rocky 8.8 with Docker Compose

## 1. Prepare environment
```bash
sudo dnf install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
sudo systemctl enable --now docker
sudo usermod -aG docker $USER
newgrp docker
```

## 2. Configure environment
```bash
cp .env.example .env
# edit .env and set SERVER_IP to your public IP
```

## 3. Build and run
```bash
docker compose up -d --build
```

## 4. Check logs
```bash
docker compose logs -f db
docker compose logs -f app
```

## Notes
- The SQL file `sql/nro1.sql` is imported automatically only on the first initialization of the MySQL data volume.
- If you need to re-import from scratch:
```bash
docker compose down -v
docker compose up -d --build
```
- App restart is handled by Docker restart policy.


## Maven build locally
```bash
mvn clean package -DskipTests
java -jar target/NgocRongOnline.jar
```

## Docker build flow
- App image now uses a multi-stage build: Maven compiles/package in the builder stage, then the runtime image only keeps the shaded JAR and config files.
