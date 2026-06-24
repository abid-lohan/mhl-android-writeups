console.log("[*] Starting memory scan...");

function hexDump(ptr, size) {
    return hexdump(ptr, {
        offset: 0,
        length: size,
        header: true,
        ansi: false
    });
}

const moduleName = "libflag.so";
const pattern = "4d 48 4c 7b"; // MHL{
const module = Process.getModuleByName(moduleName);

console.log("[+] Found " + moduleName + " at: " + module.base);

Memory.scan(module.base, module.size, pattern, {
    onMatch: function (address, size) {
        console.log("[+] Potential flag found at: " + address);
        try {
            console.log(hexDump(address, 64));
        } catch (err) {
            console.error("Error reading memory:", err);
        }
    },
    onError: function (reason) {
        console.error("Memory scan failed:", reason);
    },
    onComplete: function () {
        console.log("[+] Memory scan complete.");
    }
});