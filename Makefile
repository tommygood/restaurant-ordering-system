api-key := $(shell grep API_KEY backend/.env | cut -d '=' -f2)

install:
	cd backend && npm install & \
	cd frontend && npm install

up:
	cd backend && node index.js & \
	cd frontend && npm run start

get-orders:
	curl -k -s -H "x-api-key: $(api-key)" https://localhost:8002/api/cartItem | jq

get-orders-http:
	curl -s -H "x-api-key: $(api-key)" http://localhost:8001/api/cartItem | jq

user_id=11
food_id=4

delete-order:
	curl -s -X DELETE http://localhost:8001/api/cartItem/$(user_id)/${food_id} -H "Content-Type: application/json" -H "x-api-key: $(api-key)"

put-order:
	curl -s -X PUT http://localhost:8001/api/cartItem -H "Content-Type: application/json" -H "x-api-key: $(api-key)" -d '{"user_id":11,"food_id":4,"item_qty":0}'

create-crt:
	openssl req -nodes -new -x509 -keyout backned/server.key -out backend/server.crt -days 365
