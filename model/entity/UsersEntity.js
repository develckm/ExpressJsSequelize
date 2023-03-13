//const sequelize=require("../webAppBoardSequelize");
const {Sequelize,DataTypes}=require("sequelize");

module.exports=(sequelize)=>{
    const usersEntity=sequelize.define("usersEntity",{
        u_id:{
            type:DataTypes.STRING(255),
            primaryKey:true
        },
        pw:{
            type:DataTypes.STRING(255),
            allowNull:false
        },
        name:{
            type:DataTypes.STRING(255),
            allowNull:false
        },
        phone:{
            type:DataTypes.STRING(20),
            allowNull:false,
            unique:true
        },
        img_path:{
            type:DataTypes.STRING(255),
        },
        email:{
            type:DataTypes.STRING(255),
            allowNull:false,
            unique:true
        },
        post_time:{
            type:DataTypes.DATE,
            allowNull:false,
            defaultValue:Sequelize.literal("CURRENT_TIMESTAMP")
        },
        birth:{
            type:DataTypes.DATE,
            allowNull:false
        },
        gender:{
            type:DataTypes.ENUM("FEMALE","MALE","NONE"),
            allowNull:false
        },
        address:{
            type:DataTypes.STRING(255),
        },
        detail_address:{
            type:DataTypes.STRING(255),
        },
        permission:{
            type:DataTypes.ENUM("ADMIN","USER","SILVER","GOLD","PRIVATE"),
            allowNull:false
        }
    },{
        tableName:"users",
        timestamps:false //creat_at,update_at 두개의 필드가 있다는 전제로 맵핑
    });
    return usersEntity;
}




//Object Relationship Mapping (ORM)
//orm 으로 생성한 table 을 맵핑하는 객체를 Entity 라 부른다.
//entity 는 dto 와 유사하지만 table 명세가 더 상세하고 ORM 라이브러리가 entity 기반으로 쿼리 생성이 가능
