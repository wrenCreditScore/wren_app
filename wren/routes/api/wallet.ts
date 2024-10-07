import express from "express";
const router = express.Router();
import * as controller from '../../app/controllers/wallet_controller'
import { verifyToken } from '../../app/middleware/verify'

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     jwtAuth:
 *       type: apiKey
 *       in: header
 *       name: Authorization
 *       description: JWT token without 'Bearer' prefix
 *   schemas:
 *     Wallet:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The wallet's unique identifier
 *         wallet_address:
 *           type: string
 *           description: The wallet's blockchain address
 *         balance:
 *           type: number
 *           description: The wallet's current balance
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 * 
 * /api/v1/user/wallets:
 *   get:
 *     summary: Get all wallets for the authenticated user
 *     tags: [Wallets]
 *     security:
 *       - jwtAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved wallets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Wallet'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 * 
 * /api/v1/user/wallets/add:
 *   post:
 *     summary: Add a new wallet for the authenticated user
 *     tags: [Wallets]
 *     security:
 *       - jwtAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required:
 *               - wallet_address
 *             properties:
 *               wallet_address:
 *                 type: string
 *                 description: The wallet's blockchain address
 *     responses:
 *       201:
 *         description: Successfully added new wallet
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Wallet'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 * 
 * /api/v1/user/wallets/update/{id}:
 *   put:
 *     summary: Update a wallet for the authenticated user
 *     tags: [Wallets]
 *     security:
 *       - jwtAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The wallet's unique identifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               wallet_address:
 *                 type: string
 *                 description: The updated wallet address
 *     responses:
 *       200:
 *         description: Successfully updated wallet
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Wallet'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Wallet not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 * 
 * /api/v1/user/wallets/delete/{id}:
 *   delete:
 *     summary: Delete a wallet for the authenticated user
 *     tags: [Wallets]
 *     security:
 *       - jwtAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The wallet's unique identifier
 *     responses:
 *       200:
 *         description: Successfully deleted wallet
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Wallet successfully deleted
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Wallet not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

router.get('/', verifyToken, controller.getWallets)
router.post('/add', verifyToken, controller.addWallet)
router.put('/update/:id', verifyToken, controller.updateWallet)
router.delete('/delete/:id', verifyToken, controller.removeWallet)

export default router