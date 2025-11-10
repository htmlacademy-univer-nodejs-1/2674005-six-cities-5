import { DocumentType } from '@typegoose/typegoose';
import { CommentEntity } from './comment.entity.js';
import { CreateCommentDTO } from './create-comment.dto.js';

export interface ICommentService {
  create(dto: CreateCommentDTO): Promise<DocumentType<CommentEntity>>;
  findByOfferId(offerId: string): Promise<DocumentType<CommentEntity>[]>;
  deleteById(commentId: string): Promise<void>;
  deleteByOfferId(offerId: string): Promise<number>;
}
