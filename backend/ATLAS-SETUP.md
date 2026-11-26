# MongoDB Atlas setup for BlogSpace

Use MongoDB Atlas to host the BlogSpace database in the cloud. The Atlas free deployment is suitable for learning and small development projects; check Atlas' current limits before using it for anything important.

## Create the free database

1. Open https://www.mongodb.com/cloud/atlas and create/sign in to your MongoDB account.
2. Create a new project named `BlogSpace`.
3. Choose **Build a Database** and select the **Free** deployment option (often shown as M0).
4. Choose a cloud provider and a region near your users, such as Mumbai if it is available.
5. Name the cluster `BlogSpaceCluster` and create it.

## Create a database user

1. In Atlas, open **Database Access**.
2. Add a database user, for example `blogspace_app`.
3. Choose a strong, unique password and save it in a password manager.
4. Give the user the minimum read/write access needed for the BlogSpace database (readWrite on the target database, if the UI offers database-specific roles).

This database user is separate from your MongoDB website login.

## Allow your development laptop

1. Open **Network Access** in Atlas.
2. Add your current laptop's public IP address.
3. Avoid allowing access from everywhere (0.0.0.0/0) for normal use. If your network IP changes, update the allowlist.

## Copy the connection string

1. Open **Database** / your cluster and click **Connect**.
2. Choose **Drivers** and select Node.js.
3. Copy the connection string. It looks similar to:

```text
mongodb+srv://<db_username>:<db_password>@<cluster-host>/<database-name>?retryWrites=true&w=majority
```

4. Replace the username, password and host placeholders with your actual values.
5. If the password contains special characters such as @, :, /, # or %, URL-encode those characters before putting the password in the URI.
6. Use `blogspace` as the database name in the path, for example `...mongodb.net/blogspace?retryWrites=true&w=majority`.

## Add it to the backend

1. In the local project, open the `backend` folder.
2. Copy `.env.example` and name the copy `.env`.
3. Put your Atlas URI in the `MONGODB_URI` value.
4. Set `JWT_SECRET` to a long random value (at least 32 characters).
5. Save the file. Do not upload `.env` to GitHub or send the connection string in chat.

Example shape only — do not copy the placeholder values:

```env
PORT=5000
CLIENT_ORIGIN=http://127.0.0.1:5500
MONGODB_URI=mongodb+srv://YOUR_USER:YOUR_ENCODED_PASSWORD@YOUR_CLUSTER.mongodb.net/blogspace?retryWrites=true&w=majority
JWT_SECRET=PUT_A_LONG_RANDOM_SECRET_HERE
JWT_EXPIRES_IN=1d
```

## Verify the connection

After installing Node.js and backend dependencies, start the API from the `backend` folder:

```bash
npm install
npm run dev
```

Open `http://localhost:5000/api/health`. A successful response should include `"status":"ok"` and `"database":"connected"`.

If the connection fails, check the URI, database username/password, IP allowlist and internet connection. Never paste your real URI or password into a public issue or GitHub commit.
