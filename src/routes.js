import { Router } from 'express';
import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import PlanController from './app/controllers/PlanController';
import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.get('/sessions', SessionController.store);
routes.use(authMiddleware);
routes.post('/createStudent', StudentController.store);
routes.put('/updateStudent/:studentId', StudentController.update);
routes.post('/plans', PlanController.store);
routes.get('/plans', PlanController.index);
routes.put('/plans/:idPlan', PlanController.update);
routes.delete('/plans/:idPlan', PlanController.delete);

export default routes;
