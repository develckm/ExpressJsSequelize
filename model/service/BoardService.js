const BoardsEntity=require("../entity/BoardsEntity");
class BoardService{
    async list(pagingVo){
        const boards= await BoardsEntity.findAll()
        return boards;
    }
}
module.exports=BoardService;