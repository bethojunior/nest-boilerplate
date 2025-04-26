import { HttpStatus, Injectable } from "@nestjs/common";
import { BusinessException } from "src/exceptions/business.exception";
import { PrismaService } from "src/providers/prisma/prisma.service";

@Injectable()
export abstract class AbstractRepository<TModel, TWhereInput> {
  constructor(
    protected readonly prisma: PrismaService,
    private readonly modelAccessor: keyof PrismaService,
  ) {}

  async findByParamsAbstract(params: TWhereInput): Promise<TModel | BusinessException> {
    try {
      const model = this.prisma[this.modelAccessor] as any;
      return await model.findFirst({
        where: params,
      });
    } catch (error) {
      throw new BusinessException(
        error.message,
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  async findOneAbstract(id: any): Promise<TModel | BusinessException> {
    try {
      const model = this.prisma[this.modelAccessor] as any;
      return await model.findFirst({
        where: { id },
      });
    } catch (error) {
      throw new BusinessException(
        error.message,
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  async findManyAbstract(params: TWhereInput): Promise<TModel[] | BusinessException> {
    try {
      const model = this.prisma[this.modelAccessor] as any;
      return await model.findMany({
        where: params,
      });
    } catch (error) {
      throw new BusinessException(
        error.message,
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  async storeAbstract(props: TModel): Promise<TModel | BusinessException> {
    try {
      const model = this.prisma[this.modelAccessor] as any;
      return await model.create({
        data: {
          ...props
        }
      });
    } catch (error) {
      throw new BusinessException(
        error.message,
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  async removeAbstract(props: TModel): Promise<TModel | BusinessException> {
    try {
      const id = (props as any).id;
      const model = this.prisma[this.modelAccessor] as any;

      const find = await model.findFirst({
        where: { id },
      });

      if (!find) {
        throw new BusinessException(
          "Item not found",
          HttpStatus.NOT_FOUND,
        );
      }

      return await model.update({
        where: {
          id,
        },
        data: {
          isActive: false,
          deleted_at: new Date(),
        }
      });
    } catch (error) {
      throw new BusinessException(
        error.message,
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

}
