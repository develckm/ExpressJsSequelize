const sequelize=require("../webAppBoardSequelize");
const boardsEntity=require("../entity/BoardsEntity")(sequelize);
const usersEntity=require("../entity/UsersEntity")(sequelize);
const boardRepliesEntity=require("../entity/BoardRepliesEntity")(sequelize);
const PageVo=require("../vo/PageVo");
const {Op} = require("sequelize");

class BoardsService {
    async detail(bId){
        try {
            //boardRepliesEntity 를 만들어서 BoardsService.detail 을 호출할때 리플리스트를 지연로딩 구현하라!
            //Boards : Users = N : 1 (belongsTo)
            boardsEntity.belongsTo(usersEntity,{
                foreignKey : "u_id", //boards 참조하는 users 의 외래키
                as: "user" //JOIN or 지연로딩일때 user를 가져왔을 때 board 에 생성되는 필드
            });
            boardsEntity.hasMany(boardRepliesEntity,{
                foreignKey :"b_id", //boards 참조하는 board_replies 의 외래키
                as:"replies",
                //where:{parent_br_id:null} //대댓글은 제외가 안됨
            });//Boards : Replies = 1:N (hasMany)
            //지연로딩은 조건을 줄 수 없다.
            //replies(br_id) : replies(parent_br_id) 1 : N
            boardRepliesEntity.hasMany(boardRepliesEntity,{
                foreignKey : "parent_br_id", //댓글을 참조하는 대댓의 외래키
                as : "replies"
            });
            const board=await boardsEntity.findOne({
                where : {
                    b_id:bId
                },
                include:[
                    {
                        foreignKey :"b_id",
                        model:boardRepliesEntity,
                        as : "replies",
                        required: false,
                        where : { parent_br_id:null },
                        include : [{
                            targetKey :"br_id",
                            foreignKey :"parent_br_id",
                            model :boardRepliesEntity,
                            as : "replies",
                            required: false,
                            include:[
                                {
                                    targetKey :"br_id",
                                    foreignKey :"parent_br_id",
                                    model:boardRepliesEntity,
                                    as : "replies",
                                    required: false,
                                }
                            ]
                        }]
                    }
                ]
            });
            return board;
        }catch (e) {
            new Error(e)
        }
    }

    async list(reqParams){
        try {
            const whereObj={};
            const orderArr=[];
            if(reqParams.field && reqParams.value){
                whereObj[reqParams.field]={[Op.like]:`%${reqParams.value}%`};
            }
            if(reqParams.orderField && reqParams.orderDirect){
                orderArr.push(reqParams.orderField);
                orderArr.push(reqParams.orderDirect);
            }
            const totalCnt=await boardsEntity.count({
                where: whereObj
            })
            console.log(JSON.stringify(whereObj));
            const pageVo=new PageVo(reqParams.page,totalCnt,reqParams);
            const boards= await boardsEntity.findAll({
                offset:pageVo.offset,
                limit:pageVo.rowLength,
                where:whereObj,
                order:[orderArr]
            })
            boards.pageVo=pageVo;
            return boards;
        }catch (e) {
            new Error(e);
        }
    }


    async modify(board){
        try {
            let modify=await boardsEntity.update(board,{where:{b_id:board.b_id}})
            return modify;
        }catch (e) {
            new Error(e);
        }
    }
    async remove(bId){
        try {
            let del=await boardsEntity.destroy({where:{b_id:bId}});
            return del;
        }catch (e) {
            new Error(e);
        }
    }
    async register(board) {
        try {
            return boardsEntity.create(board);
        }catch (e) {
            new Error(e);
        }
    }


}
module.exports=BoardsService;