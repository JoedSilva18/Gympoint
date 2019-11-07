import Question from '../models/Question';

class PendingQuestionController {
  async index(req, res) {
    const pedingQuestions = await Question.findAll();

    return res.json(pedingQuestions);
  }
}

export default new PendingQuestionController();
