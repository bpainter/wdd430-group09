"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var reviewSchema = new mongoose_1.default.Schema({
    product: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Product', required: true },
    user: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: String,
    moderated: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});
exports.default = mongoose_1.default.models.Review || mongoose_1.default.model('Review', reviewSchema);
