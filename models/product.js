"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var productSchema = new mongoose_1.default.Schema({
    artisan: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    images: [String],
    categories: [String],
    averageRating: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
});
exports.default = mongoose_1.default.models.Product || mongoose_1.default.model('Product', productSchema);
