import express from "express";
const router = express.Router();
import * as controller from '../../app/controllers/auth_controller'

/**
 * @swagger
 * components:
 *   schemas:
 *     Auth:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *         - phone_number
 *         - CIN
 *       properties:
 *         name:
 *           type: string
 *           description: The user's full name
 *         email:
 *           type: string
 *           format: email
 *           description: The user's email address
 *         password:
 *           type: string
 *           format: password
 *           description: The user's password
 *         phone_number:
 *           type: string
 *           description: The user's phone number
 *         CIN:
 *           type: string
 *           description: The user's Citizen Identification Number
 * 
 * /auth/login:
 *   post:
 *     summary: Log in a user
 *     tags: [User Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required:
 *               - identifier
 *               - password
 *             properties:
 *               identifier:
 *                 type: string
 *                 description: User's email or phone number
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token for authentication
 *       400:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 * 
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [User Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - phone_number
 *               - CIN
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *               phone_number:
 *                 type: string
 *               CIN:
 *                 type: string
 *     responses:
 *       201:
 *         description: User successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User registered successfully
 *       400:
 *         description: Invalid input or user already exists
 *       500:
 *         description: Server error
 */

router.post('/login', controller.login)
router.post('/register', controller.register)

export default router