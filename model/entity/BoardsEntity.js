const sequelize=require("../webAppBoardSequelize");
const {DataType,Sequelize, DataTypes}=require("sequelize");

const boardsEntity=sequelize.define("boardsEntity",{
    b_id:{
        type:DataTypes.INTEGER.UNSIGNED,
        primaryKey:true,
        autoIncrement:true
    },
    u_id:{
        type:DataTypes.STRING(255),
        allowNull:false,
        references:{
            model:"usersEntity",
            key:"u_id",
            onDelete:"CASCADE",
            onUpdate:"CASCADE"
        }
    },
    post_time:{
        type:DataTypes.DATE,
        defaultValue:Sequelize.literal("CURRENT_TIMESTAMP")
    },
    update_time:{
        type:DataTypes.DATE,
        defaultValue:Sequelize.literal("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP")
    },
    status:{
        type:DataTypes.ENUM("PUBLIC","PRIVATE","REPORT","BLOCK"),
        defaultValue:"PUBLIC"
    },
    title:{
        type:DataTypes.STRING(255)
    },
    content:{
        type:DataTypes.TEXT,
        allowNull:false
    },
    view_count:{
        type:DataTypes.INTEGER.UNSIGNED,
        defaultValue:0
    }
},{
    tableName:"boards",
    timestamps:false
});
module.exports=boardsEntity;