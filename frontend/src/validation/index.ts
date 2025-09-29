import {z} from "zod"
import type { ZodSchema } from "zod/v3"
const validate = <T>(schema: z.ZodType<{}, T>, data: any) => {
    const {error} = schema.safeParse(data)
    if(error) {
        return error.issues
    }

}