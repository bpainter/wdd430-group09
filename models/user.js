"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var userSchema = new mongoose_1.default.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    roles: [{ type: String, enum: ['user', 'artisan', 'admin'] }],
    profile: {
        name: String,
        bio: String,
        location: String,
        avatar: String,
    },
});
exports.default = mongoose_1.default.models.User || mongoose_1.default.model('User', userSchema);
