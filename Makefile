api-key := $(shell grep API_KEY backend/.env | cut -d '=' -f2)

install:
	cd backend && npm install & \
	cd frontend && npm install

up:
	cd backend && node index.js & \
	cd frontend && npm run serve

get-orders:
	curl -s -H "x-api-key: $(api-key)" http://localhost:8001/api/cartItem | jq

put-orders:
	curl -s -X PUT http://localhost:8001/api/cartItem -H "Content-Type: application/json" -H "x-api-key: $(api-key)" -d '{"user_id":4,"food_id":6,"item_qty":0}'
