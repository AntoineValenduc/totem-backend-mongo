/**
 * Générer un password temporaire pour la confirmation de l'enregistrement de l'utilisateur <br>
 * S'effectue après la demande d'invitation par un admin
 * @param length
 */
export function generateTempPassword(length = 10): string {
  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lower = 'abcdefghijklmnopqrstuvwxyz';
  const digits = '0123456789';
  const symbols = '!@#$%^&*';
  const all = upper + lower + digits + symbols;

  const getRandomChar = (set: string) =>
    set[Math.floor(Math.random() * set.length)];

  // Préremplissage pour garantir 1 maj, 1 min, 1 chiffre, 1 symbole
  const password = [
    getRandomChar(upper),
    getRandomChar(lower),
    getRandomChar(digits),
    getRandomChar(symbols),
  ];

  // Remplissage aléatoire
  for (let i = password.length; i < length; i++) {
    password.push(getRandomChar(all));
  }

  // Mélange et envoi
  return password.toSorted(() => Math.random() - 0.5).join('');
}
