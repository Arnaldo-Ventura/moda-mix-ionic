import { UserTypeEnum } from 'src/app/shared/enums/user-type.enum'
import { Permission } from '../../permissions/models/permissions'
import { Unit } from 'src/app/shared/models/unit'

export class User{
    _id: string
    name: string
    email: string
    password: string 
    per:Permission
    active: boolean
    type:UserTypeEnum.USER
    visible: boolean
    unit:Unit[]   
}