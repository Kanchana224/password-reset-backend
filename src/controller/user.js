import UserModel from "../models/user.js"
import Auth from "../helper/auth.js"
const getAllUsers=async(req,res)=>{
    try{
        let users = await UserModel.find()
        res.status(200).send({
            message:"User data fetch successful",
            users
        })
    } catch (error) {
        res.status(500).send({
            message:"Internal Server Error"
        })
    }
}
const getUserById = async(req,res)=>{
    try {
        let user = await UserModel.findById({_id:req.params.id})
        res.status(200).send({
            message:"User data fetch successful",
            user
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            message:"Internal Server Error"
        })
    }
}
const createUser = async (req, res) => {
    try {
      // Check if the email exists in the database
      const user = await UserModel.findOne({ email: req.body.email });
  
      if (!user) {
        // If email not found, create the user
        // Create a hash for the password
        req.body.password = await Auth.createHash(req.body.password);
  
        // Save the new user to the database
        let newUser = await UserModel.create(req.body);
  
        res.status(200).send({
          message: "User Added Successfully",
        });
      } else {
        // If email is found, respond with an error message
        res.status(400).send({
          message: `User with ${req.body.email} already exists`,
        });
      }
    } catch (error) {
      res.status(500).send({
        message: "Internal Server Error",
        error: error.message,
      });
    }
  };

const login = async(req,res)=>{
try {
    const {email,password} = req.body
    const user = await UserModel.findOne({email:email})
    //check if the user exists
    if(user)
    {
        //compare the input password and hash
        if(await Auth.hashCompare(password,user.password))
        {
            //create token
            const token = await Auth.createToken({
                name:user.name,
                email:user.email,
                role:user.role
            })
            res.status(200).send({
                message:"Login Successfull",
                token
            })
        }
        else
        {
            res.status(400).send({
                message:`Incorrect Password`
            })
        }
    }
    else
    {
        res.status(400).send({
            message:`User with ${req.body.email} does not exists`
        })
    }
} catch (error) {
    res.status(500).send({
        message:"Internal Server Error",
        error:error.message
    })
}
}

export default {
getAllUsers,
getUserById,
login,
createUser
}