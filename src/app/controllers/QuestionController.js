import Question from '../models/Question';
import Student from '../models/Student';

class QuestionController {
  async store(req, res) {
    const { idStudent } = req.params;

    const student = await Student.findByPk(idStudent);

    if (!student) {
      return res.status(400).json({ error: 'Student do not exists' });
    }

    const { question } = req.body;

    const { id, student_id } = await Question.create({
      student_id: idStudent,
      question,
    });

    return res.json({ id, student_id, question });
  }

  async index(req, res) {
    const { idStudent } = req.params;

    const student = await Student.findByPk(idStudent);

    if (!student) {
      return res.status(400).json({ error: 'Student do not exists' });
    }

    const questions = await Question.findAll({
      where: {
        student_id: idStudent,
      },
      attributes: ['id', 'student_id', 'question'],
    });

    return res.json(questions);
  }
}

export default new QuestionController();
