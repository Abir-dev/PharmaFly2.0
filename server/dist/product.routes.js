"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const product_model_1 = __importDefault(require("./product.model"));
const db_1 = __importDefault(require("./lib/db"));
const router = express_1.default.Router();
// Get all products
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, db_1.default)();
    try {
        const products = yield product_model_1.default.find().sort({ created_at: -1 });
        res.json(products);
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to fetch products' });
    }
}));
// Get product by ID
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, db_1.default)();
    try {
        const product = yield product_model_1.default.findById(req.params.id);
        if (!product)
            return res.status(404).json({ error: 'Product not found' });
        res.json(product);
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to fetch product' });
    }
}));
// Add new product
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, db_1.default)();
    try {
        const product = new product_model_1.default(Object.assign({}, req.body));
        yield product.save();
        res.status(201).json(product);
    }
    catch (err) {
        res.status(400).json({ error: 'Failed to add product', details: err });
    }
}));
// Update product
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, db_1.default)();
    try {
        const product = yield product_model_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!product)
            return res.status(404).json({ error: 'Product not found' });
        res.json(product);
    }
    catch (err) {
        res.status(400).json({ error: 'Failed to update product', details: err });
    }
}));
// Delete product
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, db_1.default)();
    try {
        const product = yield product_model_1.default.findByIdAndDelete(req.params.id);
        if (!product)
            return res.status(404).json({ error: 'Product not found' });
        res.json({ message: 'Product deleted' });
    }
    catch (err) {
        res.status(400).json({ error: 'Failed to delete product', details: err });
    }
}));
exports.default = router;
