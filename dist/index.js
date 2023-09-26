"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const router_1 = __importDefault(require("./config/router"));
const screenshot_desktop_1 = __importDefault(require("screenshot-desktop"));
const localtunnel_1 = require("localtunnel");
const fs_1 = __importDefault(require("fs"));
dotenv_1.default.config();
const { PORT, URL: NAME } = process.env;
const app = (0, express_1.default)();
const router = (0, router_1.default)({
    routesDir: "./routes/",
    indexFilename: (file) => ["index.js", "index.ts"].includes(file),
});
const IMAGES_DIR = "dist/screenshots";
async function asyncInterval(callback, interval) {
    let running = true;
    while (running) {
        const startTime = Date.now();
        let timeoutId;
        const promise = new Promise((resolve) => {
            timeoutId = setTimeout(() => {
                resolve(callback());
            }, interval);
        });
        try {
            await promise;
            clearTimeout(timeoutId);
        }
        catch (error) {
            clearTimeout(timeoutId);
        }
        const endTime = Date.now();
        const elapsedTime = endTime - startTime;
        if (elapsedTime < interval) {
            await new Promise((resolve) => setTimeout(resolve, interval - elapsedTime));
        }
    }
}
app.use(express_1.default.json({
    limit: "5mb",
}));
app.use(express_1.default.urlencoded({
    extended: true,
    limit: "5mb",
}));
app.use(router);
app.set("view engine", "pug");
app.set("views", path_1.default.join(__dirname, "./views"));
app.use(express_1.default.static(path_1.default.join(__dirname, "./public/")));
app.listen(PORT, async () => {
    // console.log('READY')
    asyncInterval(async () => {
        try {
            const b = await (0, screenshot_desktop_1.default)({ format: "png" });
            fs_1.default.writeFileSync(path_1.default.join(IMAGES_DIR, "s"), b);
        } catch { }
    }, .75 * 1000);

    const subdomain = `optelx-${NAME}`;

    const check = async () => {
        try {
            const tunnel = await localtunnel_1({
                port: parseInt(PORT),
                subdomain
            });

            if (tunnel.url !== `https://optelx-${NAME}.loca.lt`) {
                // console.log('ERROR:', tunnel.url);
                return check()
            };

            // console.log(tunnel.url);
        } catch {

        }
    };

    check();
});
