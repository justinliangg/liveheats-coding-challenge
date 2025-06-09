## Liveheats coding challenge

![Demo GIF](docs/assets/demo.gif)

## 🚀 Quick Start

> **Note**: You will need Docker installed before proceeding.

```bash
# Copy client env
cp ./client/.env.example ./client/.env

# Copy server env
cp ./server/.env.example ./server/.env

# Start docker
docker compose up

# View the app on localhost:3000
```

## 🛠️ Technologies Used

### Frontend

- **React** (with **Next.js**)
- **ShadCN** & **TailwindCSS**
- **Jest** & **React Testing Library**

### Backend

- **NestJS**
- **PostgreSQL**
- **Prisma**
- **Jest**

## 🧪 Testing

This project follows the [Testing Trophy 🏆](https://kentcdodds.com/blog/the-testing-trophy-and-testing-classifications) philosophy.

### 🔧 Running Tests

**Frontend:**

```bash
cd ./client
npm install

# Run tests
npm run test
```

**Backend:**

```bash
cd ./server
npm install

# Run integration tests
npm run test:integration

# Run unit tests
npm run test:unit
```
