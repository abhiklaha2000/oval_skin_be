const QuestioniarModel = require('../models/Questioniar.Model')

class Questioniar{

 static isNotEmpty(value) {
  if (value === null || value === undefined) return false;

  if (typeof value === 'string' && value.trim() === '') return false;

  if (Array.isArray(value) && value.length === 0) return false;

  if (typeof value === 'object' && !Array.isArray(value)) {
    if (Object.keys(value).length === 0) return false;
  }

  if (typeof value === 'number' && isNaN(value)) return false;

  return true;
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
      await QuestioniarModel.create(ip_payload);

      // // 2. Update or create the total_user_count in DashboardModel
      // const dashboard_entry_exist = await DashboardModel.findOne();

      // if (dashboard_entry_exist) {
      //   // If an entry exists, increment the total_user_count
      //   dashboard_entry_exist.total_user_count = (dashboard_entry_exist?.total_user_count || 0) + 1;
      //   await dashboard_entry_exist.save();
      // } else {
      //   // If no entry exists, create one with total_user_count = 1
      //   await DashboardModel.create({ total_user_count: 1 });
      // }
      return res.status(201).json({
        success: true,
        message: 'Ip data inserted successfully',
        data: {
          unique_id: payload?.unique_id
        }
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

    // check if the user has already give the quiz or not
    const user_given_quiz = await QuestioniarModel.findOne({ unique_id });

    if (user_given_quiz && user_given_quiz.is_quiz_completed) {
       throw new Error("You have already completed the quiz") 
    }

    // Step 1: Initialize result object with all skin types
    const skinTypes = ["FLARE", "BLOOM", "HAZE", "CALM", "FORGE", "GLOW", "MUSE", "DUSK"];
    const resultObj = {};

    for (const type of skinTypes) {
      resultObj[type] = {
        first_five_qst_point: 0,
        total_point: 0,
      };
    }

    // Step 2: Loop through payload and calculate points
    for (let i = 0; i < payload?.answers.length; i++) {
      const answer = payload?.answers[i];
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
    const flattenedAnswers = payload?.answers.reduce((acc, curr) => {
      const [key, value] = Object.entries(curr)[0];
      acc[key] = value;
      return acc;
    }, {});

    // Step 5: Save data in DB
    const dataToStore = {
     ...flattenedAnswers,
     result_type: finalSkinType,
     is_quiz_completed: payload?.is_quiz_completed,
     avg_time_per_qst: payload?.avg_time_per_qst,
     avg_total_time_per_completion:payload?.avg_total_time_per_completion
    };

    // Assuming you have a Mongoose model called QuestionnaireResult
    await QuestioniarModel.findOneAndUpdate(
      { unique_id },           // Filter by user_id from params
      { $set: dataToStore },     // Update with this data
      { new: true } // and return the updated document
    );

   // update the user_quiz_completed by +1
   // check if the avg_time_per_qst & avg_total_time_per_completion is 0 or not
   // if 0 then enter the payload data to the DashBoardModel and update it and if not 0 then get the avg_time_per_qst + the payload?.avg_time_per_qst / 2 and do the same for the avg_total_time_per_completion 
   // check if the skin_type_percentage is a empty object or not 
   // if it is empty then make the object like this  
  //           {        
  //             
  //        *   "FLARE": {
  //        *              total_user: 0,
  //        *              percentage : ""
  //        *            },
  //        *   "BLOOM": {
  //        *              total_user: 0,
  //        *              percentage : ""
  //        *            },
  //        *   "HAZE": {
  //        *              total_user: 0,
  //        *              percentage : ""
  //        *            },
  //        *   "CALM": {
  //        *              total_user: 0,
  //        *              percentage : ""
  //        *            },
  //        *   "FORGE": {
  //        *              total_user: 0,
  //        *              percentage : ""
  //        *            },
  //        *   "GLOW": {
  //        *              total_user: 0,
  //        *              percentage : ""
  //        *            },
  //        *   "MUSE": {
  //        *              total_user: 0,
  //        *              percentage : ""
  //        *            },
  //        * }
  //        * 
  // and as per the finalSkinType update the total_user by +1 of that finalSkinType object key and calculate the percentage
  // and if the object was already created then update the finalSkinType object key by +1 and calcute the percentage and update the percentage key
     // Step 6: Dashboard update



    

    return res.status(200).json({
      message: "Questionnaire data saved successfully",
      success: true,
      result: finalSkinType,
      breakdown: resultObj,
      unique_id
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: err?.message || "Something went wrong while processing the questionnaire.",
      success: false
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

/**
 * Get all questioniar of all the users who has taken part in the quiz
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
static async getAllQuestioniarData(req, res) {
  try {
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = 10;
    const skip = (page - 1) * limit;

    // Fetch data with pagination and status = active
    const [data, total] = await Promise.all([
      QuestioniarModel.find()
        .skip(skip)
        .limit(limit)
        .lean()
        .sort({ createdAt: -1 }), // optional: sort latest first

      QuestioniarModel.countDocuments()
    ]);

    return res.status(200).json({
      success: true,
      message: "Questionnaire data fetched successfully",
      current_page: page,
      total_pages: Math.ceil(total / limit),
      total_records: total,
      data: {questioniars: data}
    });

  } catch (err) {
    console.error("Error fetching questionnaire data:", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching questionnaire data."
    });
  }
}

/**
 * Update single feild of the questioniar is_share
 * @param {*} res 
 * @param {*} req 
 */
static async updateSingleFeild(req, res) {
  try {
    const { unique_id } = req.params;
    const { is_share, email } = req.body;

    const updateFields = {};
    const updateQuery = {};

    // Conditionally add is_share if it's a boolean
    if (Questioniar.isNotEmpty(is_share)) {
      if (typeof is_share !== 'boolean') {
        console.log("cal....1111")
        return res.status(400).json({
          success: false,
          message: "'is_share' must be a boolean value (true or false)"
        });
      }
      updateFields.is_share = is_share;
      updateQuery.$inc = { total_share: 1 }; // Only increment if is_share is updated
    }

    // Conditionally add email if it's not empty
    if (Questioniar.isNotEmpty(email)) {
      updateFields.email = email;
      updateFields.is_email = true;
    }

    // If nothing is provided to update
    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided to update"
      });
    }

    updateQuery.$set = updateFields;

    const updatedData = await QuestioniarModel.findOneAndUpdate(
      { unique_id },
      updateQuery,
      { new: true }
    );
    if (!updatedData) {
      return res.status(404).json({
        success: false,
        message: "Questionnaire with the given unique_id not found"
      });
    }
    return res.status(200).json({
      success: true,
      is_email_sent:  Questioniar.isNotEmpty(email) ? true : false,
      message: Questioniar.isNotEmpty(email) ? "Email sent successfully" : "Fields updated successfully",
      data: { questioniar: updatedData }
    });

  } catch (err) {
    console.error("Error updating fields:", err);
    return res.status(500).json({
      success: false,
      is_email_sent: false,
      message: "Something went wrong while updating the field"
    });
  }
}



/**
 * Function to get the data for the dashboard
 */
static async getDataForDashboard(req,res){
    // get all the questioniar 
    // check how many user have completed the quiz by checking is_quiz_completed = true
    try {
    let skin_type_result = {
      FLARE: 0,
      BLOOM: 0,
      HAZE: 0,
      CALM: 0,
      FORGE: 0,
      GLOW: 0,
      MUSE: 0,
      DUSK: 0
    }
    // Fetch all questionnaires
    const all_questioniars = await QuestioniarModel.find();
    const total_questioniar = all_questioniars.length;
    console.log("total_questioniar----", total_questioniar)

    // Count how many users completed the quiz
    const completed_count = await QuestioniarModel.countDocuments({ is_quiz_completed: true });
    console.log("completed_count----", completed_count)

    const dropoff_user = total_questioniar - completed_count;
    console.log("dropoff_user----", dropoff_user)

    // get the avg_time_per_qst and the avg_total_time_per_completion 
    // loop through all_questioniars array and get the key of that user whose is_quiz_completed is true and calculate the avarage for this two keys of each user whose  is_quiz_completed is true
    // Filter and process completed quizzes
    const all_user_completed_quiz = all_questioniars.filter(user => user?.is_quiz_completed === true)
    const total_user_share_result = all_user_completed_quiz.filter(user => user?.is_share === true).length;
    const all_email_given_users = all_user_completed_quiz.filter(user => user?.is_email === true).length;
    // loop through the all_questioniars and make a object push the skin type if the result_type is present in the skin_type_result then increase that key value by 1 each time
    for (const user of all_user_completed_quiz) {
      const resultType = user.result_type;

      if (resultType && skin_type_result.hasOwnProperty(resultType)) {
        skin_type_result[resultType] += 1;
      }
    }

    const ipStats = {};
    let totalCompletedUsers = 0;

    for (const user of all_user_completed_quiz) {
      if (user.is_quiz_completed && user.ip_address) {
        totalCompletedUsers++;

        const ip = user.ip_address;
        if (!ipStats[ip]) {
          ipStats[ip] = 1;
        } else {
          ipStats[ip] += 1;
        }
      }
    }
    console.log("ipStats====", ipStats)

    // Calculate how many IPs have restarts (count > 1)
    let restartCount = 0;
    for (const ip in ipStats) {
      if (ipStats[ip] > 1) {
        restartCount += ipStats[ip] - 1; // count extra attempts only
      }
    }

    // Calculate percentage
    const restartRatePercentage = totalCompletedUsers > 0 ? ((restartCount / totalCompletedUsers) * 100).toFixed(2) : 0;
    console.log("restartRatePercentage---",restartRatePercentage)
    // Step 2: Calculate total and average
    let total_avg_time_per_qst = 0;
    let total_avg_total_time_per_completion = 0;
    let count = all_user_completed_quiz.length;

    all_user_completed_quiz.forEach(user => {
      const timePerQst = Number(user.avg_time_per_qst) || 0;
      const totalTime = Number(user.avg_total_time_per_completion) || 0;

      total_avg_time_per_qst += timePerQst;
      total_avg_total_time_per_completion += totalTime;
    });

    const average_avg_time_per_qst = count ? (total_avg_time_per_qst / count) : 0;
    const average_avg_total_time_per_completion = count ? (total_avg_total_time_per_completion / count) : 0;

    console.log("average_avg_time_per_qst----", average_avg_time_per_qst)
    console.log("average_avg_total_time_per_completion----", average_avg_total_time_per_completion)
    console.log("skin_type_result---", skin_type_result)
    return res.status(200).json({
      success: true,
      data: {
         total_user: total_questioniar,
         quiz_completed_count: completed_count,
         dropoff_user_count: dropoff_user,
         average_avg_time_per_qst,
         average_avg_total_time_per_completion,
         total_user_share_result,
         skin_type_result,
         quiz_restart_rate : restartRatePercentage,
         total_email_given_users: all_email_given_users
      }
    });
  } catch (error) {
    console.error('Error fetching questionnaire data:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching questionnaire data',
      error: error.message
    });
  }
}





}




module.exports = {Questioniar};