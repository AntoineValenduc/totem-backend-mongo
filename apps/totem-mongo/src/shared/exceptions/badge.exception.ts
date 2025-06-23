import { AppException } from './app.exception';
import { HttpStatus } from '@nestjs/common';

/**
 * Erreur technique lors de la récupération des bagdes
 */
export class BadgeInterneErrorException extends AppException {
  constructor(source: string, details?: string) {
    const message = details
      ? `Erreur lors de la récupération des bagdes (${source}) : ${details}`
      : `Erreur lors de la récupération des bagdes (${source})`;

    super(message, 'BADGE_FETCH_FAILED', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

/**
 * Badge introuvable en BDD
 */

export class BadgeNotFoundException extends AppException {
  constructor(id: string) {
    super(
      `Badge avec l'ID ${id} introuvable`,
      'BADGE_NOT_FOUND',
      HttpStatus.NOT_FOUND,
    );
  }
}

/**
 * Id invalide
 */
export class InvalidBadgeIdException extends AppException {
  constructor(id: string) {
    super(
      `L'ID du bagde ${id} est invalide`,
      'INVALID_BADGE_ID',
      HttpStatus.BAD_REQUEST,
    );
  }
}

/**
 * Id null ou vide
 */
export class NullBadgeIdException extends AppException {
  constructor() {
    super(
      `L'ID du bagde ne peux pas être null ou vide.`,
      'NULL_BADGE_ID',
      HttpStatus.BAD_REQUEST,
    );
  }
}

/**
 * Id fait partie des bagdes soft-delete
 */
export class DeletedBadgeException extends AppException {
  constructor(id: string) {
    super(
      `L'ID du bagde ${id} pointe vers un Badge en Soft-delete`,
      'DELETED_BADGE_ID',
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class BadgeCreateException extends AppException {
  constructor(message?: string) {
    const fullMessage = message
      ? `Erreur lors de la création du bagde : ${message}`
      : 'Erreur lors de la création du bagde';

    super(fullMessage, 'BADGE_CREATE_FAILED', HttpStatus.BAD_REQUEST);
  }
}
