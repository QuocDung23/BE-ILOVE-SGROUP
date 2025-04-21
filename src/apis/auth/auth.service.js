import { UserRepository } from '../../repositories/users.repository.js'

const userRepo = new UserRepository();

class AuthService {
    async example(username, password) {
        try {
          const newUser = await userRepo.create({
            name: username,
            password: password
          });
          
          console.log('Created user:', newUser);
          
          const allUsers = await userRepo.getAll();
          console.log('All users:', allUsers);
        } catch (error) {
          console.error('Error:', error.message);
        }
      }
}


export default new AuthService();