import express from "express";
import {  logout, refreshToken, signIn, signUp, verifyToken } from "../Controllers/auth.js";

const router = express.Router();

router.route("/signup")
.post(signUp);

router.route("/login")
.post(signIn);
router.route("/verifyToken/:token")
.get(verifyToken);

router.route("/refreshToken")
.head(refreshToken);

router.route("/logout")
.get(logout);


export const authRoutes = router;
