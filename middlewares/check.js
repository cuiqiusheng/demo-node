module.exports = {
  checkLogin: function checkLogin(req, res, next) {
    if(!req.session.user) {
      req.flash('erroe', '未登录');
      return res.redirect('/');
    }
    next();
  },

  checkNotLogin: function checkNotLogin(req, res, next) {
    if(req.session.user) {
      req.flash('error', '已登录');
      return res.redirect('back');
    }
    next();
  }
}