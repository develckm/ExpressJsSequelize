const express = require('express');
const router = express.Router();
const userService=require("../model/service/UsersService");

router.get("/login.do",(req, res)=>{
  res.render("users/login");

});
router.get("/logout.do",async (req,res)=>{
  req.session.destroy((err)=>{
    if(err) console.error(err);
    res.cookie("autoLoginPw","",{maxAge:0,signed:false})
    res.cookie("autoLoginId","",{maxAge:0,signed:false})
    res.redirect("/");
  })
});
router.post("/login.do",async (req, res) => {
  let { u_id, pw, autoLogin }=req.body;
  let user = null;
  if (u_id && pw) {
    user = await userService.login(u_id, pw);
  }
  if(user){
    req.session.loginUser=user; //session : 서버에 유지되는 정보
    const cookieOpt={
      httpOnly: true, //http 통신에서만 쿠카를 사용(쿠키 탈취 해킹 방지)
      signed: true, //암호화하겠다.
      maxAge: 7*24*60*60*1000 //현재를 기준으로 만료시간
    }
    if(autoLogin && autoLogin==="1"){
      res.cookie("autoLoginId",user.u_id,cookieOpt);
      res.cookie("autoLoginPw",user.pw,cookieOpt);

    }
    res.redirect("/");
  }else{
    res.redirect("/users/login.do");
  }
  res.end();
});


router.get('/list.do', async function(req, res) {
  req.query.page = parseInt(req.query.page) || 1;
  req.query.orderField = req.query.orderField || "post_time";
  req.query.orderDirect = req.query.orderDirect || "DESC";
  let users=null;
  try {
    users=await userService.list(req.query);
  }catch (e) {
      new Error(e);
      req.flash("actionMsg","검색 실패:"+e.message);
  }
  if(users){
    res.render("users/list",{users:users,params:req.query});
  }else {
    res.redirect("/users/list.do")
  }
});

router.get("/insert.do",(req,res)=>{
  res.render("users/insert");
});
router.post("/insert.do",async (req,res)=>{
  let insertUser=null;
  const reqBody=nullifyEmptyStrings(req.body);
  try {
    insertUser=await userService.register(reqBody);
  }catch (e) {
    console.error(e);
    req.flash("actionMsg","회원등록 실패 :"+e.message)
  }
  if(insertUser){
    req.flash("actionMsg","회원등록 성공");
    res.redirect(`/users/${insertUser.u_id}/detail.do`);
  }else{
    res.redirect("/users/insert.do");
  }
});
router.get("/:uId/detail.do",async (req, res)=>{
  console.log("/:uId/detail.do",res.locals.actionMsg);
  console.log("/:uId/detail.do",req.flash("actionMsg"));
  const user=await userService.detail(req.params.uId);
  if(user){
    res.render("users/update",{user:user});
  }else{
    res.redirect("/users/list.do");
  }
});
router.get("/:uId/delete.do", async (req, res)=>{
  let del=0;
  let errorMsg="";
  try {
    del=await userService.remove(req.params.uId);
  }catch (e) {
    console.error(e);
    errorMsg=e.message;
  }
  if(del>0){
    req.flash("actionMsg","회원삭제 성공");
    res.redirect("/users/list.do");
  }else{
    if(errorMsg){
      req.flash("actionMsg","회원삭제 실패 :"+errorMsg);
      res.redirect(`/users/${req.params.uId}/detail.do`);
    }else{
      req.flash("actionMsg","이미 삭제된 레코드입니다.");
      res.redirect(`/users/list.do`);
    }
  }
});
router.post("/update.do",async (req, res)=>{
  let update=0;
  let errorMsg="";
  try {
    const reqBody=nullifyEmptyStrings(req.body);
    update=await userService.modify(reqBody);
  }catch (e) {
    console.error(e);
    errorMsg=e.message;
  }
  if(update>0){
    req.flash("actionMsg","회원수정 성공");
    res.redirect("/users/list.do");
  }else{
    req.flash("actionMsg",(errorMsg)?"회원수정 실패 :"+e.message:"수정된 내역이 없습니다.");
    res.redirect(`/users/${req.body.u_id}/detail.do`);
  }
});

function nullifyEmptyStrings(reqBody) { //"" or "  " 파라미터 null 처리
  const result = {};

  for (const [key, value] of Object.entries(reqBody)) {
    result[key] = value.trim() === '' ? null : value;
  }

  return result;
}
module.exports = router;
