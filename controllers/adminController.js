// controllers/adminController.js
import * as postService from '../services/postService.js';
import * as reportService from '../services/reportService.js';
import User from '../models/User.js';
import Post from '../models/Post.js';
import Report from '../models/Report.js';
import bcrypt from 'bcryptjs';

export const getLogin = (req, res) => {
  if (req.session.user && req.session.user.role === 'admin') {
    return res.redirect('/admin/dashboard');
  }
  res.render('auth/login', {
    error: req.flash('error'),
    success: req.flash('success')
  });
};

export const postLogin = async (req, res) => {
  try {
    const { email, mdp } = req.body;

    console.log('🔐 Login attempt:', { email, mdp: mdp ? '***' : 'empty' });

    if (!email || !mdp) {
      req.flash('error', 'Email et mot de passe requis');
      return res.redirect('/admin/login');
    }

    const user = await User.findOne({ email });
    console.log('👤 User found:', user ? `${user.email} (${user.role})` : 'not found');

    if (!user) {
      req.flash('error', 'Identifiants invalides');
      return res.redirect('/admin/login');
    }

    //  Compare bcrypt hashed password
    const isValidPassword = await bcrypt.compare(mdp, user.pwd);
    console.log('🔑 Password valid:', isValidPassword);

    if (!isValidPassword) {
      req.flash('error', 'Identifiants invalides');
      return res.redirect('/admin/login');
    }

    if (user.role !== 'admin') {
      req.flash('error', 'Accès refusé. Administrateurs uniquement.');
      return res.redirect('/admin/login');
    }

    //  Set session
    req.session.user = {
      userId: user._id,
      nickname: user.nickname,
      email: user.email,
      role: user.role
    };

    console.log(' Session created:', req.session.user);
    req.flash('success', 'Connexion réussie');
    res.redirect('/admin/dashboard');
  } catch (err) {
    console.error('❌ Login error:', err);
    req.flash('error', 'Erreur lors de la connexion');
    res.redirect('/admin/login');
  }
};

export const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
    }
    res.redirect('/admin/login');
  });
};

export const getDashboard = async (req, res) => {
  try {
    const totalPosts = await Post.countDocuments();
    const totalReports = await Report.countDocuments();
    const totalUsers = await User.countDocuments();
    const pendingPosts = await Post.countDocuments({ status: 'proposé' });
    const pendingReports = await Report.countDocuments({ status: 'en attente' });

    const recentPosts = await Post.find()
      .populate('author', 'nickname email')
      .populate('bus', 'numero')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentReports = await Report.find()
      .populate('reporter', 'nickname email')
      .populate('reportedPost')
      .sort({ date: -1 })
      .limit(5);

    res.render('admin/dashboard', {
      user: req.session.user,
      totalPosts,
      totalReports,
      totalUsers,
      pendingPosts,
      pendingReports,
      recentPosts,
      recentReports
    });
  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).render('error', { error: err.message });
  }
};

// ==================== POSTS ====================
export const getPosts = async (req, res) => {
  try {
    // Default to 'proposé' if no status provided
    const status = req.query.status || 'proposé';
    const type = req.query.type || '';

    let query = {};

    // Only add status filter if it's not empty string (when "Tous" is selected)
    if (status) {
      query.status = status;
    }

    if (type) {
      query.type = type;
    }

    const posts = await Post.find(query)
      .populate('author', 'nickname email role')
      .populate('bus', 'numero')
      .sort({ createdAt: -1 });

    res.render('admin/posts', {
      user: req.session.user,
      posts,
      currentStatus: status,
      currentType: type
    });
  } catch (err) {
    console.error('Get posts error:', err);
    res.status(500).render('error', { error: err.message });
  }
};
export const updatePostStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    await postService.updateStatus(id, status);

    req.flash('success', `Post ${status} avec succès`);
    res.redirect('/admin/posts');
  } catch (err) {
    console.error('Update post status error:', err);
    req.flash('error', err.message);
    res.redirect('/admin/posts');
  }
};

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    await postService.removePost(id);

    req.flash('success', 'Post supprimé avec succès');
    res.redirect('/admin/posts');
  } catch (err) {
    console.error('Delete post error:', err);
    req.flash('error', err.message);
    res.redirect('/admin/posts');
  }
};

// ==================== REPORTS ====================
export const getReports = async (req, res) => {
  try {
    // Default to 'en attente' if no status provided
    const status = req.query.status || 'en attente';

    let query = {};

    // Only add status filter if it's not empty string (when "Tous" is selected)
    if (status) {
      query.status = status;
    }

    const reports = await Report.find(query)
      .populate('reporter', 'nickname email')
      .populate({
        path: 'reportedPost',
        populate: [
          { path: 'author', select: 'nickname email' },
          { path: 'bus', select: 'numero' }
        ]
      })
      .sort({ date: -1 });

    res.render('admin/reports', {
      user: req.session.user,
      reports,
      currentStatus: status
    });
  } catch (err) {
    console.error('Get reports error:', err);
    res.status(500).render('error', { error: err.message });
  }
};

export const updateReportStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    await reportService.updateReportStatus(id, status);

    req.flash('success', `Signalement ${status} avec succès`);
    res.redirect('/admin/reports');
  } catch (err) {
    console.error('Update report status error:', err);
    req.flash('error', err.message);
    res.redirect('/admin/reports');
  }
};

// ==================== USERS ====================
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });

    res.render('admin/users', {
      user: req.session.user,
      users
    });
  } catch (err) {
    console.error('Get users error:', err);
    res.status(500).render('error', { error: err.message });
  }
};


export const getPostDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id)
      .populate('author', 'nickname email role createdAt')
      .populate('bus', 'numero');

    if (!post) {
      req.flash('error', 'Post non trouvé');
      return res.redirect('/admin/posts');
    }

    // Get related reports for this post
    const reports = await Report.find({ reportedPost: id })
      .populate('reporter', 'nickname email')
      .sort({ date: -1 });

    // Get post content if it's a community post
    let postContent = null;
    if (post.type === 'CommunityPost') {
      const PostContent = (await import('../models/PostContent.js')).default;
      postContent = await PostContent.find({ post: id }).sort({ order: 1 });
    }

    res.render('admin/post-detail', {
      user: req.session.user,
      post,
      reports,
      postContent
    });
  } catch (err) {
    console.error('Get post detail error:', err);
    res.status(500).render('error', { error: err.message });
  }
};

// Add this function to adminController.js

export const getReportDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const report = await Report.findById(id)
      .populate('reporter', 'nickname email role createdAt')
      .populate({
        path: 'reportedPost',
        populate: [
          { path: 'author', select: 'nickname email role' },
          { path: 'bus', select: 'numero' }
        ]
      });

    if (!report) {
      req.flash('error', 'Signalement non trouvé');
      return res.redirect('/admin/reports');
    }

    // Get all reports from the same reporter
    const reporterHistory = await Report.find({
      reporter: report.reporter._id,
      _id: { $ne: id } // Exclude current report
    })
      .populate('reportedPost')
      .sort({ date: -1 })
      .limit(5);

    res.render('admin/report-detail', {
      user: req.session.user,
      report,
      reporterHistory
    });
  } catch (err) {
    console.error('Get report detail error:', err);
    res.status(500).render('error', { error: err.message });
  }
};
