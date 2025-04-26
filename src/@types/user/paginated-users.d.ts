import { RoleEnum } from 'src/enums/role.enum';
import { UserEntity } from './user.entity';

interface IPaginatedUsers {
  users: UserEntity[];
  total: number;
}

export { IPaginatedUsers };
