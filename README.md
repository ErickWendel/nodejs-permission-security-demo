# Node.js Security Demo: The Danger of Untrusted Packages

This project demonstrates how a seemingly innocent package (like a simple math utility) can hide malicious code that compromises your system. It highlights the importance of using Node.js permission flags to protect against such attacks.

## The Problem

Developers often install and use third-party packages without reviewing their code. When these packages are minified or obfuscated, even a cursory review wouldn't reveal the underlying malicious code.

In this demo, a simple `sum` function that adds two numbers actually contains hidden code that:

1. Creates a temporary script file with malicious code
2. Spawns a detached process that runs in the background
3. Deletes sensitive files from your system
4. Makes unauthorized network requests
5. Extracts environment variables (potential credential theft)
6. Writes captured data to your filesystem

> [!IMPORTANT]
> ⚠️ **Educational Disclaimer**: This is a controlled demonstration - not actual malware. The code fetches a harmless commit message from [whatthecommit.com](https://whatthecommit.com/) and saves it along with your environment variables to local files in the `credentials/` folder. No sensitive data is transmitted over the internet. Review [`src/math.js`](./src/math.js) to understand exactly what the code does.

### Running the Demo

**Step 1: Setup**

```bash
git clone https://github.com/ErickWendel/nodejs-permission-security-demo
cd nodejs-permission-security-demo
```

**Step 2: Generate the obfuscated malicious code**

```bash
sh obfuscate-file.sh
```
This transforms the readable [`src/math.js`](./src/math.js) into the obfuscated [`src/math.min.js`](./src/math.min.js).

**Step 3: Run the unsafe version**
```bash
node src/index.js
```

**Step 4: Observe**

Check that your [`credentials/`](./credentials/) folder now contains:
- `danger.txt` - Containing a commit message fetched from whatthecommit.com
- `env.json` - Containing your Node.js environment variables (potential secrets!)

**Step 5: Read the output**

The output appears innocent:
```
my magic number is 20
elapsed: 5.371ms
```
> [!CAUTION]
> Despite executing in under 10 milliseconds, the malicious code successfully:
> - Made an external HTTP request
> - Created files on your system  
> - Extracted environment variables
> - Spawned a detached background process

This demonstrates how Node.js child processes can operate independently of their parent process, making malicious activities nearly undetectable to users.

## Why Obfuscation Is Used By Attackers

This project includes an [`obfuscate-file.sh`](./obfuscate-file.sh) script that demonstrates how attackers transform readable malicious code (like [`src/math.js`](./src/math.js)) into nearly unreadable minified code ([`src/math.min.js`](./src/math.min.js)). This obfuscation process makes it extremely difficult for users to detect the malicious behavior.

The obfuscation is performed using the popular [javascript-obfuscator](https://www.npmjs.com/package/javascript-obfuscator) npm package, which is ironically a legitimate tool often used by developers to protect intellectual property, but can also be weaponized by attackers to hide malicious code.

Attackers use obfuscation techniques to:

1. **Hide Malicious Intent**: Obfuscated code makes it difficult to detect suspicious patterns like network calls or file system operations
2. **Evade Security Scans**: Many security tools look for known patterns in code - obfuscation changes these patterns
3. **Prevent Manual Inspection**: Developers are less likely to review minified code due to its complexity
4. **Hide URLs and API Endpoints**: Obfuscation can conceal connections to malicious servers
5. **Bypass Execution Controls**: Some security controls look for specific function calls - obfuscation renames and restructures functions

The obfuscation script in this project uses advanced techniques like:
- Control flow flattening
- Dead code injection
- String array encoding (base64)
- Self-defending code
- Identifier name mangling

Compare [`src/math.js`](./src/math.js) (readable) with [`src/math.min.js`](./src/math.min.js) (obfuscated) to see how dramatically obfuscation can hide malicious code.

## How to Protect Yourself: Node.js Permissions

Node.js v20+ introduced the Permissions Model, which allows fine-grained control over what resources a script can access.

### Running This Demo

Run each version and observe the differences:

```bash
# UNSAFE: Runs without any permission restrictions
npm run start:unsafe

# DEMO: Runs the bash node-permission.sh with intentionally permissive settings
# This demonstrates how to configure Node.js CLI permissions (but still allows the malicious code to run)
npm run start:unsafe-unrestricted

# SAFE: Runs with permission restrictions
npm run start:restricted
# Error: Access to this API has been restricted. 
```
> [!IMPORTANT]
> **Security Warning**: The flag `--allow-child-process` must be used with extreme caution. It could invalidate the permission model by allowing spawned processes to bypass restrictions. See the [Node.js Permissions documentation](https://nodejs.org/api/permissions.html) for detailed security considerations.

The [`node-permission.sh`](./node-permission.sh) script demonstrates how to add permission flags to the Node.js CLI, but intentionally includes `--allow-child-process` to show why this can be dangerous - it allows the malicious code to spawn unrestricted child processes that bypass all other permission controls.

### Permission Flags Available

To secure your applications, use permission flags:

```bash
node --permission [permission=value]
```

Available permissions:
- `--allow-fs-read=` - Control filesystem read access
- `--allow-fs-write=` - Control filesystem write access
- `--allow-child-process` - Control child process spawning
- `--allow-worker` - Control Worker thread creation
- `--allow-net=` - Control network access
- and more...

See [Node.js Permissions documentation](https://nodejs.org/api/permissions.html)

## Best Practices

1. Always review package code, especially for sensitive applications
2. Use Node.js permission flags when running untrusted code
3. Set up proper dependency scanning in your CI/CD pipeline
4. Consider using package lock files to prevent unexpected updates
5. Run critical applications in isolated environments

## License

[MIT](./LICENSE)