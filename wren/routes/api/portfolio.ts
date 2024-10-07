import express from "express";
const router = express.Router();
import * as controller from '../../app/controllers/portfolio_controller'
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
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string

 * /user/portfolio/generate_score:
 *   post:
 *     summary: Generate a new credit score for the authenticated user
 *     tags: [Portfolio]
 *     security:
 *       - jwtAuth: []
 *     responses:
 *       200:
 *         description: Successfully generated new credit score
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 score:
 *                   type: number
 *                   description: The newly generated credit score
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
 * /user/portfolio/get_score:
 *   post:
 *     summary: Get credit score for the authenticated user
 *     tags: [Portfolio]
 *     security:
 *       - jwtAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved credit score
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 score:
 *                   type: number
 *                   description: The user's credit score
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
 */

router.post('/get_score', verifyToken, controller.getCreditScoreByUserId)
router.post('/generate_score', verifyToken, controller.generateScore)

export default router