import { Prisma, PrismaClient } from '@prisma/client';
import { PaginationDto } from '../core/pagination.dto';

/**
 * Custom Prisma Extensions
 */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function getPrismaExtensions(prisma: PrismaClient) {
  const extensions = {
    model: {
      $allModels: {
        async softDeleteMany(ids: number[]): Promise<void> {
          const context = Prisma.getExtensionContext(this);
          await context.updateMany({
            where: {
              id: {
                in: ids,
              },
            },
            data: {
              deleted_at: new Date(),
            },
          });
        },
        async softDelete(id: number): Promise<void> {
          const context = Prisma.getExtensionContext(this);
          await context.updateMany({
            where: {
              id,
            },
            data: {
              deleted_at: new Date(),
            },
          });
        },
        async paginate<T>(
          options: {
            where?: Prisma.Args<T, 'findMany'>;
            orderBy?: Prisma.Args<T, 'findMany'>;
            select?: Prisma.Args<T, 'findMany'>;
          },
          page: number = 1,
          size: number = 10,
          metaFields: object = {},
        ): Promise<PaginationDto> {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const context: any = Prisma.getExtensionContext(this);
          const count = await context.count({
            where: options['where'],
          });
          const result = await context.findMany(
            Object.assign(options, {
              skip: size * (page - 1),
              take: size,
            }),
          );
          return {
            meta: Object.assign(metaFields, {
              pagination: {
                total: count,
                page: page,
                size: size,
                last_page: Math.ceil(count / size),
              },
            }),
            data: result,
          };
        },
      },
    },
    query: {
      // eslint-disable-next-line
      $allOperations({ operation, args, query }) {
        if (
          [
            'findFirst',
            'findFirstOrThrow',
            'findUnique',
            'findUniqueOrThrow',
            'findMany',
            'updateMany',
            'update',
          ].includes(operation)
        ) {
          args.where = { ...args.where, deleted_at: null };
        }
        return query(args);
      },
    },
  };

  return prisma.$extends(extensions);
}
