const QuestioniarModel = require('../models/Questioniar.Model')

class Questioniar{

  
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
      await QuestioniarModel.create(ip_payload);

      return res.status(201).json({
        success: true,
        message: 'Ip data inserted successfully'
      });
    } catch (err) {
      console.error('Insert Error:', err);
      return res.status(500).json({
        success: false,
        message: 'Failed to insert ip data',
        error: err.message
      });
    }
  }

  /**
   * Function to update the data feilds with values of user answers
   * @param {*} req 
   * @param {*} res 
   * @returns 
   */
  // static async insertQuestioniarData(req, res) {
  //     try {

  //       // get the payload
  //       // get the unique id from the params
  //       // calculate the skin type which wins
  //       // and store the data in the database

  //       // 1. make the object 
  //       /**
  //        * result_obj = {
  //        *   "FLARE": {
  //        *              first_five_qst_point: 0,
  //        *              total_point : 0
  //        *            },
  //        *   "BLOOM": {
  //        *              first_five_qst_point: 0,
  //        *              total_point : 0
  //        *            },
  //        *   "HAZE": {
  //        *              first_five_qst_point: 0,
  //        *              total_point : 0
  //        *            },
  //        *   "CALM": {
  //        *              first_five_qst_point: 0,
  //        *              total_point : 0
  //        *            },
  //        *   "FORGE": {
  //        *              first_five_qst_point: 0,
  //        *              total_point : 0
  //        *            },
  //        *   "GLOW": {
  //        *              first_five_qst_point: 0,
  //        *              total_point : 0
  //        *            },
  //        *   "MUSE": {
  //        *              first_five_qst_point: 0,
  //        *              total_point : 0
  //        *            },
  //        * }
  //        * 
  //        * 2. loop though the payload keys and get the skin_type key and store the frist 5 from answer_1 to answer_5 skin_type value data will be added in the first_five_qst_point and as well as the total_point key on the result object and from answer_6 the value will one added to the total_point key
  //        * 3. loop through the result object and check from the whose total_point value is the highest give that key name 
  //        * 4. else if more than 1 total_point has the highest value it means we nee to do tie breaker then only check from the first_five_qst_point whose first_five_qst_point is the highest store that key 
  //        */

        
      
  //     } catch (err) {
      
  //     }
  // }

  static async insertQuestioniarData(req, res) {
  try {
    const payload = req.body; // Your array of answers
    const { unique_id } = req.params; // Unique ID from request params

    // Step 1: Initialize result object with all skin types
    const skinTypes = ["FLARE", "BLOOM", "HAZE", "CALM", "FORGE", "GLOW", "MUSE"];
    const resultObj = {};

    for (const type of skinTypes) {
      resultObj[type] = {
        first_five_qst_point: 0,
        total_point: 0,
      };
    }

    // Step 2: Loop through payload and calculate points
    for (let i = 0; i < payload.length; i++) {
      const answer = payload[i];
      const answerData = Object.values(answer)[0];

      if (answerData?.skin_type && Array.isArray(answerData.skin_type)) {
        for (const typeObj of answerData.skin_type) {
          const [type, value] = Object.entries(typeObj)[0];

          if (resultObj.hasOwnProperty(type)) {
            resultObj[type].total_point += value;
            if (i < 5) {
              resultObj[type].first_five_qst_point += value;
            }
          }
        }
      }
    }

    // Step 3: Find max total_point skin type(s)
    let maxTotal = 0;
    let maxSkinTypes = [];

    for (const [type, scores] of Object.entries(resultObj)) {
      if (scores.total_point > maxTotal) {
        maxTotal = scores.total_point;
        maxSkinTypes = [type];
      } else if (scores.total_point === maxTotal) {
        maxSkinTypes.push(type);
      }
    }

    // Step 4: Tie breaker using first_five_qst_point
    let finalSkinType = null;

    if (maxSkinTypes.length === 1) {
      finalSkinType = maxSkinTypes[0];
    } else {
      let maxFirstFive = 0;

      for (const type of maxSkinTypes) {
        if (resultObj[type].first_five_qst_point > maxFirstFive) {
          maxFirstFive = resultObj[type].first_five_qst_point;
          finalSkinType = type;
        }
      }
    }

    // this part is done to save the answers in the db 
    const flattenedAnswers = payload.reduce((acc, curr) => {
      const [key, value] = Object.entries(curr)[0];
      acc[key] = value;
      return acc;
    }, {});

    // Step 5: Save data in DB
    const dataToStore = {
     ...flattenedAnswers,
     result_type: finalSkinType
    };

    // Assuming you have a Mongoose model called QuestionnaireResult
    await QuestioniarModel.findOneAndUpdate(
      { unique_id },           // Filter by user_id from params
      { $set: dataToStore },     // Update with this data
      { new: true } // and return the updated document
    );
    return res.status(200).json({
      message: "Questionnaire data saved successfully",
      result: finalSkinType,
      breakdown: resultObj,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Something went wrong while processing the questionnaire.",
    });
  }
}

/**
 * Fundtion to get the questioniar data bu unique id
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
static async getQuestioniarData(req, res) {
  try {
    // Get the unique_id from params
    const { unique_id } = req.params;

    // Find the document using unique_id (not _id), exclude email field
    const data = await QuestioniarModel.findOne({ unique_id }).select('-email');

    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'No data found for this unique ID'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Data fetched successfully',
      data
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching data'
    });
  }
}


}




module.exports = {Questioniar};