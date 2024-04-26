const User = require("../models/UserModel")
const bcrypt = require("bcrypt")
const { generalAccessToken, generalRefreshAccessToken } = require("./JwtService")

const createUser = (newUser) => {
    return new Promise(async (resolve, reject) => {
        const { avatar, email, password, confirmPassword, role, information } = newUser;
        const hash = bcrypt.hashSync(password, 10);
        const checkEmail = await User.findOne({ email: email });
        try {
            if (checkEmail) {
                reject({
                    status: "ERR",
                    message: "That email already exists, please choose another one."
                });
                return; // Cần return để kết thúc việc xử lý khi có lỗi xảy ra
            }

            if (password !== confirmPassword) {
                reject({
                    status: "ERR",
                    message: "Password and confirm password do not match."
                });
                return; // Cần return để kết thúc việc xử lý khi có lỗi xảy ra
            }

            const createUser = await User.create({
                avatar,
                email,
                password: hash,
                role: role || 'customer', // Sử dụng giá trị mặc định chỉ khi role không được cung cấp
                information
            });

            resolve({
                status: "OK",
                message: "User created successfully.",
                data: createUser
            });
        } catch (error) {
            reject(error);
        }
    });
};

const loginUser = (userLogin) => {
    return new Promise(async (resolve, reject) => {
        const { email, password } = userLogin
        const checkUser = await User.findOne({ email: email })
        try {
            if (checkUser === null) {
                resolve({
                    status: "ERR",
                    message: "That user not exits"
                })
            }
            const comparePassword = bcrypt.compareSync(password, checkUser.password)
            if (!comparePassword) {
                resolve({
                    status: "ERR",
                    message: "The password or email is incorrect"
                })
            }
            const access_token = await generalAccessToken({ id: checkUser.id, role: checkUser.role })
            const refresh_token = await generalRefreshAccessToken({ id: checkUser.id, role: checkUser.role })
            resolve({
                status: "OK",
                message: "SUCCESS",
                access_token,
                refresh_token
            })
        }
        catch (e) {
            reject(e)
        }
    })
}

const updateUser = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = User.findOne({ _id: id })
            if (checkUser === null) {
                resolve({
                    status: 'ERR',
                    message: 'The user is not defined'
                })
            }
            const update = await User.findByIdAndUpdate(id, data, { new: true })
            resolve({
                status: "OK",
                message: "SUCCESS",
                data: update
            })
        }
        catch (e) {
            reject(e)
        }
    })
}

const adminUpdateUser = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = User.findOne({ _id: id })
            if (checkUser === null) {
                resolve({
                    status: 'ERR',
                    message: 'The user is not defined'
                })
            }
            const update = await User.findByIdAndUpdate(id, data, { new: true })
            resolve({
                status: "OK",
                message: "SUCCESS",
                data: update
            })
        }
        catch (e) {
            reject(e)
        }
    })
}

const deleteUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = User.findOne({ _id: id })
            if (checkUser === null) {
                resolve({
                    status: 'ERR',
                    message: 'The user is not defined'
                })
            }
            const update = await User.findByIdAndDelete(id)
            resolve({
                status: "OK",
                message: "SUCCESS",
                data: update
            })
        }
        catch (e) {
            reject(e)
        }
    })
}

const getAll = (limit, page, keysearch) => {
    return new Promise(async (resolve, reject) => {
        try {
            let totalItem = await User.countDocuments()
            const totalPage = Math.ceil(totalItem / limit)
            if (keysearch) {
                const escapedValue = keysearch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                const regex = new RegExp(escapedValue, 'i');
                const dataFilter = await User.find({ 'information.name': regex });
                totalItem = dataFilter.length;
                resolve({
                    status: "OK",
                    message: "Success",
                    data: dataFilter,
                    total: totalItem,
                    // pageCurrent: Number(page + 1),
                    // totalPage: totalPage,
                });
            }
            if (page + 1 > totalPage) {
                resolve({
                    status: "ERR",
                    message: "This page is not available",
                })
            }
            const data = await User.find().limit(limit).skip(limit * page).exec()
            resolve({
                status: "OK",
                message: "SUCCESS",
                data: data,
                total: totalItem,
                pageCurrent: Number(page + 1),
                totalPage: totalPage
            })
        }
        catch (e) {
            reject(e)
        }
    })
}

const getAllCustomer = (limit, page, sort, filter, keysearch) => {
    return new Promise(async (resolve, reject) => {
        try {
            let query = { role: 'customer' }; // Bắt đầu với điều kiện lọc người dùng có vai trò là 'customer'
            let totalItem = await User.countDocuments(query);
            const totalPage = Math.ceil(totalItem / limit);
            if (filter) {
                const label = filter[0];
                const escapedValue = filter[1].replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                const regex = new RegExp(escapedValue, 'i');
                query[label] = regex; // Thêm điều kiện filter vào query
                const dataFilter = await User.find(query);
                let totalItem = dataFilter.length
                let totalPage = Math.ceil(totalItem / limit);
                resolve({
                    status: "OK",
                    message: "Success",
                    data: dataFilter,
                    total: dataFilter.length,
                    pageCurrent: 1,
                    totalPage: 1,
                });
            }
            if (sort) {
                const objectSort = {};
                objectSort[sort[1]] = sort[0];
                const dataSort = await User.find(query).limit(limit).skip(page * limit).sort(objectSort);
                resolve({
                    status: "OK",
                    message: "Success",
                    data: dataSort,
                    total: totalItem,
                    pageCurrent: Number(page + 1),
                    totalPage: Math.ceil(totalItem / limit),
                });
            }
            if (keysearch) {
                const escapedValue = keysearch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                const regex = new RegExp(escapedValue, 'i');
                query.$or = [
                    { 'information.name': regex },
                    { 'email': regex }
                ];
            }
            if (page + 1 > totalPage) {
                resolve({
                    status: "ERR",
                    message: "This page is not available",
                });
                return;
            }

            const data = await User.find(query).limit(limit).skip(limit * page).exec();
            resolve({
                status: "OK",
                message: "SUCCESS",
                data: data,
                total: totalItem,
                pageCurrent: Number(page + 1),
                totalPage: totalPage
            });
        } catch (error) {
            reject(error);
        }
    });
};

const getAllMember = (limit, page, sort, filter, keysearch) => {
    return new Promise(async (resolve, reject) => {
        try {
            let query = { $or: [{ role: 'admin' }, { role: 'member' }] }; // Điều kiện tìm kiếm admin hoặc member
            let totalItem = await User.countDocuments(query);
            const totalPage = Math.ceil(totalItem / limit);
            if (filter) {
                const label = filter[0];
                const escapedValue = filter[1].replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                const regex = new RegExp(escapedValue, 'i');
                query[label] = regex; // Thêm điều kiện filter vào query
                const dataFilter = await User.find(query);
                let totalItem = dataFilter.length
                let totalPage = Math.ceil(totalItem / limit);
                resolve({
                    status: "OK",
                    message: "Success",
                    data: dataFilter,
                    total: dataFilter.length,
                    pageCurrent: 1,
                    totalPage: 1,
                });
            }
            if (sort) {
                const objectSort = {};
                objectSort[sort[1]] = sort[0];
                const dataSort = await User.find(query).limit(limit).skip(page * limit).sort(objectSort);
                resolve({
                    status: "OK",
                    message: "Success",
                    data: dataSort,
                    total: totalItem,
                    pageCurrent: Number(page + 1),
                    totalPage: Math.ceil(totalItem / limit),
                });
            }
            if (keysearch) {
                const escapedValue = keysearch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                const regex = new RegExp(escapedValue, 'i');
                query.$or = [
                    { 'information.name': regex },
                    { 'email': regex }
                ];
            }
            if (page + 1 > totalPage) {
                resolve({
                    status: "ERR",
                    message: "This page is not available",
                });
                return;
            }

            const data = await User.find(query).limit(limit).skip(limit * page).exec();
            resolve({
                status: "OK",
                message: "SUCCESS",
                data: data,
                total: totalItem,
                pageCurrent: Number(page + 1),
                totalPage: totalPage
            });
        } catch (error) {
            reject(error);
        }
    });
};

const getDetailsUser = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findOne({ _id: id })
            if (user === null) {
                resolve({
                    status: 'ERR',
                    message: 'The user is not defined'
                })
            }

            resolve({
                status: "OK",
                message: "SUCCESS",
                data: user
            })
        }
        catch (e) {
            reject(e)
        }
    })
}

const getUsersInfo = async () => {
    try {
        const users = await User.find().select('information.name information.avatar email').exec();
        return {
            status: "OK",
            message: "SUCCESS",
            data: users
        };
    } catch (error) {
        throw new Error(error);
    }
}

module.exports = {
    createUser,
    loginUser,
    updateUser,
    adminUpdateUser,
    deleteUser,
    getAll,
    getAllCustomer,
    getAllMember,
    getDetailsUser,
    getUsersInfo
}