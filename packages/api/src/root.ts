import {authRouter} from "./router/auth";
import { UserRouter } from "./router/users";
import { CategoryRouter } from "./router/categories";
import { ReservationRouter } from "./router/reservations";
import { FacilityRouter } from "./router/facilities";
import {createTRPCRouter} from "./trpc"

export const appRouter = createTRPCRouter({
  auth: authRouter,
  user: UserRouter,
  category: CategoryRouter,
  reservation: ReservationRouter,
  facility: FacilityRouter,
});

export type AppRouter = typeof appRouter;