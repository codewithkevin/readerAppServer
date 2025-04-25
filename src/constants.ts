//Access Based 
export enum RoleEnums {
    Admin = 'admin',
    User = 'user',
    Seller = 'seller'
}

export const RoleSatuses = [
    RoleEnums.Admin,
    RoleEnums.User,
    RoleEnums.Seller
]

//Account State 
export enum AccountStatusEnum {
    Active = 'active',
    Inactive = 'inactive',
    Suspended = 'suspended',
    Deactivated = 'deactivated'
}

export const AccountStatuses = [
    AccountStatusEnum.Active,
    AccountStatusEnum.Inactive,
    AccountStatusEnum.Suspended,
    AccountStatusEnum.Deactivated
];

//Sign Up Metthods 