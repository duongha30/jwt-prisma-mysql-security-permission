import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 20, { message: 'Username must be between 3 and 20 characters' })
  username!: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail({}, { message: 'Invalid email address' })
  email!: string;

  @IsString()
  @IsNotEmpty()
  @Length(4, 20, { message: 'Password must be between 4 and 20 characters' })
  password!: string;
}
