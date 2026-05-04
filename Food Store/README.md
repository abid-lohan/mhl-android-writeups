The app is a simple food delivery store. You can create an account, login and buy from the menu. It also has two different roles of users: **normal** and **pro**. The goal is to login as a pro user.

Looking at the decompiled code, we can see 3 activites.

![Activities](img/image.png)

### Exploiting SQLite Injection

The Signup activity has a method to register a new user into a database. It basically checks if any of the inputs (username, password, address) is null, create an instance of the class *User* and pass it to a method of DBHelper class.

![Register](img/image-1.png)

Notice that the Signup method throws SQLException, showing that it is using SQL somehow to store the user data.

Checking the addUser method from DBHelper, we can spot the vulnerability: SQLite injection.

![SQLite Injection](img/image-2.png)

We have user inputs being concatenated directly into a SQL query, this is of course an issue. I'm gonna inject into the "Username" variable because it is not encoded, so we can pass characters like ' directly.

Crafting the following payload (MTIz is 213 in base64):

```ruhp', 'MTIz', 'MTIz', 1);-- - ```

We should set our "isPro" to 1.

![Exploiting SQLi](img/image-3.png)

The password and the address inputs don't matter because they're gonna be commented anyway by the SQL injection above.

![Login](img/image-4.png)

![Pro User](img/image-5.png)

We logged in successfully as a Pro User, having 10000 credits by default.

### Exploiting Exported MainActivity

Another interesting fact is that the login is done sending an intent to MainActivity class, which is exported.

![Intent on the Code](img/image-6.png)

I'm gonna create a normal user to this new PoC.

![New Normal User](img/image-7.png)

Using frida, we can monitor every intent flowing in the app and confirm what we've discovered on static analysis (**intents.js**).

![Monitoring the Intents](img/image-8.png)

Finally, I'm gonna craft an intent to give *apollo* pro status and some more credit.

```am start -n com.mobilehackinglab.foodstore/com.mobilehackinglab.foodstore.MainActivity --ei USER_CREDIT 9999999 --ez IS_PRO_USER true --es USER_ADDRESS pwn --es USERNAME apollo```

![Sending Intent](img/image-9.png)

> P.S. The only LLM usage was a bit of help crafting the intents hooking script.