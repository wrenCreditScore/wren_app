import { createPartner, getCreditScoreByCID } from '../services/partner'

export async function addPartner(req, res) {
    const body = req.body;

    try {

        const result = await createPartner(body);

        if(!result.success) res.status(500).json({ error: result.message });

        res.status(200).json({message: result.message, token: result.token});

    } catch (error) {
        res.status(500).json({ error: `An error occurred while adding partner: ${error}` });
    }
}

export async function getUserCreditScore(req, res) {
    const id = req.params.cid;

    console.log(id);

    res.status(200).json({message: id});
}