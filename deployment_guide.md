# 🚀 Deployment Guide — Smart Food Rescue (FeedLink AI)

Follow these steps to upload your code to GitHub and deploy it to a live production environment.

---

## 🛠 Step 1: Push to GitHub

1. **Initialize Git**:
   Open your terminal in the root directory (`c:\food-rescue`) and run:
   ```powershell
   git init
   git add .
   git commit -m "Initial commit: Premium Smart Food Rescue Platform"
   ```

2. **Create a GitHub Repo**:
   - Go to [GitHub](https://github.com/new) and create a new repository named `smart-food-rescue`.
   - Copy the remote URL (e.g., `https://github.com/your-username/smart-food-rescue.git`).

3. **Push Code**:
   ```powershell
   git remote add origin YOUR_GITHUB_URL
   git branch -M main
   git push -u origin main
   ```

---

## 💾 Step 2: Set Up MongoDB Atlas (Cloud Database)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a new **Cluster** (Shared/Free Tier).
3. Under **Database Access**, create a user with a username and password.
4. Under **Network Access**, click "Add IP Address" and select **Allow Access from Anywhere** (0.0.0.0/0).
5. Click **Connect** -> **Connect your application** and copy the **Connection String** (URI).
   - It looks like: `mongodb+srv://<username>:<password>@cluster0.mongodb.net/food-rescue?retryWrites=true&w=majority`

---

## 🌐 Step 3: Deploy Backend (Render)

1. Create an account at [Render](https://render.com/).
2. Click **New +** -> **Web Service**.
3. Connect your GitHub repository.
4. Configure the service:
   - **Name**: `food-rescue-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && node server.js`
5. **Environment Variables** (Very Important):
   Add the following in the Render "Environment" tab:
   - `MONGO_URI`: (Your MongoDB Atlas connection string)
   - `JWT_SECRET`: (Any random long string, e.g., `super-secret-key-123`)
   - `PORT`: `5000`
   - `ALLOWED_ORIGINS`: `https://your-frontend-url.vercel.app` (You will update this after Step 4)

---

## 🎨 Step 4: Deploy Frontend (Vercel)

1. Create an account at [Vercel](https://vercel.com/).
2. Click **Add New** -> **Project**.
3. Import your GitHub repository.
4. Configure the project:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `./` (Root)
5. **Environment Variables**:
   Add the following in Vercel:
   - `VITE_API_URL`: (The URL of your live Render backend, e.g., `https://food-rescue-backend.onrender.com`)
6. Click **Deploy**.

---

## 🔄 Step 5: Final Connection

Once Vercel gives you your frontend URL (e.g., `https://smart-food-rescue.vercel.app`):
1. Go back to **Render** -> **Environment**.
2. Update `ALLOWED_ORIGINS` to include your Vercel URL.
3. Save and restart the Render service.

---

### 💡 Pro-Tips for Hackathon Demo:
- **Seed the Database**: Run `node backend/seeds/seedData.js` locally while connected to your Atlas URI to populate the live site with demo data.
- **Keep-Alive**: Render free tier goes to sleep after 15 mins of inactivity. Use a free service like [UptimeRobot](https://uptimerobot.com/) to ping your `/health` endpoint every 5 minutes to keep it awake!
