import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { notifyAdminOfNewRegistration } from "~/server/mailgun";

export const notificationRouter = createTRPCRouter({
  notifyAdminOfUserRegistration: publicProcedure
    .input(z.object({
      userName: z.string(),
      userEmail: z.string().email(),
    }))
    .mutation(async ({ input }) => {
      try {
        const result = await notifyAdminOfNewRegistration(input.userName, input.userEmail);
        return {
          success: true,
          whatsappSent: result.whatsapp,
          emailSent: result.email,
          errors: result.errors,
        };
      } catch (error) {
        console.error("Falha ao notificar administrador sobre cadastro de usuário:", error);
        return {
          success: false,
          whatsappSent: false,
          emailSent: false,
          errors: [error instanceof Error ? error.message : "Erro desconhecido"],
        };
      }
    }),
});
