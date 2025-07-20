const QuestioniarModel = require('../models/Questioniar.Model')

class Questioniar{

    /**
     * Function to update the data feilds with values of user answers
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async insertQuestioniarData(req, res) {
        try {
        
        } catch (err) {
        
        }
    }

    /**
     * Function to insert the ip_address data 
     */
    static async insertIPAddress(req, res) {
    try {
      const payload = req.body;
      const ip_payload = {
        ...payload
      }

      // Create and save the document in MongoDB
      const ip_data = await QuestioniarModel.create(ip_payload);

      return res.status(201).json({
        success: true,
        message: 'Ip data inserted successfully'
      });
    } catch (err) {
      console.error('Insert Error:', err);
      return res.status(500).json({
        success: false,
        message: 'Failed to insert nominee data',
        error: err.message
      });
    }
  }

}




module.exports = {Questioniar};