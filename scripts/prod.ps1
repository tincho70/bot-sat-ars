$j = Get-Content package.json | ConvertFrom-Json

$TAG = $j.version

docker compose -f docker-compose.prod.yml build
docker tag tincho70/bot-sat-ars:latest tincho70/bot-sat-ars:$TAG
docker push tincho70/bot-sat-ars:latest
docker push tincho70/bot-sat-ars:$TAG