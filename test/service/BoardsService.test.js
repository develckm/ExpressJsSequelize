const BoardsService=require("../../model/service/BoardService");
const boardsService=new BoardsService();
//2시까지 식사하고 오세요~
describe("BoardsService test",()=>{
    test("list",async ()=>{
        const boards=await boardsService.list();
        console.log(boards);
    })
})