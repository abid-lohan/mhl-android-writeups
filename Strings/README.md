# Strings

The interesting exported activity is the Activity2, which has some `getIntent` handling deeplinks.

Looking at the `onCreate` method, we can see that there is some conditions to be met in order to achieve `System.loadLibrary("flag")`.

![alt text](image.png)

The first `if` block has two conditions:
1. The activity has to be called with an `Intent` with the action `android.intent.action.VIEW`.
2. The value of `<string name="UUU0133"></string>` in `DAD4.xml` must be equal to `cd()` (the current date in the format dd/MM/yyyy).

![alt text](image-1.png)

So I created the shared preference manually to meet the condition.

```bash
echo '<?xml version="1.0" encoding="utf-8" standalone="yes" ?><map><string name="UUU0133">23/06/2026</string></map>' > /data/data/com.mobilehackinglab.challenge/shared_prefs/DAD4.xml
```

The next conditions are checking for the activity to be called with the data `mhl://labs/<base64-secret>`. Notice that this a deeplink call.

In order to discover this secret, we need to take a look at this section of the code:

![alt text](image-6.png)

The `decrypt` method signature confirms what each parameter is. The last piece to decrypt is the IV (which can be found on Activity22).

![alt text](image-4.png)

![alt text](image-5.png)

Finally, knowing that we are dealing with AES/CBC mode, and we have the encrypted data, the key and the IV, we can just use CyberChef to get the secret.

![alt text](image-2.png)

So:
```
am start -n com.mobilehackinglab.challenge/.Activity2 -a "android.intent.action.VIEW" -d 'mhl://labs/bWhsX3NlY3JldF8xMzM3'
```

![alt text](image-7.png)

The thing is, the Toast doesn't actually show de flag, just the 'Success'. However, we can find the flag in memory! (`strings.js`)

Searching for the pattern 'MHL{' in memory at libflag.so, we've got:

![alt text](image-9.png)