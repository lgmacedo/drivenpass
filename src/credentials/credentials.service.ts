import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { NewCredentialDTO } from './dtos/new-credential.dto';
import { User } from '@prisma/client';
import { CredentialsRepository } from './credentials.repository';
import { CryptrService } from '../cryptr/cryptr.service';

@Injectable()
export class CredentialsService {
  constructor(
    private readonly credentialsRepository: CredentialsRepository,
    @Inject(CryptrService) private readonly cryptr: CryptrService,
  ) {}

  async newCredential(user: User, newCredentialDto: NewCredentialDTO) {
    const credentialAlreadyExists = await this.getCredentialWithUserIdAndTitle(
      user.id,
      newCredentialDto.title,
    );
    if (credentialAlreadyExists)
      throw new ConflictException('Credential already exists');
    this.credentialsRepository.insertNewCredential(user.id, newCredentialDto);
  }

  getCredentialWithUserIdAndTitle(userId: number, title: string) {
    return this.credentialsRepository.getCredentialWithUserIdAndTitle(
      userId,
      title,
    );
  }

  async getAllCredentials() {
    const credentials = await this.credentialsRepository.getAllCredentials();
    const decryptedCredentials = credentials.map((credential) => {
      return {
        ...credential,
        password: this.cryptr.decrypt(credential.password),
      };
    });
    return decryptedCredentials;
  }

  async checkCredential(id: number, userId: number) {
    const credential = await this.credentialsRepository.getOneCredential(id);
    if (!credential) throw new NotFoundException('Credential not found');
    if (credential.userId !== userId)
      throw new ForbiddenException('Credential does not belong to user');
    return credential;
  }

  async getOneCredential(id: number, userId: number) {
    const credential = await this.checkCredential(id, userId);
    const decryptedCredential = {
      ...credential,
      password: this.cryptr.decrypt(credential.password),
    };
    return decryptedCredential;
  }

  async deleteCredential(id: number, userId: number) {
    await this.checkCredential(id, userId);
    this.credentialsRepository.deleteCredential(id);
  }
}
