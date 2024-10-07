import express from "express";
const router = express.Router();
import * as controller from '../../app/controllers/partner_controller'
import { verifyPartnerToken } from '../../app/middleware/verifyPartnerToken'


/**
 * @swagger
 * components:
 *   securitySchemes:
 *     partnerAuth:
 *       type: apiKey
 *       in: header
 *       name: x-access-token
 *       description: Partner authentication token
 *   schemas:
 *     Partner:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The partner's unique identifier
 *         name:
 *           type: string
 *           description: The partner's name
 *         phone_number:
 *           type: string
 *           description: The partner's phone number
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 * 
 * /partner/get-token:
 *   post:
 *     summary: Add a new partner and get an authentication token
 *     tags: [Partner]
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - phone_number
 *             properties:
 *               name:
 *                 type: string
 *                 description: The partner's name
 *               phone_number:
 *                 type: string
 *                 description: The partner's phone number
 *     responses:
 *       201:
 *         description: Successfully added partner and generated token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Partner authentication token
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 * 
 * /partner/get-user-score/{cid}:
 *   get:
 *     summary: Get a user's credit score by their Citizen Identification Number (CIN)
 *     tags: [Partner]
 *     security:
 *       - partnerAuth: []
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         schema:
 *           type: string
 *         description: The user's Citizen Identification Number (CIN)
 *     responses:
 *       200:
 *         description: Successfully retrieved user's credit score
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
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */


router.post('/get-token', controller.addPartner)
router.get('/get-user-score/:cid', verifyPartnerToken, controller.getUserCreditScore)


export default router