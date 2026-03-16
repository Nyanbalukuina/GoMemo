
# 🚀 Project Setup Guide

### 1. Requirements (前提条件)
* **WSL2** (Windows)
* **Docker Desktop** (WSL Integration: ON)
* **Git**

---

### 2. Quick Start (起動手順)
WSLターミナルで以下のコマンドを順番に実行してください。

```bash
# 1️⃣ Clone project
git clone [https://github.com/Nyanbalukuina/GoMemo.git](https://github.com/Nyanbalukuina/GoMemo.git)
cd GoMemo

# 2️⃣ Create .env file
cp .env.example .env

# 3️⃣ Edit .env (Open with VS Code or nano)
# ⚠️ Set your Proxy/DB settings
nano .env

# 4️⃣ Build and Start
docker compose up -d --build

```

---

### 3. Service URL (アクセス先)

| Service | URL |
| --- | --- |
| **🌐 Frontend** | [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) |
| **⚙️ Backend (API)** | [http://localhost:8080](https://www.google.com/search?q=http://localhost:8080) |
| **🗄️ Adminer (DB)** | [http://localhost:8081](https://www.google.com/search?q=http://localhost:8081) |

---

### 4. DB Reset (DBの初期化)

If you want to **delete all data**, run these:

```bash
# Stop and Remove data
docker compose down -v
sudo rm -rf ./pgdata

# Restart
docker compose up -d

```

---

### ⚠️ Important (注意)

* **`.env`**: Do NOT commit this file. (Security!)
* **`pgdata`**: Needs `sudo` to delete.

