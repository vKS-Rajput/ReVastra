import express from "express"
import { addToCart,getUserCart,updateCart } from "../controllors/cartControllor.js"
import authUser from "../middleware/userAuth.js"

const cartRouter = express.Router()
 
// Get user cart (Fetch)
cartRouter.post('/get', getUserCart)
 
// Add item to cart
cartRouter.post('/add', addToCart)
 
// Update cart item
cartRouter.post('/update', updateCart)

export default cartRouter
