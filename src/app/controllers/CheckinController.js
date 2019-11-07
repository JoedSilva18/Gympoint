import { startOfDay, endOfDay, parseISO, format, subDays } from 'date-fns';
import { Op } from 'sequelize';
import pt from 'date-fns/locale/pt';
import Checkin from '../models/Checkin';
import Student from '../models/Student';

class CheckinController {
  async store(req, res) {
    const { idStudent } = req.params;

    const student = await Student.findByPk(idStudent);

    /**
     * Check if student exists
     */
    if (!student) {
      return res.status(400).json({ error: 'Student do not exists' });
    }

    // current date
    const nowDate = new Date();

    const resultStartOfDay = startOfDay(nowDate);
    const resultEndOfDay = endOfDay(nowDate);

    const checkinExists = await Checkin.findOne({
      where: {
        student_id: idStudent,
        created_at: {
          [Op.between]: [resultStartOfDay, resultEndOfDay],
        },
      },
    });

    if (checkinExists) {
      return res.status(400).json({ error: 'Only one check in per day' });
    }

    // past date
    const subDate = subDays(nowDate, 7);

    const checkins = await Checkin.findAll({
      where: {
        student_id: idStudent,
        created_at: {
          [Op.between]: [subDate, nowDate],
        },
      },
    });

    if (checkins.length === 5) {
      return res.status(400).json({ error: 'Checkin limit exceeded' });
    }

    const { id, student_id, created_at } = await Checkin.create({
      student_id: idStudent,
    });

    return res.json({ id, student_id, created_at });
  }

  async index(req, res) {
    const { idStudent } = req.params;

    const student = await Student.findByPk(idStudent);

    /**
     * Check if student exists
     */
    if (!student) {
      return res.status(400).json({ error: 'Student do not exists' });
    }

    const checkins = await Checkin.findAll({
      where: {
        student_id: idStudent,
      },
    });

    return res.json(checkins);
  }
}

export default new CheckinController();
