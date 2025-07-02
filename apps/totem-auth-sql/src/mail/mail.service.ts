import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST ?? 'smtp.example.com',
    port: parseInt(process.env.MAIL_PORT ?? '587'),
    secure: false, // true pour le port 465
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  async sendInvitation(email: string, tempPassword: string, token: string) {
    const link = `http://localhost:3005/first-login?token=${token}`;

    try {
      await this.transporter.sendMail({
        from: '"Totem Support" <no-reply@totem.fr>',
        to: email,
        subject: '🎉 Invitation à rejoindre Totem',
        html: `
          <p>Bonjour,</p>
          <p>Un compte a été créé pour vous sur notre application <strong>Totem</strong>.</p>
          <p><strong>Identifiants temporaires :</strong><br />
          ✉️ <strong>Email :</strong> ${email}<br />
          🔑 <strong>Mot de passe temporaire :</strong> ${tempPassword}</p>
          <p>👉 <a href="${link}">Cliquez ici pour vous connecter et définir votre mot de passe</a></p>
          <p><em>Ce lien est valable pendant 48 heures.</em></p>
          <p>À bientôt,<br />L'équipe Totem.</p>
        `,
      });
    } catch (error) {
      console.error('Erreur envoi mail:', error);
      throw new InternalServerErrorException('Échec envoi mail');
    }
  }
}
