import Video from "../Models/Video";

/*
console.log("start")
Video.find({}, (error, videos) => {
  if(error){
    return res.render("server-error")
  }
  return res.render("home", { pageTitle: "Home", videos });
});
console.log("finished")
*/
export const home = async (req, res) => {
  const videos = await Video.find({}).sort({createdAt:"asc"});
  return res.render("home", { pageTitle: "Home", videos });
};

export const watch = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (video) {
    return res.render("watch", { pageTitle: video.title, video: video });
  }
  return res.render("404", { pageTitle: "Video not found" });
};

export const getEdit = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id); //edit 템플릿에 video object를 보내야되서 이건 exists가 아니라 findById(아이디맞는지 정밀확인)이다
  if (!video) {
    return res.render("404", { pageTitle: "Video not found" });
  }
  return res.render("edit", { pageTitle: `Edit ${video.title}`, video: video });
};

export const postEdit = async (req, res) => {
  const { id } = req.params;
  const { title, description, hashtags } = req.body;
  const video = await Video.exists({ _id: id }); //위에와 달리 단순히 영상이 존재하는지만 확인하면 되기 때문에 exits(존재여부확인)가 맞다
  if (!video) {
    return res.render("404", { pageTitle: "Video not found" });
  }
  await Video.findByIdAndUpdate(id, {
    title: title,
    description: description,
    hashtags:Video.formatHashtags(hashtags),
  });

  return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload Video" });
};

export const postUpload = async (req, res) => {
  const { title, description, hashtags } = req.body;
  try { 
    await Video.create({
      title,
      description,
      hashtags: Video.formatHashtags(hashtags),
    });
    return res.redirect("/");
  } catch (error) {
    return res.render("upload", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }
};


export const deleteVideo= async(req,res)=>{
const {id} =req.params
await Video.findByIdAndDelete(id)
return res.redirect("/")
}

export const search = async(req,res) => {
  const {keyword} = req.query;
  let videos = []
  if(keyword){
    videos = await Video.find({
      title:{
      $regex: new RegExp(keyword,"i"),
      },
    })
  }

return res.render("search",{pageTitle:'Search video', videos})
}