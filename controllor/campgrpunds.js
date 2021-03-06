const Campground = require('../models/campground');
const { cloudinary } = require("../cloudinary");

module.exports.index=async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
};

module.exports.newCampground=(req, res) => {
    res.render('campgrounds/new');
};

module.exports.createCampground=async (req, res) => {
    const campground = new Campground(req.body.campground);
    campground.image=req.files.map(f=>({url:f.path,filename:f.filename}));
    campground.author=req.user._id;
    await campground.save();
    req.flash('success','LOLOLOLOL Successfully!!')
    res.redirect(`/campgrounds/${campground._id}`)
};

module.exports.showCampground=async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate({
        path:'reviews',
        populate:{
            path:'author'
        }
    }).populate('author');
    if(!campground){
        req.flash('error','Mu YOU LAAAAAA');
        return res.redirect(`/campgrounds`);
    }
    res.render('campgrounds/show', { campground });
};

module.exports.renderEditForm=async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
};

// module.exports.editCampground= async (req, res) => {
//     const { id } = req.params;
//     const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
//     const imgs=req.files.map(f=>({url:f.path,filename:f.filename}));
//     campground.image.push(...imgs)
//     await campground.save();
//     if (req.body.deleteImages){
//         for (let filename of req.body.deleteImages) {
//             await cloudinary.uploader.destroy(filename);
//         }
        
//         for (let i =0 ; i<req.body.deleteImages.length;i++){
//             const deletImage=req.body.deleteImages[i]
//             console.log(deletImage)
//             await campground.updateMany({},{ $pull: { image: { filename:{ $in: req.body.deleteImages}} } })
//         }
//     }
//     req.flash('success','Ohye Successfully!!')
//     res.redirect(`/campgrounds/${campground._id}`)
// };

module.exports.editCampground = async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    if (req.body.deleteImages) {
        count=0;
        for (let i of req.body.deleteImages){
            i=i-count;
            const f=campground.image[i].filename
            await cloudinary.uploader.destroy(f);
            campground.image.splice(i,1);
            count++
            await campground.save();
        }
    }
    campground.image.push(...imgs);
    console.log(campground.image);
    await campground.save();
    // if (req.body.deleteImages) {
    //     // for (let filename of req.body.deleteImages) {
    //     //     await cloudinary.uploader.destroy(filename);
    //     // }
    //     // await campground.updateOne({ $pull: { image: { filename: 'YelpCamp/v7bbapkjhspx2jutymlk ' } } })
    //     // for (let i=0;i<campground.image.length;i++){
    //     //     for (let j=0;j<req.body.deleteImages.length;j++){
    //     //         console.log(String(campground.image[i].filename)===String(req.body.deleteImages[j]));
    //     //         console.log(req.body.deleteImages[j])
    //     //         if (campground.image[i].filename==req.body.deleteImages[j]){
    //     //             console.log(campground.image);
    //     //             campground.image.splice(i,1)
    //     //             console.log(campground.image);
    //     //             await campground.save();
    //     //         }
    //     //     }
    //     // }
    // }
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${campground._id}`)
};

module.exports.deleteCampground=async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success','Ohlalalalal Successfully!!')
    res.redirect('/campgrounds');
};