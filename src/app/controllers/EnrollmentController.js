import * as Yup from 'yup';
import { parseISO, isBefore, addMonths, format } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Enrollment from '../models/Enrollment';
import Student from '../models/Student';
import Plan from '../models/Plan';
import EnrollmentMail from '../jobs/EnrollmentMail';
import Queue from '../../lib/Queue';
import Mail from '../../lib/Mail';

class EnrollmentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
      plan_id: Yup.number().required(),
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { student_id, plan_id, start_date } = req.body;

    /**
     * Check if student exists
     */
    const student = await Student.findByPk(student_id);
    if (!student) {
      return res.status(400).json({ error: 'Student do not exists' });
    }

    /**
     * Check if plan exists
     */
    const plan = await Plan.findByPk(plan_id);
    if (!plan) {
      return res.status(400).json({ error: 'Plan do not exists' });
    }

    /**
     * Check for past dates
     */
    const startDay = parseISO(start_date);
    if (isBefore(startDay, new Date())) {
      return res.status(400).json({ error: 'Past dates are not permitted' });
    }
    const price = plan.price * plan.duration;
    const finalDay = addMonths(startDay, plan.duration);

    const enrollment = await Enrollment.create({
      student_id,
      plan_id,
      start_date: startDay,
      end_date: finalDay,
      price,
    });

    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Matricula efetuada',
      template: 'enrollment',
      context: {
        student: student.name,
        start_date: format(startDay, 'dd/MM/R', {
          locale: pt,
        }),
        end_date: format(finalDay, 'dd/MM/R', {
          locale: pt,
        }),
        price,
      },
    });

    return res.json(enrollment);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number(),
      plan_id: Yup.number(),
      start_date: Yup.date(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { idEnrollment } = req.params;
    const { student_id, plan_id, start_date } = req.body;

    const enrollment = await Enrollment.findByPk(idEnrollment);

    if (!enrollment) {
      return res.status(400).json({ error: 'Enrollment do not exists' });
    }

    /**
     * Check if student exists
     */
    const student = await Student.findByPk(student_id);
    if (!student) {
      return res.status(400).json({ error: 'Student do not exists' });
    }

    /**
     * Check if plan exists
     */
    const plan = await Plan.findByPk(plan_id);
    if (!plan) {
      return res.status(400).json({ error: 'Plan do not exists' });
    }

    /**
     * Check for past dates
     */
    const startDay = parseISO(start_date);
    if (isBefore(startDay, new Date())) {
      return res.status(400).json({ error: 'Past dates are not permitted' });
    }
    const price = plan.price * plan.duration;
    const finalDay = addMonths(startDay, plan.duration);

    await enrollment.update({
      student_id,
      plan_id,
      start_date: startDay,
      end_date: finalDay,
      price,
    });

    return res.json({
      idEnrollment,
      student_id,
      plan_id,
      start_date: startDay,
      end_date: finalDay,
      price,
    });
  }

  async index(req, res) {
    const enrollments = await Enrollment.findAll({
      attributes: ['id', 'start_date', 'end_date', 'price'],
    });

    return res.json(enrollments);
  }

  async delete(req, res) {
    const { idEnrollment } = req.params;

    const enrollment = await Enrollment.findByPk(idEnrollment);

    if (!enrollment) {
      return res.status(400).json({ error: 'Enrollmento do not exists' });
    }

    await enrollment.destroy();
    return res.json({
      message: `The enrollment was deleted`,
    });
  }
}

export default new EnrollmentController();
