import { Router } from "express";

const router = Router();


router.get("/",(req,res)=>{
  
  res.send("hello from auth route")
  
  })


export default router