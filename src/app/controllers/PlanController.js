import * as Yup from 'yup';
import Plan from '../models/Plan';

class PlanController {
  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      price: Yup.number()
        .positive()
        .required(),
      duration: Yup.number()
        .positive()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const planExists = await Plan.findOne({
      where: { title: req.body.title },
    });

    if (planExists) {
      return res.status(400).json({ error: 'This plan is already registered' });
    }

    const { id, title, price, duration } = await Plan.create(req.body);

    return res.json({
      id,
      title,
      price,
      duration,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string(),
      price: Yup.number().positive(),
      duration: Yup.number().positive(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { idPlan } = req.params;

    const plan = await Plan.findByPk(idPlan);

    if (!plan) {
      return res.status(400).json({ error: 'Plan do not exists' });
    }

    const { id, title, duration, price } = await plan.update(req.body);

    return res.json({
      id,
      title,
      duration,
      price,
    });
  }

  async index(req, res) {
    const plans = await Plan.findAll({
      attributes: ['id', 'title', 'duration', 'price'],
    });

    return res.json(plans);
  }

  async delete(req, res) {
    const { idPlan } = req.params;

    const plan = await Plan.findByPk(idPlan);

    if (!plan) {
      return res.json(400).json({ error: 'Plan do not exists' });
    }

    const { title } = plan;

    await plan.destroy();
    return res.json({
      message: `The plan ${title} was deleted`,
    });
  }
}

export default new PlanController();
