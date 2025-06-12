import { AppException } from './app.exception';
import { HttpStatus } from '@nestjs/common';

/**
 * Erreur technique lors de la récupération des branches
 */
export class BranchInterneErrorException extends AppException {
  constructor(source: string, details?: string) {
    super(
      `Erreur lors de la récupération des branches (${source})${details ? ` : ${details}` : ''}`,
      'BRANCH_FETCH_FAILED',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

/**
 * Branche introuvable en BDD
 */
export class BranchNotFoundException extends AppException {
  constructor(id: string) {
    super(
      `Branche avec l'ID ${id} introuvable`,
      'BRANCH_NOT_FOUND',
      HttpStatus.NOT_FOUND);
  }
}

/**
 * Payload invalide
 */
export class InvalidBranchPayloadException extends AppException {
  constructor(payload: any) {
    super(
      'Le payload est invalide : ' + payload,
      'INVALID_BRANCH_PAYLOAD',
      HttpStatus.BAD_REQUEST,
      );
  }
}

/**
 * Id invalide
 */
export class InvalidBranchIdException extends AppException {
  constructor(id: string) {
    super(`L'ID de la branche ${id} est invalide`,
      'INVALID_BRANCH_ID',
      HttpStatus.BAD_REQUEST);
  }
}

/**
 * Id null ou vide
 */
export class NullBranchIdException extends AppException {
  constructor() {
    super(`L'ID de la branche ne peux pas être null ou vide.`,
      'NULL_BRANCH_ID',
      HttpStatus.BAD_REQUEST);
  }
}

/**
 * Erreur interne
 */
export class BranchCreateException extends AppException {
  constructor(message?: string) {
    super(
      `Erreur lors de la création de la branche${message ? ` : ${message}` : ''}`,
      'BRANCH_CREATE_FAILED',
      HttpStatus.BAD_REQUEST,
    );
  }
}
