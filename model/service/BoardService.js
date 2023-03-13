const sequelize=require("../webAppBoardSequelize");
const boardsEntity=require("../entity/BoardsEntity")(sequelize);
const usersEntity=require("../entity/UsersEntity")(sequelize);
const boardRepliesEntity=require("../entity/BoardRepliesEntity")(sequelize);
const PageVo=require("../vo/PageVo");

class BoardService{
    async detail(bId){
        //boardRepliesEntity 를 만들어서 BoardService.detail 을 호출할때 리플리스트를 지연로딩 구현하라!

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
        })

        //findOne :무조건 1개의 결과를 반환
        const board=await boardsEntity.findOne({
            where : {
                b_id:bId
            },
            include:[
                {
                    foreignKey :"b_id",
                    model:boardRepliesEntity,
                    as : "replies",
                    required: false, //댓글이 없는 게시글도 출력(left join)
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
                                required: false, //댓글이 없는 게시글도 출력(left join)
                                include : [{
                                    targetKey :"br_id",
                                    foreignKey :"parent_br_id",
                                    model :boardRepliesEntity,
                                    as : "replies",
                                    required: false
                                }]
                            }
                        ]
                    }]
                }
            ]
            // include 옵션을 사용하면 Eager Loading(즉시로딩) 조인으로 user를 불러온다.
            // include:[
            //     {
            //         model:usersEntity,
            //         as: "user",
            //         required: true, //true : inner join,false : left join
            //         //attributes:["email","name"]
            //     }
            // ]
        });
        return board;
    }



    async list(reqParams){
        const whereObj={};
        const orderArr=[];
        if(reqParams.field && reqParams.value){
            whereObj[reqParams.field]=reqParams.value;
        }//{"status":"PUBLIC"}
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
        //console.log(JSON.stringify(pageVo.totalRow))
        return boards;
    }
}
module.exports=BoardService;