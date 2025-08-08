Thanks for sharing the session output.

The error:

```
MongoServerError[AuthenticationFailed]: Authentication failed.
```

means that **the user `admin` either doesn’t exist yet**, or **you’re not in the correct database (`admin`) when trying to authenticate**.

---

### ✅ Solution: Create the `admin` user **first**, and authenticate **in the correct database context**.

### Step-by-step Fix:

#### 1. First, switch to the `admin` database:

```js
use admin
```

#### 2. Then create the `admin` user:

```js
db.createUser({
  user: "admin",
  pwd: "password123",
  roles: [ { role: "root", db: "admin" } ]
})
```

✅ If successful, you’ll see something like:

```js
{ ok: 1 }
```

---

### 3. Try to authenticate again:

```js
db.auth("admin", "password123")
```

✅ Expected output:

```js
1
```

(A return value of `1` means authentication succeeded.)

---

### 🔐 Bonus: Enabling Auth Later (after testing)

If you want to enable access control so only authenticated users can connect:

1. Edit the config:

```bash
sudo nano /etc/mongod.conf
```

2. Add or uncomment:

```yaml
security:
  authorization: enabled
```

3. Then restart MongoDB:

```bash
sudo systemctl restart mongod
```

4. login with neyo

```bash
mongosh -u neyo -p 'neyo@53669' --authenticationDatabase blog-db
```



Let me know if you'd like a full `.js` script or want to proceed with creating a database user for your app (`neyo`).
