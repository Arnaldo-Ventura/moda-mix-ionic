import { UserTypeEnum } from 'src/app/shared/enums/user-type.enum'

export class Supplier {

    _id: string
    name: string
    type: UserTypeEnum.SUPPLIER
    active: boolean
}