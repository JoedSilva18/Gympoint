import Question from '../models/Question';
import Student from '../models/Student';
import Mail from '../../lib/Mail';

class QuestionAnswerController {
  async store(req, res) {
    const { idQuestion } = req.params;

    const helpOrder = await Question.findByPk(idQuestion);

    if (!helpOrder) {
      return res.status(400).json({ error: 'Question do not exists' });
    }

    const student = await Student.findByPk(helpOrder.student_id);

    await helpOrder.update(req.body);
    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Sua pergunta tem uma nova resposta',
      template: 'answerQuestion',
      context: {
        student: student.name,
        question: helpOrder.question,
        answer: helpOrder.answer,
      },
    });

    return res.json(helpOrder);
  }
}

export default new QuestionAnswerController();
