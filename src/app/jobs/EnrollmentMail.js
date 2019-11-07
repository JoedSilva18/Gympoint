import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class EnrollmentMail {
  get key() {
    return 'EnrollmentMail';
  }

  async handle({ data }) {
    const { student } = data;

    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Matricula efetuada',
      template: 'enrollment',
      context: {
        student: student.name,
        start_date: format(parseISO(student.start_date), 'dd/MM/R', {
          locale: pt,
        }),
        end_date: format(parseISO(student.end_date), 'dd/MM/R', {
          locale: pt,
        }),
        price: student.price,
      },
    });
  }
}

export default new EnrollmentMail();
