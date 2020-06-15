import { NextFunction, Response, Request } from "express";

export const index = async (req: Request, res: Response, next: NextFunction) => {
    return res.send("Hello");
};
