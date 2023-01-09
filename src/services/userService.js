import db from "../models/index";
import bcrypt from 'bcryptjs';
import { resolve } from "path";
const salt = bcrypt.genSaltSync(10);

let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};

            let isExist = await checkUserEmail(email);
            if (isExist) {
                let user = await db.user_info.findOne({
                    attributes: ['email', 'roleId', 'password'],
                    where: { email: email },
                    raw: true

                });
                if (user) {
                    let check = await bcrypt.compareSync(password, user.password);
                    // let check = true;
                    if (check) {
                        userData.errCode = 0,
                            userData.errMessage = 'ok',
                            delete user.password;
                        userData.user = user;
                    }
                    else {
                        userData.errCode = 3,
                            userData.errMessage = `Wrong password`;

                    }
                } else {
                    userData.errCode = 2,
                        userData.errMessage = `User's isn't not found`;
                }

            }
            else {
                userData.errCode = 1;
                userData.errMessage = `Your's email isn't exist your system`;

            }
            resolve(userData)
        } catch (e) {
            reject(e)
        }
    })
}
let checkUserEmail = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.user_info.findOne({
                where: { email: userEmail }
            })
            if (user) {
                resolve(true)
            } else {
                resolve(false)
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getAllUsers = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = '';

            if (userId === 'ALL') {
                users = await db.user_info.findAll({
                    attributes: {
                        exclude: ['password']
                    }
                })
            } if (userId && userId !== 'ALL') {
                users = await db.user_info.findOne({

                    where: { id: userId },
                    attributes: {
                        exclude: ['password']
                    }
                })
            }
            console.log(users);
            resolve(users)
        } catch (e) {
            reject(e);
        }
    })

}
let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        } catch (e) {
            reject(e);
        }
    })
}
let createNewUsers = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // check email is exist?
            let check = await checkUserEmail(data.email)
            if (check === true) {
                resolve({
                    errCode: 1,
                    errMessage: 'Your email is already in used. Please try another email',
                })

            } else {
                let hashPasswordFromBcrypt = await hashUserPassword(data.password);
                await db.user_info.create({
                    email: data.email,
                    password: hashPasswordFromBcrypt,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                    phonenumber: data.phone,
                    gender: data.gender === '1' ? true : false,
                    roleId: data.roleid,

                })
            }
            resolve({
                errCode: 0,
                message: 'ok'
            })
        } catch (e) {
            reject(e);
        }
    })
}

let deleteUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        let foundUser = await db.user_info.findOne({
            where: { id: userId }
        })
        if (!foundUser) {
            resolve({
                errCode: 2,
                message: `The user isn't exist`
            })
        }
        // if (foundUser) {
        //     await foundUser.destroy();
        // }
        await db.user_info.destroy({
            where: { id: userId }
        })
        resolve({
            errCode: 0,
            message: `The user is deleted`
        })
    })
}

let updataUserData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 2,
                    message: 'Missing required parameter'
                })
            }
            let user = await db.user_info.findOne({
                where: { id: data.id },
                raw: false
            })
            if (user) {
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;
                await user.save();
                // await db.user_info.save({
                //     firstName: data.firstName,
                //     lastName: data.lastName,
                //     address: data.address,
                // })
                resolve({
                    errCode: 0,
                    message: 'Update the user succeeds!'
                })

            }
            else {
                resolve({
                    errCode: 1,
                    message: 'user not found !'
                });
            }
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    handleUserLogin: handleUserLogin,
    getAllUsers: getAllUsers,
    createNewUsers: createNewUsers,
    deleteUser: deleteUser,
    updataUserData: updataUserData
}