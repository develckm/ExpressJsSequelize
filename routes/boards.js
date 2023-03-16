const express = require('express');
const router = express.Router();
const BoardService=require("../model/service/BoardsService");
const boardService=new BoardService();
router.get('/list.do', async (req,res)=>{
    req.query.page = parseInt(req.query.page) || 1;
    req.query.orderField = req.query.orderField || "post_time";
    req.query.orderDirect = req.query.orderDirect || "DESC";

    const boards=await boardService.list(req.query);
    res.render("boards/list",{boards:boards,params:req.query});
});

router.get("/insert.do", (req,res)=>{
    res.render("boards/insert");
});
// router.post("/insert.do",async (req,res)=>{
//     let insert=0;
//     try{
//         insert=await boardService.register(req.body);
//     }catch(e){
//         console.error(e);
//     }
//     if(insert>0) {
//         res.redirect("/boards/list.do");
//     }else {
//         res.redirect("/boards/insert.do");
//     }
// });
//
// router.get("/:bId/detail.do", async (req,res)=>{
//     const board=await boardService.detail(req.params.bId);
//     //console.log(board);
//     if(board) {
//         res.render("boards/update", {board:board});
//     }else {
//         res.redirect("/boards/list.do");
//     }
// })
//
// router.post("/update.do",async (req,res)=>{
//    // for(let key in req.body){
//    //     if(key!=="bi_id" && !req.body[key].trim()) { // bi_id=>[].trim() 오류
//    //         req.body[key]=null;
//    //     }
//    // }
//    console.log("req.body",req.body);
//    let update=0;
//    update=await boardService.modify(req.body);
//    if(update>0){
//        res.redirect("/boards/list.do");
//    }else {
//        res.redirect(`/boards/${req.body.b_id}/detail.do`);
//    }
// });
//
// router.get("/:bId/delete.do", async (req,res)=>{
//    let del=0;
//    try{
//        del=await boardService.remove(req.params.bId);
//    }catch(e){
//        console.error(e);
//    }
//     if(del>0){
//         res.redirect("/boards/list.do");
//     }else{
//         res.redirect(`/boards/${req.params.bId}/detail.do`);
//     }
// });


module.exports=router;