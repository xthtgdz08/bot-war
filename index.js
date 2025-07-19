const { spawn } = require("child_process");
const logger = require("./core/script/log");

function startBot(message) {
    const customAsciiArt = `
   _____ _______       _____  _______ _______ 
  / ____|__   __|/\\   |  __ \\|__   __|__   __|
 | (___    | |  /  \\  | |__) |  | |     | |   
  \\___ \\   | | / /\\ \\ |  _  /   | |     | |   
  ____) |  | |/ ____ \\| | \\ \\   | |     | |   
 |_____/   |_/_/    \\_\\_|  \\_\\  |_|     |_|  `;

    if (message) logger(`${customAsciiArt}\n${message}`, "[ Bắt Đầu ]");

    const child = spawn("node", ["--trace-warnings", "--async-stack-traces", "main.js"], {
        cwd: __dirname,
        stdio: "inherit",
        shell: true
    });

    child.on("close", async (codeExit) => {
        const code = Number(codeExit);

        if (code === 1) {
            return startBot("Restarting...");
        } else if (String(code).startsWith("2")) {
            const delay = parseInt(String(code).slice(1)) * 1000 || 2000;
            await new Promise(res => setTimeout(res, delay));
            return startBot("Open...");
        } else {
            return;
        }
    });

    child.on("error", (error) => {
        logger("An error occurred: " + JSON.stringify(error), "[ Starting ]");
    });
}

startBot();
