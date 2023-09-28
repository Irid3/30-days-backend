import express from 'express';
import manipulate from '../controller/manipulate.js';

const router = express.Router();

router.get('/owners', manipulate.getAllOwner);
router.get('/owner/:id', manipulate.getOwnerById);
router.get('/category/:id', manipulate.getCategoryById);
router.get('/product/:id', manipulate.getProductById);
router.get('/gets/:id', manipulate.getById);
router.get('/product', manipulate.getAllProduct);
router.get('/category', manipulate.getAllCategory);
router.post('/owner/', manipulate.createOwner);
router.post('/product/', manipulate.createProduct);
router.post('/category/', manipulate.createCategory);
router.put('/owner/:id', manipulate.updateOwnerById);
router.put('/product/:id', manipulate.updateProductById);
router.put('/category/:id', manipulate.updateCategoryById);
router.delete('/owner/:id', manipulate.deleteOwner);
router.delete('/product/:id', manipulate.deleteProduct);
router.delete('/category/:id', manipulate.deleteCategory);

export default router;
