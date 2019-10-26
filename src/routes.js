import { Router } from 'express';
import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.get('/sessions', SessionController.store);
routes.use(authMiddleware);
routes.post('/createStudent', StudentController.store);
routes.put('/updateStudent/:studentId', StudentController.update);

export default routes;
