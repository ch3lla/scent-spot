const router = require('express').Router();
const {
  getAllUsers,
  getUserStats,
  updateUser,
  deleteUser,
  getSingleUser,
} = require('../controllers/users.controllers');
const { getCart, checkoutCart } = require('../controllers/cart.controller');
const {
  getProducts,
  addProducts,
  updateProducts,
  deleteProducts,
} = require('../controllers/product.controller');
const { register, login } = require('../controllers/auth');
const { verifyToken, verifyTokenAndAdmin } = require('../utils/verifyToken');

router.post('/auth/register', register);
router.post('/auth/login', login);

router.get('/products', getProducts);
router.get('/products', verifyToken, addProducts);

router.put('/products/product', verifyTokenAndAdmin, updateProducts, deleteProducts);

router.get('/cart', verifyToken, getCart);
router.post('/create-checkout-session', verifyToken, checkoutCart);

router.get('/users', verifyTokenAndAdmin, getAllUsers, getUserStats);
router.get('/users/:id', verifyTokenAndAdmin, getSingleUser);

router.put('/users/:id', verifyToken, updateUser);
router.delete('/users/:id', verifyToken, deleteUser);

module.exports = router;
