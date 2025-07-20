import { Router } from 'itty-router';
import { saveGame, loadGame } from './handler';

const testGameRouter = Router({ base: '/api/testgame' });

testGameRouter.post('/save', saveGame);
testGameRouter.post('/load', loadGame);

export default testGameRouter;