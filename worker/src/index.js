import { Router } from 'itty-router';
import testGameRouter from './games/testgame';

const router = Router();

// API 路由
router.all('/api/testgame/*', testGameRouter.handle);

// 前端路由兜底规则
router.all('*', (request, env) => {
    return env.ASSETS.fetch(request);
});

export default {
    fetch(request, env, ctx) {
        return router.handle(request, env, ctx);
    }
};