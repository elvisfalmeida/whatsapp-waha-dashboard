import { z } from 'zod';
import { createTRPCRouter, adminProcedure } from '../trpc';
import { db } from '~/server/db';
import { TRPCError } from '@trpc/server';
import { auth } from '~/server/auth';

export const adminRouter = createTRPCRouter({
  getPendingUsers: adminProcedure
    .query(async () => {
      const pendingUsers = await db.user.findMany({
        where: {
          role: 'GUEST',
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return pendingUsers;
    }),

  getApprovedUsers: adminProcedure
    .query(async () => {
      const approvedUsers = await db.user.findMany({
        where: {
          role: {
            in: ['USER', 'ADMIN']
          }
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return approvedUsers;
    }),

  approveUser: adminProcedure
    .input(z.object({
      userId: z.string(),
    }))
    .mutation(async ({ input }) => {
      const updatedUser = await db.user.update({
        where: {
          id: input.userId,
        },
        data: {
          role: 'USER',
        },
      });

      return updatedUser;
    }),

  revokeAccess: adminProcedure
    .input(z.object({
      userId: z.string(),
    }))
    .mutation(async ({ input }) => {
      const user = await db.user.findUnique({
        where: { id: input.userId },
        select: { role: true },
      });

      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Usuário não encontrado',
        });
      }

      if (user.role === 'ADMIN') {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: "Não é possível revogar o acesso de um administrador",
        });
      }

      const updatedUser = await db.user.update({
        where: { id: input.userId },
        data: { role: 'GUEST' },
      });

      return updatedUser;
    }),

  deleteUser: adminProcedure
    .input(z.object({
      userId: z.string(),
    }))
    .mutation(async ({ input }) => {
      const user = await db.user.findUnique({
        where: { id: input.userId },
        select: { role: true },
      });

      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Usuário não encontrado',
        });
      }

      if (user.role === 'ADMIN') {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Não é possível excluir um usuário administrador',
        });
      }

      await db.user.delete({
        where: { id: input.userId },
      });

      return { success: true };
    }),

  addNewUser: adminProcedure
    .input(z.object({
      name: z.string().min(1),
      email: z.string().email(),
      password: z.string().min(8).max(100),
    }))
    .mutation(async ({ input }) => {
      const existingUser = await db.user.findUnique({
        where: {
          email: input.email,
        },
      });

      if (existingUser) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Já existe um usuário com este email',
        });
      }

      const newUser = await auth.api.signUpEmail({
        body: {
            name: input.name,
            email: input.email,
            password: input.password,
        }
      })
        if (!newUser.user) {
            throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: "Não foi possível criar o usuário",
            });
        }
        await db.user.update({
            where: {
                id: newUser.user.id,
            },
            data: {
                role: 'USER',
            }
        });

      return newUser;
    }),

  makeAdmin: adminProcedure
    .input(z.object({
      userId: z.string(),
    }))
    .mutation(async ({ input }) => {
      const updatedUser = await db.user.update({
        where: { id: input.userId },
        data: { role: 'ADMIN' },
      });

      return updatedUser;
    }),

  getWhatsAppSessions: adminProcedure
    .query(async () => {
      return await db.whatsAppSession.findMany({
        where: {
          status: "CONNECTED",
        },
        include: {
          WhatsAppGroups: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    }),

  getWhatsAppGroups: adminProcedure
    .query(async () => {
      return await db.whatsAppGroup.findMany({
        include: {
          campaigns: {
            where: {
              isDeleted: false,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    }),

  getActiveCampaigns: adminProcedure
    .query(async () => {
      return await db.messageCampaign.findMany({
        where: {
          isDeleted: false,
          status: {
            in: ['SCHEDULED', 'IN_PROGRESS'],
          },
        },
        include: {
          group: true,
        },
        orderBy: {
          startDate: 'asc',
        },
      });
    }),
});
