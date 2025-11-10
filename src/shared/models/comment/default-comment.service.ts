import { injectable, inject } from 'inversify';
import { getModelForClass } from '@typegoose/typegoose';
import { DocumentType } from '@typegoose/typegoose';
import { ICommentService } from './comment-service.interface.js';
import { CommentEntity } from './comment.entity.js';
import { CreateCommentDTO } from './create-comment.dto.js';
import { Component } from '../../types/component.enum.js';
import { ILogger } from '../../libs/logger/index.js';

@injectable()
export class DefaultCommentService implements ICommentService {
  private commentModel = getModelForClass(CommentEntity);

  constructor(
    @inject(Component.Logger) private logger: ILogger
  ) {}

  async create(dto: CreateCommentDTO): Promise<DocumentType<CommentEntity>> {
    const comment = await this.commentModel.create(dto);
    this.logger.info(`Comment created: ${comment._id}`);
    return comment;
  }

  async findByOfferId(offerId: string): Promise<DocumentType<CommentEntity>[]> {
    const comments = await this.commentModel
      .find({ offerId })
      .sort({ publishDate: -1 });
    return comments;
  }

  async deleteById(commentId: string): Promise<void> {
    await this.commentModel.findByIdAndDelete(commentId);
    this.logger.info(`Comment deleted: ${commentId}`);
  }

  async deleteByOfferId(offerId: string): Promise<number> {
    const result = await this.commentModel.deleteMany({ offerId });
    this.logger.info(`${result.deletedCount} comments deleted for offer ${offerId}`);
    return result.deletedCount || 0;
  }
}
