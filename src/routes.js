import { Router } from 'express';
import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import PlanController from './app/controllers/PlanController';
import EnrollmentController from './app/controllers/EnrollmentController';
import CheckinController from './app/controllers/CheckinController';
import QuestionController from './app/controllers/QuestionController';
import PendingQuestionController from './app/controllers/PendingQuestionController';
import QuestionAnswerController from './app/controllers/QuestionAnswerController';
import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.get('/sessions', SessionController.store);
routes.post('/students/:idStudent/checkins', CheckinController.store);
routes.get('/students/:idStudent/checkins', CheckinController.index);
routes.get('/pendingQuestions', PendingQuestionController.index);
routes.post('/students/:idStudent/help-orders', QuestionController.store);
routes.get('/students/:idStudent/help-orders', QuestionController.index);
// Funcionalidades para usuarios autenticados na aplicacao
routes.use(authMiddleware);
routes.post('/createStudent', StudentController.store);
routes.put('/updateStudent/:studentId', StudentController.update);
routes.post('/plans', PlanController.store);
routes.get('/plans', PlanController.index);
routes.put('/plans/:idPlan', PlanController.update);
routes.delete('/plans/:idPlan', PlanController.delete);
routes.post('/enrollments', EnrollmentController.store);
routes.delete('/enrollments/:idEnrollment', EnrollmentController.delete);
routes.put('/enrollments/:idEnrollment', EnrollmentController.update);
routes.get('/enrollments/', EnrollmentController.index);
routes.post('/help-orders/:idQuestion/answer', QuestionAnswerController.store);
export default routes;
