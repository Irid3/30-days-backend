import { nanoid } from 'nanoid';
import Logging from '../../lib/Logging.js';
import SchemaOwner from '../schema/ownerSchema.js';
import SchemaProduct from '../schema/productSchema.js';
import SchemaCategory from '../schema/categorySchema.js';
import isValid from '../isValid.js';

const Logger = new Logging();

const createOwner = async (req, res) => {
    const { name, email } = req.body;

    let msg = isValid('owner', { name: name, email: email });

    const owner = new SchemaOwner({
        id: nanoid(16),
        name: name,
        email: email
    });
    Logger.info(owner);
    return msg.length > 0
        ? res.status(400).json(msg)
        : await owner
              .save()
              .then((o) => {
                  res.status(201).json({ id: o.id });
              })
              .catch((err) => {
                  Logger.error('Kesalahaan saat menambahkan data');
                  res.status(500).json({ message: 'Kesalahaan saat menambahkan data. Coba ulangi lagi nanti' });
                  Logger.error(err);
              });
};
const createProduct = async (req, res) => {
    const { title, description, price, categoryId, ownerId } = req.body;

    let msg = isValid('product', { title: title, description: description, price: price, categoryId: categoryId, ownerId: ownerId });

    let product = new SchemaProduct({
        id: nanoid(32),
        title: title,
        description: description,
        price: price,
        categoryId: categoryId ? categoryId : null,
        ownerId: ownerId ? ownerId : null
    });

    return msg.length > 0
        ? res.status(400).json(msg)
        : await product
              .save()
              .then((p) => {
                  res.status(201).json({ id: p.id });
              })
              .catch((err) => {
                  Logger.error('Kesalahaan saat menambahkan data');
                  res.status(500).json({ message: 'Kesalahaan saat menambahkan data. Coba ulangi lagi nanti' });
                  Logger.error(err);
              });
};

const createCategory = async (req, res) => {
    const { id, title, description, ownerId } = req.body;

    let msg = isValid('product', { id, title, description, description });

    let category = new SchemaCategory({
        id: nanoid(24),
        title: title,
        description: description,
        ownerId: ownerId
    });

    return msg.length > 0
        ? res.status(400).json(msg)
        : await category
              .save()
              .then((c) => res.status(201).json({ id: c.id }))
              .catch((err) => {
                  Logger.error('Kesalahaan saat menambahkan data');
                  res.status(500).json({ message: 'Kesalahaan saat menambahkan data. Coba ulangi lagi nanti' });
              });
};

const getAllOwner = async (req, res) => {
    return await SchemaOwner.find()
        .lean()
        .then((a) => (a.length > 0 ? res.status(200).json({ owner: a }) : res.status(200).json({ owner: a })))
        .catch((err) => res.status(500).json({ message: 'Kesalahan disisi server' }));
};

const getOwnerById = async (req, res) => {
    const id = req.params.id;
    let msg = isValid('id', id);

    let owner = await SchemaOwner.findOne().where({ id: id }).select({ name: true, email: true });

    try {
        let product = await SchemaProduct.findById({ ownerId: id });
        let category = await SchemaCategory.findById({ ownerId: id });

        owner['product'] = product ? { id: product.id, title: product.title, description: product.description, price: product.price, category: category ? category.title : '' } : {};
    } catch (e) {
        Logger.error('product atau category belum ada');
    }
    return msg.length > 0 ? res.status(400).json(msg) : owner ? res.status(200).json(owner) : res.status(200).json({ message: 'Not Found' });
};
const getProductById = async (req, res) => {
    const id = req.params.id;

    let msg = isValid('id', id);

    let product = await SchemaProduct.findOne().where({ id: id }).select({ title: true, description: true, price: true, ownerId: true });
    let owner, category;
    if (product.ownerId) {
        owner = await SchemaOwner.findOne().where({ id: product.ownerId }).select({ name: true, email: true });
        owner ? (product._doc['owner'] = { name: owner.name, email: owner.email }) : (product._doc['owner'] = {});
    }
    Logger.info(product._doc);
    if (product.categoryId) {
        category = await SchemaCategory.findOne().where({ ownerId: product.ownerId }).select({ title: true, description: true });
        category ? (product._doc['category'] = { title: category.title, description: category.description }) : (product._doc['category'] = {});
    }
    try {
        delete product._doc.ownerId;
        delete product._doc._id;
    } catch (err) {
        Logger.error('product tidak ada');
    }
    return msg.length > 0 ? res.status(400).json(msg) : product ? res.status(200).json(product) : res.status(200).json({ message: 'Not Found' });
};

const getCategoryById = async (req, res) => {
    const id = req.params.id;

    let msg = isValid('id', id);

    let category = await SchemaCategory.findOne()
        .where({ id: id })
        .select({ title: true, description: true, ownerId: true })
        .then((c) => {
            c ? { c } : res.status(404).json({ message: 'Not Found' });
        })
        .catch((err) => {
            Logger.error(`Error while parsing : \n${err}`);
            res.status(500).json({ message: 'Kesalahan disisi server' });
        });

    try {
        let owner = await SchemaOwner.findOne().where({ id: category.ownerId }).select({ name: true, email: true });
        category['owner'] = owner ? owner : {};
    } catch {
        Logger.error('OwnerId tidak ditemukan');
    }
    try {
        let product = await SchemaProduct.findOne().where({ ownerId: category.ownerId }).select({ title: true, description: true, price: true });
        category['product'] = product ? product : {};
    } catch {
        Logger.error('ProductId belum di isi/ tidak ditemukan');
    }

    return msg.length > 0 ? res.status(400).json(msg) : category ? res.status(200).json(category) : res.status(200).json({ message: 'Not Found' });
};

const getById = async (req, res) => {
    const id = req.params.id;

    let owner = await SchemaOwner.findOne().where({ id: id }).select({ name: true, email: true });
    let product = await SchemaProduct.findOne().where({ id: id }).select({ name: true, description: true, price: true });
    let category = await SchemaCategory.findOne().where({ id: id }).select({ title: true, description: true, ownerId: true });
    if (owner) delete owner._id;
    if (product) delete product._id;
    if (category) delete category._id;
    delete owner._id;
    console.log(owner);
    return owner ? res.status(200).json(owner) : product ? res.status(200).json(product) : category ? res.status(200).json(category) : res.status(404).json({ message: 'Not Found' });
};

const updateOwnerById = async (req, res) => {
    const id = req.params.id;
    const prop = req.body;
    let msg = isValid('owner', req.body);
    let owner = await SchemaOwner.findOne().where({ id: id });
    let props = {};
    Object.entries(owner).forEach(([k, v]) => {
        if (v !== undefined) {
            props[k] = v;
        } else {
            props[k] = prop[k];
        }
    });

    let ownerUpdated = await SchemaOwner.findOneAndUpdate({ id: id }, props);

    return msg.length > 0 ? res.status(400).json(msg) : ownerUpdated ? res.status(201).json({ message: 'Updated!!!' }) : res.status(404).json({ message: 'Not Found' });
};

const updateProductById = async (req, res) => {
    const id = req.params.id;
    const prop = req.body;
    let msg = isValid('product', req.body);
    let product = await SchemaProduct.findOne().where({ id: id });
    let props = {};
    Object.entries(product._doc).forEach(([k, v]) => {
        if (prop[k] === undefined || prop[k] === null) {
            props[k] = v;
        } else {
            Logger.info('here else ' + prop[k]);
            props[k] = prop[k];
        }
    });
    let productUpdated = await SchemaProduct.findOneAndUpdate({ id: id }, props);

    return msg.length > 0 ? res.status(400).json(msg) : productUpdated ? res.status(201).json({ message: 'Updated!!!' }) : res.status(404).json({ message: 'Not Found' });
};
const updateCategoryById = async (req, res) => {
    const id = req.params.id;
    const prop = req.body;
    let msg = isValid('category', req.body);
    let category = await SchemaCategory.findOne().where({ id: id });
    let props = {};
    Object.entries(category).forEach(([k, v]) => {
        if (v === undefined) {
            props[k] = v;
        } else {
            props[k] = prop[k];
        }
    });

    let categoryUpdated = await SchemaCategory.findOneAndUpdate({ id: id }, props);

    return msg.length > 0 ? res.status(400).json(msg) : categoryUpdated ? res.status(201).json({ message: 'Updated!!!' }) : res.status(404).json({ message: 'Not Found' });
};

const deleteOwner = async (req, res) => {
    const id = req.params.id;

    let isDeleted = await SchemaOwner.findOneAndDelete({ id: id });
    if (isDeleted) {
        await SchemaCategory.findOneAndDelete({ ownerId: id });
        await SchemaProduct.findOneAndDelete({ ownerId: id });
    }
    return isDeleted ? res.status(201).json({ message: 'Deleted!!!' }) : res.status(404).json({ message: 'Not Found' });
};
const deleteProduct = async (req, res) => {
    const id = req.params.id;

    let isDeleted = await SchemaProduct.findOneAndDelete({ id: id });
    return isDeleted ? res.status(201).json({ message: 'Deleted!!!' }) : res.status(404).json({ message: 'Not Found' });
};
const deleteCategory = async (req, res) => {
    const id = req.params.id;

    let isDeleted = await SchemaCategory.findOneAndDelete({ id: id });
    if (isDeleted) {
        await SchemaProduct.findOneAndUpdate({ categoryId: id }, { categoryId: undefined });
    }
    return isDeleted ? res.status(201).json({ message: 'Deleted!!!' }) : res.status(404).json({ message: 'Not Found' });
};

export default {
    createOwner,
    createProduct,
    createCategory,
    getAllOwner,
    getById,
    getOwnerById,
    getCategoryById,
    getProductById,
    updateOwnerById,
    updateCategoryById,
    updateProductById,
    deleteOwner,
    deleteCategory,
    deleteProduct
};
