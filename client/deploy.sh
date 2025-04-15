
    git pull
    docker-compose down
    docker-compose up -d
    docker exec ecommerce-client npm install --legacy-peer-deps
    # docker exec ecommerce-client npm run build
    # docker exec ecommerce-client npm run start
    