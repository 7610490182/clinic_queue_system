# Local Development Setup Guide

If you're having issues with MongoDB Atlas, you can use local MongoDB for development.

## Option 1: Install MongoDB Locally (Recommended for Development)

### On Windows:
1. Download MongoDB Community Edition from https://www.mongodb.com/try/download/community
2. Run the installer and follow the setup wizard
3. MongoDB will be installed as a service and start automatically
4. Update your `.env` file:
   ```
   MONGO_URI=mongodb://localhost:27017/clinic-queue
   ```

### On macOS (Homebrew):
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```
Then update `.env`:
```
MONGO_URI=mongodb://localhost:27017/clinic-queue
```

### On Linux (Ubuntu/Debian):
```bash
sudo apt-get install -y mongodb
sudo systemctl start mongodb
```
Then update `.env`:
```
MONGO_URI=mongodb://localhost:27017/clinic-queue
```

## Option 2: Use Docker

```bash
# Pull and run MongoDB in Docker
docker run -d -p 27017:27017 --name clinic-mongo mongo:latest

# Update .env:
# MONGO_URI=mongodb://localhost:27017/clinic-queue
```

## Option 3: MongoDB Atlas (Cloud)

If you want to use MongoDB Atlas:

1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Create a database user and get connection string
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Update `.env` with connection string

If getting SSL/TLS errors:
- Try: `mongodb+srv://username:password@cluster.mongodb.net/clinic-queue?retryWrites=true&w=majority`
- Make sure credentials are URL-encoded if they contain special characters
- Check IP whitelist settings

## Testing the Connection

After setup, run the server:
```bash
cd server
npm run dev
```

You should see:
```
Server running on port: 5000
MongoDB connected successfully
```

If it fails, check:
1. Is MongoDB running? (`mongosh` should connect locally)
2. Is the connection string correct?
3. Are credentials correct (if using Atlas)?
4. Is the IP whitelisted (if using Atlas)?

## Seeding Sample Data

```bash
# With MongoDB running, seed the database:
cd server
npm run seed

# This will:
# - Create admin user (admin@clinic.com / admin123)
# - Create sample doctors
# - Create doctor user accounts
```

## Running the Full Application

Terminal 1 (Backend):
```bash
cd server
npm run dev
```

Terminal 2 (Frontend):
```bash
cd client
npm run dev
```

Then open http://localhost:5173 in your browser.

## Troubleshooting

### "MongoDB connection failed"
- Check if MongoDB service is running
- For local: run `mongosh` to test connection
- For Atlas: check IP whitelist and credentials

### "Cannot find module 'mongoose'"
```bash
cd server
npm install
```

### "CORS errors in browser console"
- Make sure backend is running on port 5000
- Check `CLIENT_URL` in backend `.env`

### "API calls returning 404"
- Check if Vite proxy is configured (it should be in `vite.config.js`)
- Backend and frontend must be running simultaneously

### "Login not working"
- Check MongoDB has sample users (run `npm run seed`)
- Check JWT_SECRET is set in `.env`
- Check browser console for specific error messages

## Development Tips

1. **Database GUI**: Use MongoDB Compass to browse your data
   - Download from https://www.mongodb.com/products/compass
   - Connect to `mongodb://localhost:27017`

2. **API Testing**: Use Postman or VS Code REST Client
   - Test endpoints like `POST http://localhost:5000/api/auth/login`

3. **Socket.io Testing**: Open browser DevTools Network tab and look for WebSocket connections to localhost:5000

4. **Debugging**: Check browser console and backend terminal for detailed error messages
