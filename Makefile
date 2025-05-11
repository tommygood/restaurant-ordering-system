install:
	cd backend && npm install & \
	cd frontend && npm install

up:
	cd backend && node index.js & \
	cd frontend && npm run serve
