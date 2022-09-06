import { Static, Type } from '@sinclair/typebox'

const RegisterSchema = Type.Object({
  code: Type.String(),
  nickname: Type.String()
})

type RegisterType = Static<typeof RegisterSchema>

export {
  RegisterSchema,
  RegisterType
}
