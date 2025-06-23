import { AppException } from './app.exception';
import { HttpStatus } from '@nestjs/common';

/**
 * Erreur technique lors de la récupération des profils
 */
export class ProfileInterneErrorException extends AppException {
  constructor(source: string, details?: string) {
    const message = details
      ? `Erreur lors de la récupération des profils (${source}) : ${details}`
      : `Erreur lors de la récupération des profils`

    super (message, 'PROFILE_FETCH_FAILED', HttpStatus.INTERNAL_SERVER_ERROR)
  }
}

/**
 * Profil introuvable en BDD
 */

export class ProfileNotFoundException extends AppException {
  constructor(id: string) {
    super(
      `Profil avec l'ID ${id} introuvable`,
      'PROFILE_NOT_FOUND',
      HttpStatus.NOT_FOUND,
    );
  }
}

/**
 * Id invalide
 */
export class InvalidProfilIdException extends AppException {
  constructor(id: string) {
    super(
      `L'ID du profil ${id} est invalide`,
      'INVALID_PROFILE_ID',
      HttpStatus.BAD_REQUEST,
    );
  }
}

/**
 * Id null ou vide
 */
export class NullProfileIdException extends AppException {
  constructor() {
    super(
      `L'ID du profil ne peux pas être null ou vide.`,
      'NULL_PROFILE_ID',
      HttpStatus.BAD_REQUEST,
    );
  }
}

/**
 * Id fait partie des profils soft-delete
 */
export class DeletedProfileException extends AppException {
  constructor(id: string) {
    super(
      `L'ID du profil ${id} pointe vers un Profil en Soft-delete`,
      'DELETED_PROFILE_ID',
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class ProfileCreateException extends AppException {
  constructor(message?: string) {
    const fullMessage = message
      ? `Erreur lors de la création du profil : ${message}`
      : `Erreur lors de la création du profil`
    super(fullMessage, 'PROFILE_CREATE_FAILED', HttpStatus.BAD_REQUEST);
  }
}
