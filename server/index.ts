// 引入 Koa 和 http 模块
import Koa from 'koa';
import Router from 'koa-router';
import { Article200FromYear } from './util.js';

const app = new Koa();
const router = new Router();

function init() {
    // 定义路由
    router.get('/Article200FromYear', async (ctx) => {
        const year = parseInt((ctx.query as unknown as string)['year']);
        const data = await Article200FromYear(year)
        ctx.body = JSON.stringify(data);
    });

    //CORS
    app.use(async (ctx, next) => {
        ctx.set("Access-Control-Allow-Origin", "*");
        ctx.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
        ctx.set("Access-Control-Allow-Headers", "Content-Type");
        await next();
    });

    // 将路由应用到 Koa 应用
    app.use(router.routes());

    // 监听 3000 端口
    app.listen(3000, () => {
        console.log('Server running on http://localhost:3000');
    });
}
init()