import {db} from "../../db/kysely/kysely.js"
import { Request,Response } from "express"
export  async function addToCart(req:Request,res:Response){
    const user = req.user;
    const Id = user!.Id;
    if(!Id){
        return res.status(401).json({"message":"Unauthorized"})
    }
    const {ItemId,Quantity} = req.body
    const item = await db.selectFrom("Cart").selectAll().where("ItemId","=",ItemId).execute()
    if(item.length > 0){
        return res.status(400).json({"message":"Item already in cart"})
    }
    const query =await db.insertInto("Cart").values({
        Id:crypto.randomUUID(),
        UserId:Id,
        ItemId:ItemId,
        Quantity:Quantity
    }).returningAll().execute()
    return res.status(200).json({"message":"Item added to cart successfully", "cartItem": query})
}

export async function getCartItems(req:Request,res:Response){
    const user = req.user;
    const Id = user!.Id;
    if(!Id){
        return res.status(401).json({"message":"Unauthorized"})
    }
    const cartItems = await db
  .selectFrom("Cart")
  
  .innerJoin(
     "Store",
     "Cart.ItemId",
     "Store.Id"
  )

  .select([
     "Cart.Id",
     "Cart.Quantity",
     "Store.Id as ItemId",
     "Store.Name",
     "Store.Price",
     "Store.ImageUrl",
     "Store.Status"
  ])

  .where("Cart.UserId", "=",Id)

  .execute();
    return res.status(200).json(cartItems)
}

export async function removefromcart(req:Request,res:Response){
    const user = req.user;
    const Id = user!.Id;
    if(!Id){
        return res.status(401).json({"message":"Unauthorized"})
    }
    const cartItemId = req.params.id
    await db.deleteFrom("Cart").where("Id","=",cartItemId).execute()
    return res.status(200).json({"message":"Item removed from cart successfully"})
} 