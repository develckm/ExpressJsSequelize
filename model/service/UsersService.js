const sequelize=require("../webAppBoardSequelize");
const PageVo = require("../vo/PageVo");
const usersEntity=require("../entity/UsersEntity")(sequelize);
const {Op}=require("sequelize");
class UsersService{
    async list(reqParams){
        const whereObj={};
        const orderArr=[];
        if(reqParams.field && reqParams.value){
            whereObj[reqParams.field]={[Op.like]:`%${reqParams.value}%`};
        }
        if(reqParams.orderField && reqParams.orderDirect){
            orderArr.push(reqParams.orderField);
            orderArr.push(reqParams.orderDirect);
        }
        const totalCnt=await usersEntity.count({
            where: whereObj
        })

        const pageVo=new PageVo(reqParams.page,totalCnt,reqParams);
        try {
            const users= await usersEntity.findAll({
                offset:pageVo.offset,
                limit:pageVo.rowLength,
                where:whereObj,
                order:[orderArr]
            })
            users.pageVo=pageVo;

            return users;
        }catch (e) {
            new Error(e);
        }
    }
    async detail(uId){
        try {
            return await usersEntity.findByPk(uId);
        }catch (e) {
            new Error(e);
        }
    }

    async login(uId,pw){
        try {
            return await usersEntity.findOne({where:{u_id:uId,pw:pw}});
        }catch (e) {
            new Error(e);
        }
    }


    async permissionModify(uId,permission){
        try {
            const[affectedRows, affectedObjects]=await usersEntity.update(
                {permission:permission},
                {where:{u_id:uId}});
            return affectedRows;
        }catch (e) {
            new Error(e);
        }
    }
    async modify(user){
        try {
            const[affectedRows, affectedObjects]=await usersEntity.update(
                user,
                {where:{u_id:user.u_id}});
            return affectedRows;
        }catch (e) {
            new Error(e);
        }
    }
    async register(user){
        try {
            const createUser=await usersEntity.create(user);
            return createUser;
        }catch (e) {
            new Error(e);
        }
    }
    async remove(uId){
        try {
            const affectedRows=await usersEntity.destroy({where:{u_id:uId}});
            return affectedRows;
        }catch (e) {
            console.error(e)
            new Error(e);
        }
    }
}


module.exports=new UsersService(); //라우터에서 최종 사용!