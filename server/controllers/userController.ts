import { Request, Response, NextFunction } from 'express';
import db from '../database/cloudModel';
import bcrypt from 'bcryptjs';
import { UserController, ServerError } from '../../types';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../config.js';
const secret = JWT_SECRET;

/**
 * @description Contains middleware that creates new user in database, gets all users from database for system admin, and verifies user exists before sending back user data to login component
 */
const userController: UserController = {
const userController: UserController = {
  // create new user
  createUser: async (req: Request, res: Response, next: NextFunction) => {
    const { username, email, phone, role_id } = req.body;
    const { hash } = res.locals;
    let role;

      let role: string;
      switch (role_id) {
      case '1':
        role = 'system admin';
        break;
      case '2':
        role = 'admin';
        break;
      case '3':
        role = 'user';
        break;
    }
    try {
      const createUser =
        'INSERT INTO users (username, email, password, phone, role, role_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;';
      const userDetails = [username, email, hash, phone, role, role_id];
      if (!(username || hash)) return next();
      const makeUser = await db.query(createUser, userDetails);
      const newUser = await makeUser.rows[0];
      res.locals.user = newUser;
      return next();
    } catch (err: unknown) {
      return next({
        log: `Error in userController newUser: ${err}`,
        message: {
          err: 'An error occurred creating new user in database. See userController.newUser.',
        },
      });
    }
  },

  getAllUsers: (req: Request, res: Response, next: NextFunction) => {

    if ('error' in res.locals) {
      return next();
    } else {
      const allUsers = 'SELECT * FROM users ORDER BY username ASC;';
      db.query(allUsers)
        .then((response: { rows: UserInfo[] }): void => {


          res.locals.users = response.rows;
          return next();
        })
        .catch((err: ServerError): void => {
          return next({
            log: `Error in userController getAllUsers: ${err}`,
            message: {
              err: 'An error occurred retrieving all users from database. See userController.getAllUsers.',
            },
          });
        });
    }
  },

  // get information for one user
  getOneUser: (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.body;
    const oneUser = `SELECT * FROM users WHERE _id = $1;`;

    db.query(oneUser, [_id])
      .then((response: any) => {
        res.locals.users = response.rows;
        return next();
      })
      .catch((err: ServerError): void => {
        return next({
          log: `Error in userController getOneUser: ${err}`,
          message: {
            err: 'An error occurred retrieving user from database. See userController.getOneUser.',
          },
        });
      });
  },

  // verify user exists and send back user info
  verifyUser: (req: Request, res: Response, next: NextFunction) => {
    if (res.locals.error) return next();

    const { username, password } = req.body;

    const getUser = `SELECT * FROM users WHERE username=$1;`;

    db.query(getUser, [username])
      .then(async (data: any) => {
        const match = await bcrypt.compare(password, data.rows[0].password);
        if (!(data.rows[0] || match)) {
          return next({
            log: `Error in userController's verifyUser method`,
            status: 400,
            message: {
              err: 'Unable to verify user credentials.',
            },
          });
        }
        const verifiedUser = data.rows[0];
        console.log('verified user', verifiedUser);
        res.locals.verifiedUser = verifiedUser;
        const verifiedRole = verifiedUser.role;
        if (verifiedRole === 'system admin') {
          await jwt.sign({ verifiedRole }, secret, (err, token) => {
            if (err) {
              return next({
                log: 'Error in JWT sign in verifyUser',
                status: 400,
                message: { err: 'Unable to verify the User' },
              });
            }
            res.locals.token = token;
            return next();
          });
        }
      })
      .catch((err: ServerError): void => {
        return next({
          log: `Error in userController checkUserExists: ${err}`,
          message: {
            err: 'An error occurred while checking if username exists. See userController.checkUserExists.',
          },
        });
      });
  },

  updatePassword: (req: Request, res: Response, next: NextFunction) => {
    // if there is an error property on res.locals, return next(). i.e., incorrect password entered
    if (Object.prototype.hasOwnProperty.call(res.locals, 'error')) {
      res.locals.error =
        'Incorrect password. Please enter the correct password to update it.';
      return next();
    }
    const { hash } = res.locals;
    const { username } = req.body;

    // Note: for future, have the query return every column but the password column. Might be a security concern to be sending the user's hashed password to the client.

    const query =
      'UPDATE users SET password = $1 WHERE username = $2 RETURNING *;';
    const parameters = [hash, username];

    db.query(query, parameters)
      .then((data: any) => {
        res.locals.user = data.rows[0];
        delete res.locals.user.password;
        return next();
      })
      .catch((err: ServerError) => {
        return next({
          log: `Error in userController updatePassword: ${err}`,
          message: {
            err: 'An error occurred while checking if username exists. See userController.updatePassword.',
          },
        });
      });
  },

  updatePhone: (req: Request, res: Response, next: NextFunction) => {
    const { username, phone } = req.body;

    const query =
      'UPDATE users SET phone = $1 WHERE username = $2 RETURNING *;';
    const parameters = [phone, username];

    db.query(query, parameters)
      .then((data: any) => {
        res.locals.user = data.rows[0];
        return next();
      })
      .catch((err: ServerError) => {
        return next({
          log: `Error in userController updatePhone: ${err}`,
          message: {
            err: 'An error occurred while checking if username exists. See userController.updatePhone.',
          },
        });
      });
  },

  updateEmail: (req: Request, res: Response, next: NextFunction) => {
    const { username, email } = req.body;

    const query =
      'UPDATE users SET email = $1 WHERE username = $2 RETURNING *;';
    const parameters = [email, username];

    db.query(query, parameters)
      .then((data: any) => {
        res.locals.user = data.rows[0];
        return next();
      })
      .catch((err: ServerError) => {
        return next({
          log: `Error in userController updateEmail: ${err}`,
          message: {
            err: 'An error occurred while checking if username exists. See userController.updateEmail.',
          },
        });
      });
  },
};

export default userController;

//not currently in use.

// switches role of user upon designation by system admin
// switchUserRole: (req: Request, res: Response, next: NextFunction) => {
//   const roleMap: { [k: string]: number } = {
//     'system admin': 1,
//     admin: 2,
//     user: 3,
//   };

//   const { _id, role } = req.body;

//   if (res.locals.sysAdmins === 1 && _id == res.locals.id) {
//     res.locals.hasError = true;
//     next();
//   } else {
//     const query =
//       'UPDATE users SET role = $1, role_id = $2 WHERE _id = $3 RETURNING *;';

//     const parameters = [role, roleMap[role], _id];

//     db.query(query, parameters)
//       .then((data: any) => {
//         res.locals.role = data.rows[0].role;
//         res.locals.hasError = false;
//         return next();
//       })
//       .catch((err: ServerError) => {
//         return next({
//           log: `Error in userController switchUserRole: ${err}`,
//           message: {
//             err: 'An error occurred while switching roles. See userController.switchUserRole.',
//           },
//         });
//       });
//   }
// },
