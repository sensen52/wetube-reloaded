import User from "../Models/User";
import bcrypt from 'bcrypt';

export const getJoin = (req, res) => res.render("join", { pageTitle: "join" });
export const postJoin = async (req, res) => {
    console.log(req.body);
    const { name, email ,username, password,password2, location } = req.body;
    const pageTitle = "join"
    if (password !== password2){
        return res.status(400).render("join",{pageTitle, errorMessage: '비밀번호가 서로 일치하지 않습니다'})
    }
    const exists =await User.exists({$or:[{username},{email}]});
    if(exists){
        return res.status(400).render("join",{pageTitle, errorMessage: '이미 사용하고 있는 유저이름 혹은 이메일 입니다'})
    }
    try{
        await User.create({
            name,
            username,
            email,
            password,
            location
        });
        return res.redirect("/login");
    }catch(error){
        return res.status(400).render("login",{
            pageTitle:"login video",
            errorMessage:error._message
        })
    }
    
};
export const getLogin = (req, res) => res.render("login",{pageTitle:"Login"})
export const postLogin =async(req,res)=>{
    const {username,password}=req.body
    // const exists = await User.exists({username})
    const pageTitle="login"
    const user = await User.findOne({username})
    if (!user){
        return res.status(400).render("login",{pageTitle, errorMessage:`현재 입력하신 ${username}유저가 존재하지 않습니다. 확인해주세요`})
    }
    const match = await bcrypt.compare(password,user.password)
    if(!match){
        return res.status(400).render("login",{pageTitle, errorMessage:"비밀번호가 맞지 않습니다"})
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/")
}
export const edit = (req, res) => res.send("edit user");
export const remove = (req, res) => res.send("delete user");
//export default join;
export const logout = (req, res) => res.send("logout");
export const see = (req, res) => res.send("see");
